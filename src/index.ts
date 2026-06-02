import { startCLI } from "./chat/cli.js";

// async function main(): Promise<void> {
//   console.log("╔════════════════════════════════════════╗");
//   console.log("║        DevAssistant - Curso IA         ║");
//   console.log("║        System prompt                   ║");
//   console.log("╚════════════════════════════════════════╝");
//   console.log("");
//   console.log("✅ DevAssistant configurado correctamente");
//   console.log("");


// }

startCLI().catch((error: Error) => console.error(error.message));