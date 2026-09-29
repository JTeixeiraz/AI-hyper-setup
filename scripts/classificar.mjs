// Gera fontes/classificacao.json a partir das familias identificadas na
// auditoria de 2026-09-29. Cada familia foi confirmada comparando a lista de
// nomes contra a arvore do repositorio pela API do GitHub — nao por semelhanca
// de descricao. Escrever as 139 entradas a mao convidaria erro de digitacao
// num arquivo que ninguem reveria linha a linha.
import { writeFileSync } from "node:fs";

const FAMILIAS = {
  "claude-seo": `seo seo-agentic seo-ahrefs seo-audit seo-backlinks seo-bing seo-cluster
    seo-competitor-pages seo-content seo-content-brief seo-dataforseo seo-drift seo-ecommerce
    seo-firecrawl seo-flow seo-geo seo-google seo-hreflang seo-image-gen seo-images seo-local
    seo-maps seo-matomo seo-page seo-plan seo-profound seo-programmatic seo-schema seo-seranking
    seo-sitemap seo-sxo seo-technical seo-unlighthouse`,
  "resume-skills": `academic-cv-builder application-form-filler career-changer-translator
    cold-email-writer cover-letter-generator creative-portfolio-resume executive-resume-writer
    interview-prep-generator job-description-analyzer linkedin-profile-optimizer
    offer-comparison-analyzer portfolio-case-study-writer reference-list-builder
    resume-ats-optimizer resume-bullet-writer resume-formatter resume-quantifier
    resume-section-builder resume-tailor resume-version-manager salary-negotiation-prep
    tech-resume-optimizer`,
  "social-media-skills": `analytics-dashboard content-matrix gemini-carousel gemini-infographic
    graphic-designer hook-generator newsletter-voice niche-research pinned-comment post-formatter
    post-scorer post-writer profile-optimizer quote-post reels-scripting voice-builder
    youtube-thumbnail`,
  "impeccable": "impeccable impeccable-skill",
  "higgsfield": "higgsfield",
};

const PLUGIN_UIUX = "banner-design brand design design-system slides ui-styling ui-ux-pro-max";
const BUNDLED = `LUMI biologo_genetico liquid_glass react-liquid-glass marketing-head
  mobile-development design-master`;
const BUILTIN = "brag brag-slim find-skills frontend-design";
const SYMLINK_LOCAL = `remotion-best-practices remotion-captions remotion-create remotion-docs
  remotion-interactivity remotion-maps remotion-markup remotion-multimedia remotion-render
  remotion-saas remotion-studio remotion-upgrade`;
const EXCLUIDAS = "xpe-db-query";

// Sem upstream publico localizado, ou com upstream sem arquivo de licenca.
// A IA procura a fonte na instalacao; nao achando, reporta como nao instalada.
const AGENTE = `ad-spend-allocator ai-search-visibility-aeo-geo-llmo bofu-seo-aeo-strategy
  campaign-analyzer caveman emil-design google-ads-account-audit google-ads-campaign-builder
  google-ads-keyword-engine google-ads-optimizer google-ads-scripts google-merchant-center
  higgsfield-claude-skills link-building-digital-pr local-seo-google-business-profile
  meta-ads-account-audit meta-ads-campaign-builder meta-ads-creative-engine meta-ads-optimizer
  meta-ads-playbook meta-ads-tracking-setup on-page-seo-aeo-optimization paid-media-reporter
  paid-search-ads-playbook prompt-picker seo-aeo-content-strategy
  seo-keyword-research-intent-mapping seo-max-kt seo-reporting-measurement synced taste-skill
  technical-seo-ai-crawler-audit`;

const lista = (s) => s.trim().split(/\s+/);
const saida = [];

for (const [upstream, nomes] of Object.entries(FAMILIAS)) {
  for (const nome of lista(nomes)) saida.push({ nome, origem: "git", upstream });
}
for (const nome of lista(PLUGIN_UIUX)) {
  saida.push({ nome, origem: "plugin", upstream: "ui-ux-pro-max" });
}
for (const nome of lista(BUNDLED)) {
  saida.push({ nome, origem: "bundled", caminho: `skills/${nome}` });
}
for (const nome of lista(BUILTIN)) {
  saida.push({ nome, origem: "builtin", nota: "ja vem com o agente ou marketplace oficial" });
}
for (const nome of lista(SYMLINK_LOCAL)) {
  saida.push({ nome, origem: "symlink-local", nota: "symlink para projeto privado Birdy" });
}
for (const nome of lista(EXCLUIDAS)) {
  saida.push({ nome, origem: "EXCLUIDA", nota: "expoe host de banco de producao" });
}
for (const nome of lista(AGENTE)) {
  saida.push({ nome, origem: "agente", dica: "upstream nao localizado em 2026-09-29" });
}
saida.push({ nome: "graphify", origem: "uv-tool", pacote: "graphifyy" });

saida.sort((a, b) => a.nome.localeCompare(b.nome));
writeFileSync("fontes/classificacao.json", JSON.stringify(saida, null, 2) + "\n");

const conta = {};
for (const s of saida) conta[s.origem] = (conta[s.origem] || 0) + 1;
console.log(`classificacao.json: ${saida.length} skills`, conta);
