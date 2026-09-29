import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// O Pages serve em /AI-hyper-setup/, nao na raiz. Sem base, todo asset
// resolveria para / e a pagina abriria sem estilo.
//
// fs.allow: ".." porque Inventario.tsx importa o manifesto.json da raiz do
// repositorio — as contagens do site vem do produto, nao digitadas a mao.
export default defineConfig({
  plugins: [react()],
  base: "/AI-hyper-setup/",
  server: { fs: { allow: [".."] } },
});
