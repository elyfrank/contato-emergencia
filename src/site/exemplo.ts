import type { Pessoa } from "../dominio/pessoa.ts";

export const PAGINA_EXEMPLO = "exemplo.html";
export const PAGINA_LANDING = "quem-somos.html";

/**
 * Pessoa fictícia da página de demonstração. Os telefones nunca são usados:
 * em modo demonstração os botões de ligar/WhatsApp ficam desativados.
 */
export const PESSOA_EXEMPLO: Pessoa = {
  nome: "Ana Exemplo",
  codigo: "exempl",
  tipoSanguineo: "O-",
  contatos: [
    { nome: "Carlos Exemplo", relacao: "Pai", telefone: "5561900000001" },
    { nome: "Júlia Exemplo", relacao: "Irmã", telefone: "5561900000002" },
  ],
  alergias: ["Penicilina"],
};
