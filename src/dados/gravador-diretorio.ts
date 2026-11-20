import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ErroDeDados } from "../dominio/erros.ts";
import type { Pessoa } from "../dominio/pessoa.ts";
import { slugificar } from "../dominio/slug.ts";

/** Caminho do cadastro de uma pessoa: `pessoas/<slug-do-nome-completo>.json`. */
export function arquivoDaPessoa(diretorio: string, nome: string): string {
  return join(diretorio, `${slugificar(nome)}.json`);
}

const serializar = (pessoa: Pessoa): string => `${JSON.stringify(pessoa, null, 2)}\n`;

/** Salva uma nova pessoa, sem nunca sobrescrever um cadastro existente. */
export async function salvarNovaPessoa(diretorio: string, pessoa: Pessoa): Promise<string> {
  const arquivo = arquivoDaPessoa(diretorio, pessoa.nome);
  if (existsSync(arquivo)) {
    throw new ErroDeDados([`já existe um cadastro para "${pessoa.nome}" em ${arquivo}`]);
  }
  await mkdir(diretorio, { recursive: true });
  await writeFile(arquivo, serializar(pessoa), { encoding: "utf8", flag: "wx" });
  return arquivo;
}

/** Regrava um cadastro que já existe (ex.: após trocar o código). */
export async function atualizarPessoa(arquivo: string, pessoa: Pessoa): Promise<void> {
  if (!existsSync(arquivo)) throw new ErroDeDados([`cadastro não encontrado: ${arquivo}`]);
  await writeFile(arquivo, serializar(pessoa), "utf8");
}
