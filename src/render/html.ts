/**
 * Template HTML seguro: tudo que é interpolado é escapado por padrão.
 * Só o que já é `Html` (produzido por `html` ou marcado com `confiavel`) passa intacto.
 */
export class Html {
  readonly conteudo: string;

  constructor(conteudo: string) {
    this.conteudo = conteudo;
  }

  toString(): string {
    return this.conteudo;
  }
}

export type Interpolavel = string | number | Html | null | undefined | false | readonly Interpolavel[];

const ENTIDADES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapar(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ENTIDADES[c] ?? c);
}

function serializar(valor: Interpolavel): string {
  if (valor instanceof Html) return valor.conteudo;
  if (Array.isArray(valor)) return valor.map(serializar).join("");
  if (valor === null || valor === undefined || valor === false) return "";
  return escapar(String(valor));
}

export function html(partes: TemplateStringsArray, ...valores: Interpolavel[]): Html {
  return new Html(partes.reduce((saida, parte, i) => saida + parte + serializar(valores[i]), ""));
}

/** Marca um trecho estático e confiável (ex.: um SVG fixo) para não ser escapado. */
export function confiavel(conteudo: string): Html {
  return new Html(conteudo);
}
