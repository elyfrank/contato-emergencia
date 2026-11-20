import { nomeDaPagina, type Pessoa } from "../dominio/pessoa.ts";
import type { Site } from "../dominio/site.ts";
import { documento } from "../render/documento.ts";
import { html } from "../render/html.ts";
import { renderizarLanding } from "../render/pagina-landing.ts";
import { renderizarPaginaNeutra } from "../render/pagina-neutra.ts";
import { renderizarPaginaPessoa } from "../render/pagina-pessoa.ts";
import { PAGINA_EXEMPLO, PAGINA_LANDING, PESSOA_EXEMPLO } from "./exemplo.ts";

export interface ArquivoGerado {
  readonly caminho: string;
  readonly conteudo: string;
}

export interface EntradaSite {
  readonly pessoas: readonly Pessoa[];
  readonly estilos: string;
  /** Landing page + exemplo. Sem ela, a raiz do site é uma página neutra. */
  readonly landing?: { readonly site: Site; readonly estilos: string };
}

/** Função pura: dados validados -> arquivos do site. Não toca no disco. */
export function gerarSite({ pessoas, estilos, landing }: EntradaSite): ArquivoGerado[] {
  const paginasPessoas = pessoas.map((pessoa) => ({
    caminho: nomeDaPagina(pessoa),
    conteudo: renderizarPaginaPessoa(pessoa, estilos),
  }));

  return [
    ...paginasPessoas,
    ...(landing ? paginasDaLanding(landing.site, landing.estilos, estilos) : [paginaRaizNeutra(estilos)]),
    {
      caminho: "404.html",
      conteudo: renderizarPaginaNeutra(estilos, "Página não encontrada", "Confira se o QR code foi lido por inteiro."),
    },
    { caminho: "robots.txt", conteudo: "User-agent: *\nDisallow: /\nAllow: /quem-somos.html\n" },
  ];
}

function paginasDaLanding(site: Site, estilosLanding: string, estilosPessoa: string): ArquivoGerado[] {
  return [
    {
      caminho: PAGINA_LANDING,
      conteudo: renderizarLanding({ site, estilos: estilosLanding, paginaExemplo: PAGINA_EXEMPLO }),
    },
    {
      caminho: PAGINA_EXEMPLO,
      conteudo: renderizarPaginaPessoa(PESSOA_EXEMPLO, estilosPessoa, { demonstracao: { linkLanding: PAGINA_LANDING } }),
    },
    {
      caminho: "index.html",
      conteudo: documento({
        titulo: site.marca,
        estilos: "",
        redirecionarPara: PAGINA_LANDING,
        corpo: html`<p><a href="${PAGINA_LANDING}">Ir para ${site.marca}</a></p>`,
      }),
    },
  ];
}

function paginaRaizNeutra(estilos: string): ArquivoGerado {
  return {
    caminho: "index.html",
    conteudo: renderizarPaginaNeutra(estilos, "Contato de emergência", "Escaneie o QR code da bicicleta para ver os contatos do ciclista."),
  };
}
