import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { ArquivoGerado } from "./gerar-site.ts";

/** Recria o diretório de saída do zero, para não sobrar página de pessoa removida. */
export async function gravarSite(diretorioSaida: string, arquivos: readonly ArquivoGerado[]): Promise<void> {
  await rm(diretorioSaida, { recursive: true, force: true });
  for (const arquivo of arquivos) {
    const destino = join(diretorioSaida, arquivo.caminho);
    await mkdir(dirname(destino), { recursive: true });
    await writeFile(destino, arquivo.conteudo, "utf8");
  }
}
