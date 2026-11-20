import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { ErroDeDados } from "../dominio/erros.ts";
import type { RegistroBruto } from "../dominio/validacao.ts";
import type { FontePessoas } from "./fonte-pessoas.ts";

/** Lê um arquivo JSON de pessoa, com a origem "pessoas/<arquivo>" para as mensagens de erro. */
export async function lerRegistroJson(caminho: string): Promise<RegistroBruto> {
  const origem = `pessoas/${basename(caminho)}`;
  const conteudo = await readFile(caminho, "utf8");
  try {
    return { origem, dados: JSON.parse(conteudo) };
  } catch (erro) {
    throw new ErroDeDados([`${origem}: JSON inválido (${(erro as Error).message})`]);
  }
}

/** Lê um arquivo JSON por pessoa de um diretório (uso local). */
export class FonteDiretorio implements FontePessoas {
  readonly #diretorio: string;

  constructor(diretorio: string) {
    this.#diretorio = diretorio;
  }

  async carregar(): Promise<RegistroBruto[]> {
    if (!existsSync(this.#diretorio)) return [];

    const arquivos = (await readdir(this.#diretorio)).filter((a) => a.endsWith(".json")).sort();
    return Promise.all(arquivos.map((arquivo) => lerRegistroJson(join(this.#diretorio, arquivo))));
  }
}
