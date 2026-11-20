import { existsSync } from "node:fs";
import { relative } from "node:path";
import { lerRegistroJson } from "../dados/fonte-diretorio.ts";
import { arquivoDaPessoa, atualizarPessoa } from "../dados/gravador-diretorio.ts";
import { ErroDeDados } from "../dominio/erros.ts";
import { comNovoCodigo, nomeDaPagina } from "../dominio/pessoa.ts";
import { validarPessoa } from "../dominio/validacao.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

const USO = `Uso: npm run trocar-codigo -- "José Blabla"   (nome completo, ou o nome do arquivo em pessoas/)`;

/**
 * Gera um link novo para a pessoa e invalida o antigo — para quando houver suspeita
 * de que o link vazou (ex.: alguém fotografou o adesivo). Exige imprimir um novo adesivo.
 */
await executar(async () => {
  const identificador = process.argv.slice(2).join(" ").trim();
  if (!identificador) throw new ErroDeDados(["informe a pessoa"]);

  const arquivo = arquivoDaPessoa(CONFIG.diretorioPessoas, identificador);
  if (!existsSync(arquivo)) throw new ErroDeDados([`nenhum cadastro em ${relative(process.cwd(), arquivo)}`]);

  const atual = validarPessoa(await lerRegistroJson(arquivo));
  const nova = comNovoCodigo(atual);
  await atualizarPessoa(arquivo, nova);

  console.log(`✔ Código de ${nova.nome} trocado.`);
  console.log(`  Link antigo: /${nomeDaPagina(atual)}  (deixa de funcionar após publicar)`);
  console.log(`  Link novo:   /${nomeDaPagina(nova)}`);
  console.log(`  Próximos passos: "npm run publicar" e imprimir um novo adesivo com o QR do link novo.`);
}, USO);
