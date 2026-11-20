import { nomeDaPagina, type Pessoa } from "../dominio/pessoa.ts";
import { renderizarPaginaNeutra } from "../render/pagina-neutra.ts";
import { renderizarPaginaPessoa } from "../render/pagina-pessoa.ts";

export interface ArquivoGerado {
  readonly caminho: string;
  readonly conteudo: string;
}

/** Função pura: pessoas validadas -> arquivos do site. Não toca no disco. */
export function gerarSite(pessoas: readonly Pessoa[], estilos: string): ArquivoGerado[] {
  return [
    ...pessoas.map((pessoa) => ({
      caminho: nomeDaPagina(pessoa),
      conteudo: renderizarPaginaPessoa(pessoa, estilos),
    })),
    {
      caminho: "index.html",
      conteudo: renderizarPaginaNeutra(estilos, "Contato de emergência", "Escaneie o QR code da bicicleta para ver os contatos do ciclista."),
    },
    {
      caminho: "404.html",
      conteudo: renderizarPaginaNeutra(estilos, "Página não encontrada", "Confira se o QR code foi lido por inteiro."),
    },
    { caminho: "robots.txt", conteudo: "User-agent: *\nDisallow: /\n" },
  ];
}
