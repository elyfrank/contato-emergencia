import { z } from "zod";
import { telefoneSchema } from "./pessoa.ts";

/**
 * Configuração da landing page (/quem-somos.html). Contém o contato do responsável,
 * por isso, assim como os cadastros, fica fora do git (site.json local / secret SITE_JSON).
 */
export const siteSchema = z.object({
  marca: z.string({ error: "marca é obrigatória" }).trim().min(1, "marca é obrigatória"),
  urlBase: z
    .url({ error: "urlBase deve ser uma URL (ex.: https://usuario.github.io/projeto/)" })
    .transform((url) => (url.endsWith("/") ? url : `${url}/`)),
  contato: z.object({
    telefone: telefoneSchema,
    email: z.email({ error: "email inválido" }),
  }),
});

export type Site = z.output<typeof siteSchema>;
