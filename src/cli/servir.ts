import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { CONFIG } from "./config.ts";

const TIPOS: Readonly<Record<string, string>> = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const raiz = resolve(CONFIG.diretorioSaida);

/** Converte a URL em caminho dentro de dist/, recusando qualquer tentativa de sair dela. */
function resolverCaminho(url: string): string | null {
  const { pathname } = new URL(url, "http://localhost");
  const relativo = pathname === "/" ? "index.html" : decodeURIComponent(pathname).slice(1);
  const caminho = resolve(raiz, relativo);
  return caminho.startsWith(raiz + sep) ? caminho : null;
}

const servidor = createServer(async (req, res) => {
  const caminho = resolverCaminho(req.url ?? "/");
  try {
    if (!caminho) throw new Error("fora de dist/");
    const conteudo = await readFile(caminho);
    res.writeHead(200, { "content-type": TIPOS[extname(caminho)] ?? "application/octet-stream" });
    res.end(conteudo);
  } catch {
    res.writeHead(404, { "content-type": TIPOS[".html"] });
    res.end(await readFile(resolve(raiz, "404.html")).catch(() => "404"));
  }
});

servidor.listen(CONFIG.porta, "127.0.0.1", () => {
  console.log(`▶ Servindo dist/ em http://localhost:${CONFIG.porta}`);
});
