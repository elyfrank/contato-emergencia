import { getRandomValues } from "node:crypto";

/**
 * 32 símbolos sem caracteres ambíguos (sem l, o, 0, 1).
 * Ter exatamente 32 símbolos permite sortear com `byte & 31` sem viés.
 */
const ALFABETO = "abcdefghijkmnpqrstuvwxyz23456789";
export const TAMANHO_CODIGO = 6;
export const FORMATO_CODIGO = new RegExp(`^[${ALFABETO}]{${TAMANHO_CODIGO}}$`);

/**
 * Sufixo aleatório da URL, para que a página não possa ser adivinhada
 * só pelo nome da pessoa. 32^6 ≈ 1 bilhão de combinações.
 */
export function gerarCodigo(): string {
  const bytes = getRandomValues(new Uint8Array(TAMANHO_CODIGO));
  return Array.from(bytes, (b) => ALFABETO[b & 31]).join("");
}
