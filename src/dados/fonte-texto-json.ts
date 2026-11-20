import { ErroDeDados } from "../dominio/erros.ts";
import type { RegistroBruto } from "../dominio/validacao.ts";
import type { FontePessoas } from "./fonte-pessoas.ts";

/**
 * Lê um array JSON de pessoas a partir de um texto — usado no CI,
 * onde os dados chegam pelo secret PESSOAS_JSON e nunca ficam no repositório.
 */
export class FonteTextoJson implements FontePessoas {
  readonly #texto: string;
  readonly #origem: string;

  constructor(texto: string, origem: string) {
    this.#texto = texto;
    this.#origem = origem;
  }

  async carregar(): Promise<RegistroBruto[]> {
    let dados: unknown;
    try {
      dados = JSON.parse(this.#texto);
    } catch (erro) {
      throw new ErroDeDados([`${this.#origem}: JSON inválido (${(erro as Error).message})`]);
    }
    if (!Array.isArray(dados)) throw new ErroDeDados([`${this.#origem}: esperado um array de pessoas`]);

    return dados.map((item, i) => ({ origem: `${this.#origem}[${i}]`, dados: item }));
  }
}
