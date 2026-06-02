import { CODE_REVIEWER_PROMPT } from "./llm/prompts.js";
import { streamClaude } from "./llm/streaming.js";

const CODIGO_CON_PROBLEMAS = `
async function getUser(id) {
  const query = "SELECT * FROM users WHERE id = " + id;
  const result = await db.query(query);
  return result[0];
}
function calcularDescuento(precio, tipo) {
  if (tipo == "vip") {
    return precio * 0.8;
  } else if (tipo == "regular") {
    return precio * 0.9;
  } else {
    return precio;
  }
}
`;

async function main(): Promise<void> {
  console.log("╔════════════════════════════════════════╗");
  console.log("║        DevAssistant - Curso IA         ║");
  console.log("║        System prompt                   ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("");
  console.log("✅ DevAssistant configurado correctamente");
  console.log("");
  const question = ` ${CODE_REVIEWER_PROMPT }\n javascript ${CODIGO_CON_PROBLEMAS} \n Esto es una prueba de stream da una respuesta corta.`
  console.info("Pregunta" + question);
  
  console.log("✅ Enviando pregunta a Claude ...");
  const answer = await streamClaude(question);
  console.info("Respuesta" + answer);

}

main().catch((error: Error) => console.error(error.message));