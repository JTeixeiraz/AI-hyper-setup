import type { Dicionario } from "./pt";

// Tipado como Dicionario: chave que exista num e falte no outro nao compila.
// Paridade verificada pelo compilador, nao por disciplina.
export const en: Dicionario = {
  titulo: "AI Hyper Setup",
  subtitulo: "Your AI agent suite on a new machine, in one command.",
  heroiNota: "Detects the agent you already use. Overwrites nothing.",

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
    "Nothing. Every item is checked first; anything already present is skipped and shows up in the final report. Not even your settings.json is replaced — hooks are appended to the ones already there.",

  licencasTitulo: "Where the skills come from",
  licencasTexto:
    "Third-party skills are fetched from their original source, not redistributed here. Each upstream's license is listed below.",

  agentesTitulo: "Supported agents",
  agentesSkills: "Skills go to",
};
