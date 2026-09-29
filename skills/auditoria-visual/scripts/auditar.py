#!/usr/bin/env python3
"""Audita uma pagina medindo o que ela renderiza.

    python3 auditar.py http://localhost:5173/
    python3 auditar.py --dir ./dist --base /meu-projeto/

Sobe o servidor dentro do processo quando recebe --dir: gerenciar um processo
separado e a parte que mais falha (porta ocupada, bind so em IPv6, o pkill
casando com o proprio comando).
"""
import argparse, functools, http.server, io, socketserver, sys, threading

try:
    from playwright.sync_api import sync_playwright
    from PIL import Image
except ImportError:
    sys.exit("faltam dependencias: pip install playwright pillow && playwright install chromium")

LARGURAS = [("desktop", 1440, 900), ("tablet", 900, 1200), ("mobile", 390, 844)]


def luminancia(px):
    def canal(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * canal(px[0]) + 0.7152 * canal(px[1]) + 0.0722 * canal(px[2])


def razao(a, b):
    l1, l2 = sorted([luminancia(a), luminancia(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)


# Converte pelo canvas: o navegador devolve oklch(...) no getComputedStyle, e
# ler esses numeros como RGB da um resultado plausivel e errado.
JS_CONTRASTE = r"""() => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const srgb = (cor) => { cx.clearRect(0,0,1,1); cx.fillStyle='#fff'; cx.fillRect(0,0,1,1);
    cx.fillStyle = cor; cx.fillRect(0,0,1,1);
    const d = cx.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]]; };
  const opaco = (cor) => { cx.clearRect(0,0,1,1); cx.fillStyle = cor; cx.fillRect(0,0,1,1);
    return cx.getImageData(0,0,1,1).data[3] > 240; };
  const fundo = (el) => { let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && bg !== 'transparent' && opaco(bg)) return srgb(bg);
      n = n.parentElement; }
    return [255,255,255]; };
  const vis = (el) => { const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  const out = [];
  const sel = 'p,li,td,th,h1,h2,h3,h4,h5,h6,a,button,span,code,strong,b,em,dt,dd,label';
  for (const el of document.querySelectorAll(sel)) {
    if (!vis(el)) continue;
    const txt = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!txt) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize), peso = parseInt(cs.fontWeight) || 400;
    out.push({ tag: el.tagName.toLowerCase(), cls: (el.className||'').toString().slice(0,26),
      cor: srgb(cs.color), fundo: fundo(el), fs,
      grande: fs >= 24 || (fs >= 18.66 && peso >= 700),
      amostra: (el.textContent||'').trim().slice(0,32) });
  }
  return out;
}"""

JS_TOQUE = r"""() => {
  const out = [];
  for (const el of document.querySelectorAll('a,button,input,select,[role=button],[role=tab]')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Link dentro de frase e excecao da WCAG 2.5.8; link sozinho nao e.
    if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
    if (r.width < 44 || r.height < 44)
      out.push(`${el.tagName.toLowerCase()}.${(el.className||'-').toString().slice(0,22)} `
               + `${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return out;
}"""

JS_ANIMA = "() => [...document.querySelectorAll('*')].filter(e => " \
           "getComputedStyle(e).animationName !== 'none').length"


def auditar(url, servidor=None):
    falhas = 0
    with sync_playwright() as p:
        nav = p.chromium.launch()

        for nome, w, h in LARGURAS:
            pg = nav.new_page(viewport={"width": w, "height": h})
            erros = []
            pg.on("pageerror", lambda e: erros.append(str(e)))
            pg.on("console", lambda m: erros.append(m.text) if m.type == "error" else None)
            pg.goto(url, wait_until="networkidle")
            pg.wait_for_timeout(1500)

            sw = pg.evaluate("document.documentElement.scrollWidth")
            cw = pg.evaluate("document.documentElement.clientWidth")
            rola = sw > cw + 1
            falhas += rola
            print(f"\n── {nome} ({w}px) " + "─" * 44)
            print(f"  {'FALHA' if rola else 'ok   '} rolagem horizontal  "
                  f"scrollWidth={sw} clientWidth={cw}")

            toque = pg.evaluate(JS_TOQUE)
            falhas += len(toque)
            if toque:
                for t in toque[:6]:
                    print(f"  FALHA alvo < 44px        {t}")
            else:
                print("  ok    alvos de toque")

            if erros:
                falhas += len(erros)
                for e in erros[:4]:
                    print(f"  FALHA console            {e[:70]}")
            else:
                print("  ok    console limpo")

            if nome == "desktop":
                pares = pg.evaluate(JS_CONTRASTE)
                ruins = []
                for it in pares:
                    r = razao(it["cor"], it["fundo"])
                    minimo = 3.0 if it["grande"] else 4.5
                    if r < minimo:
                        ruins.append((r, minimo, it))
                falhas += len(ruins)
                print(f"  {'FALHA' if ruins else 'ok   '} contraste            "
                      f"{len(pares) - len(ruins)}/{len(pares)} pares passam")
                for r, m, it in sorted(ruins)[:8]:
                    print(f"        {r:5.2f}:1 (min {m}) {it['tag']}.{it['cls']} "
                          f"{it['fs']:.0f}px  “{it['amostra']}”")
            pg.close()

        # Movimento reduzido: o defeito que importa e conteudo sumindo.
        pg = nav.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        pg.goto(url, wait_until="networkidle")
        pg.wait_for_timeout(1200)
        animando = pg.evaluate(JS_ANIMA)
        invisivel = pg.evaluate(
            "[...document.querySelectorAll('main *')].filter(e => {"
            "const c = getComputedStyle(e);"
            "return c.opacity === '0' && e.getBoundingClientRect().height > 0; }).length")
        print(f"\n── movimento reduzido " + "─" * 41)
        print(f"  {'FALHA' if animando else 'ok   '} animacoes ativas     {animando}")
        print(f"  {'FALHA' if invisivel else 'ok   '} conteudo invisivel   {invisivel} elemento(s) em opacity 0")
        falhas += bool(animando) + bool(invisivel)
        pg.close()
        nav.close()

    print(f"\n{'=' * 60}\n{falhas} falha(s)\n")
    return 1 if falhas else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url", nargs="?")
    ap.add_argument("--dir", help="serve este diretorio num servidor interno")
    ap.add_argument("--base", default="/", help="caminho base quando usar --dir")
    a = ap.parse_args()

    if a.dir:
        H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=a.dir)
        socketserver.TCPServer.allow_reuse_address = True
        srv = socketserver.TCPServer(("127.0.0.1", 0), H)
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        url = f"http://127.0.0.1:{srv.server_address[1]}{a.base}"
        try:
            sys.exit(auditar(url))
        finally:
            srv.shutdown()
    elif a.url:
        sys.exit(auditar(a.url))
    else:
        ap.error("informe uma URL ou --dir")


if __name__ == "__main__":
    main()
