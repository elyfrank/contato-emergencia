import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { ErroDeDados } from "../dominio/erros.ts";
import type { RegistroBruto } from "../dominio/validacao.ts";
import type { FontePessoas } from "./fonte-pessoas.ts";

/** Lê um arquivo JSON por pessoa de um diretório (uso local). */
export class FonteDiretorio implements FontePessoas {
  readonly #diretorio: string;

  constructor(diretorio: string) {
    this.#diretorio = diretorio;
  }

  async carregar(): Promise<RegistroBruto[]> {
    if (!existsSync(this.#diretorio)) return [];

    const arquivos = (await readdir(this.#diretorio)).filter((a) => a.endsWith(".json")).sort();
    return Promise.all(arquivos.map((arquivo) => this.#lerArquivo(arquivo)));
  }

  async #lerArquivo(arquivo: string): Promise<RegistroBruto> {
    const origem = `pessoas/${arquivo}`;
    const conteudo = await readFile(join(this.#diretorio, arquivo), "utf8");
    try {
      return { origem, dados: JSON.parse(conteudo) };
    } catch (erro) {
      throw new ErroDeDados([`${origem}: JSON inválido (${(erro as Error).message})`]);
    }
  }
}
