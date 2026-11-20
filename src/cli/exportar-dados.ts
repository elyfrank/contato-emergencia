import { FonteDiretorio } from "../dados/fonte-diretorio.ts";
import { carregarPessoas } from "./carregar-pessoas.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

/**
 * Imprime todas as pessoas de pessoas/ como um único array JSON, no formato do secret PESSOAS_JSON.
 * Uso: npm run -s dados:exportar | gh secret set PESSOAS_JSON
 */
await executar(async () => {
  const pessoas = await carregarPessoas(new FonteDiretorio(CONFIG.diretorioPessoas));
  process.stdout.write(JSON.stringify(pessoas));
});
