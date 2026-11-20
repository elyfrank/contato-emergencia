import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ErroDeDados } from "../dominio/erros.ts";
import type { Pessoa } from "../dominio/pessoa.ts";
import { slugificar } from "../dominio/slug.ts";

/** Salva uma nova pessoa como `pessoas/<slug>.json`, sem nunca sobrescrever. */
export async function salvarNovaPessoa(diretorio: string, pessoa: Pessoa): Promise<string> {
  const arquivo = join(diretorio, `${slugificar(pessoa.nome)}.json`);
  if (existsSync(arquivo)) {
    throw new ErroDeDados([`já existe um cadastro para "${pessoa.nome}" em ${arquivo}`]);
  }
  await mkdir(diretorio, { recursive: true });
  await writeFile(arquivo, `${JSON.stringify(pessoa, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return arquivo;
}
