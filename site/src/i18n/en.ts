import type { Dicionario } from "./pt";

// Tipado como Dicionario: chave que exista num e falte no outro nao compila.
// Paridade verificada pelo compilador, nao por disciplina.
export const en: Dicionario = {
  titulo: "AI Hyper Setup",
  subtitulo: "Your AI agent suite on a new machine, in one command.",
  heroiNota: "Detects the agent you already use. Overwrites nothing.",

  copiar: "copy",
  copiado: "copied",

  passosTitulo: "How it works",
  passo1t: "Run the command",
  passo1d: "It detects your agent, installs RTK and Obsidian, and puts the skill where it belongs.",
  passo2t: "Open your agent",
  passo2d: "Claude Code, Codex or Antigravity — whichever you already use.",
  passo3t: "Run the skill",
  passo3d: "The AI installs the suite and hands back two lists: what it added now, and what was already there.",

  instalarTitulo: "Install",
  instalarNota: "Runs on Linux, macOS and Windows (Git Bash or WSL).",
  depoisTitulo: "After the command",
  depoisTexto:
    "Open your agent and run /hyper-setup-initialize. The AI finishes the install and tells you what it added and what was already there.",

  inventarioTitulo: "What it installs",
  inventarioSkills: "skills from six public repositories",
  inventarioMcps: "MCP servers",
  inventarioFerramentas:
    "RTK, the proxy that cuts up to 90% of the terminal output your agent reads",
  inventarioObsidian:
    "Obsidian, with a skill that reads and writes context across sessions",

  respeitaTitulo: "What it does to what you already have",
  respeitaTexto:
    "Nothing. Every item is checked before anything is written, and whatever is already there shows up in the final report as already installed.",
  garantia1t: "No file is overwritten.",
  garantia1d: "Not even your settings.json: hooks are appended to the ones already there.",
  garantia2t: "Running it twice is safe.",
  garantia2d: "The second run reports everything as already installed. That is tested in a container on every push.",
  garantia3t: "The download is atomic.",
  garantia3d: "It downloads to a temporary directory and only moves when complete. A dropped connection leaves no half-install.",

  licencasTitulo: "Where the skills come from",
  licencasTexto:
    "Third-party skills are fetched from their original source, not redistributed here. Each upstream's license is listed below.",

  agentesTitulo: "Supported agents",
  agentesSkills: "Where each agent keeps its skills.",
  semFonte:
    "Another {n} skills have no public upstream located. For those the AI looks for the source at install time and, failing to find it, reports them as not installed — it never writes a substitute.",
};
