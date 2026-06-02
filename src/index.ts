import { askClaude } from "./llm/anthropic-client.js";

async function main(): Promise<void> {
  console.log("╔════════════════════════════════════════╗");
  console.log("║        DevAssistant - Curso IA         ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("");
  console.log("✅ DevAssistant configurado correctamente");
  console.log("");
  const question = "que es typescript y en que se diferencia de javascript. responde con un maximo de 3 puntos. esto es una prueba de api."
  console.info("Pregunta" + question);
  
  console.log("✅ Enviando pregunta a Claude ...");
  const answer = await askClaude(question);
  console.info("Respuesta" + answer);

}

main().catch((error: Error) => console.error(error.message));