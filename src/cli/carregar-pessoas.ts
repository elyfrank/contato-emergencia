import { FonteDiretorio } from "../dados/fonte-diretorio.ts";
import type { FontePessoas } from "../dados/fonte-pessoas.ts";
import { FonteTextoJson } from "../dados/fonte-texto-json.ts";
import type { Pessoa } from "../dominio/pessoa.ts";
import { validarColecao } from "../dominio/validacao.ts";
import { CONFIG } from "./config.ts";

/** Escolhe a fonte: secret PESSOAS_JSON (CI) se existir, senão a pasta local pessoas/. */
export function escolherFonte(ambiente: NodeJS.ProcessEnv = process.env): FontePessoas {
  const texto = ambiente[CONFIG.variavelDados];
  return texto ? new FonteTextoJson(texto, CONFIG.variavelDados) : new FonteDiretorio(CONFIG.diretorioPessoas);
}

export async function carregarPessoas(fonte: FontePessoas): Promise<Pessoa[]> {
  return validarColecao(await fonte.carregar());
}
