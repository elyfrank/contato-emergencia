import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { ErroDeDados } from "../dominio/erros.ts";
import { siteSchema, type Site } from "../dominio/site.ts";
import { CONFIG } from "./config.ts";

/**
 * Configuração da landing: secret SITE_JSON (CI) ou arquivo site.json (local).
 * Retorna null se não houver nenhuma — o site é gerado sem landing page.
 */
export async function carregarSite(ambiente: NodeJS.ProcessEnv = process.env): Promise<Site | null> {
  const doAmbiente = ambiente[CONFIG.variavelSite];
  if (doAmbiente) return validarSite(doAmbiente, CONFIG.variavelSite);
  if (!existsSync(CONFIG.arquivoSite)) return null;
  return validarSite(await readFile(CONFIG.arquivoSite, "utf8"), "site.json");
}

function validarSite(texto: string, origem: string): Site {
  let dados: unknown;
  try {
    dados = JSON.parse(texto);
  } catch (erro) {
    throw new ErroDeDados([`${origem}: JSON inválido (${(erro as Error).message})`]);
  }
  const resultado = siteSchema.safeParse(dados);
  if (!resultado.success) {
    throw new ErroDeDados(resultado.error.issues.map((i) => `${origem} › ${i.path.join(".")}: ${i.message}`));
  }
  return resultado.data;
}
