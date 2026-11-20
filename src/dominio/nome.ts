/**
 * A página é pública: mostramos o mínimo para quem socorre e o mínimo para golpistas
 * (o golpe do "falso acidente" usa nome completo e parentesco para soar convincente).
 */

function partesDoNome(nome: string): string[] {
  return nome.trim().split(/\s+/).filter(Boolean);
}

/** "José da Silva Blabla" -> "José" */
export function primeiroNome(nome: string): string {
  return partesDoNome(nome)[0] ?? nome.trim();
}

/** "José da Silva Blabla" -> "José B." (primeiro nome + inicial do último sobrenome) */
export function nomeAbreviado(nome: string): string {
  const partes = partesDoNome(nome);
  const ultimo = partes.at(-1);
  if (partes.length < 2 || ultimo === undefined) return primeiroNome(nome);
  return `${primeiroNome(nome)} ${ultimo.charAt(0).toUpperCase()}.`;
}
