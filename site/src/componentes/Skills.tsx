import manifesto from "../../../manifesto.json";

// As 126 skills pelo nome. O numero sozinho nao diz nada; a parede de nomes
// diz. Sao os dados reais do manifesto, nao uma lista ilustrativa.
const NOMES = manifesto.skills.map((s) => s.nome).sort((a, b) => a.localeCompare(b));
const METADE = Math.ceil(NOMES.length / 2);

function Faixa({ nomes, invertida }: { nomes: string[]; invertida?: boolean }) {
  return (
    <div className="faixa" data-invertida={invertida ? "sim" : "nao"}>
      {/* duplicada para o laco nao ter emenda visivel */}
      {[0, 1].map((n) => (
        <div className="faixa__fila" key={n} aria-hidden={n === 1}>
          {nomes.map((nome) => (
            <span className="pilula" key={nome}>
              {nome}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <div className="skills">
      <Faixa nomes={NOMES.slice(0, METADE)} />
      <Faixa nomes={NOMES.slice(METADE)} invertida />
    </div>
  );
}
