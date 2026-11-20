import { fileURLToPath } from "node:url";
import { join } from "node:path";

const RAIZ = fileURLToPath(new URL("../..", import.meta.url));

export const CONFIG = {
  diretorioPessoas: join(RAIZ, "pessoas"),
  diretorioSaida: join(RAIZ, "dist"),
  arquivoEstilos: join(RAIZ, "src", "render", "estilos.css"),
  /** No CI os dados vêm deste secret, nunca do repositório. */
  variavelDados: "PESSOAS_JSON",
  /** Arquivo em .github/workflows que faz o deploy no GitHub Pages. */
  workflowPublicacao: "publicar.yml",
  porta: Number(process.env.PORTA ?? 8080),
} as const;
