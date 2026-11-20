/**
 * Erro de dados de entrada: agrega todos os problemas encontrados
 * para que o usuário corrija tudo de uma vez, e não um erro por execução.
 */
export class ErroDeDados extends Error {
  readonly problemas: readonly string[];

  constructor(problemas: readonly string[]) {
    super(`Dados inválidos:\n${problemas.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "ErroDeDados";
    this.problemas = problemas;
  }
}
