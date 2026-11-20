import { relative } from "node:path";
import { lerArgumentos, USO } from "../cadastro/argumentos.ts";
import { salvarNovaPessoa } from "../dados/gravador-diretorio.ts";
import { gerarCodigo } from "../dominio/codigo.ts";
import { nomeDaPagina } from "../dominio/pessoa.ts";
import { validarPessoa } from "../dominio/validacao.ts";
import { CONFIG } from "./config.ts";
import { executar } from "./executar.ts";

await executar(async () => {
  const dados = lerArgumentos(process.argv.slice(2));
  const pessoa = validarPessoa({ origem: "cadastro", dados: { ...dados, codigo: gerarCodigo() } });
  const arquivo = await salvarNovaPessoa(CONFIG.diretorioPessoas, pessoa);

  console.log(`✔ Cadastro criado: ${relative(process.cwd(), arquivo)}`);
  console.log(`  Página: /${nomeDaPagina(pessoa)}`);
  console.log(`  Rode "npm run build" (ou "npm run dev") para gerar o HTML.`);
}, USO);
