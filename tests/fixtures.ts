import type { Pessoa } from "../src/dominio/pessoa.ts";

export function umaPessoa(sobrescrever: Partial<Pessoa> = {}): Pessoa {
  return {
    nome: "José Blabla",
    codigo: "abc234",
    tipoSanguineo: "O+",
    contatos: [
      { nome: "Maria Blabla", relacao: "Mãe", telefone: "5562999998888" },
      { nome: "João Blabla", relacao: "Irmão", telefone: "5562988887777" },
    ],
    alergias: ["Dipirona"],
    ...sobrescrever,
  };
}
