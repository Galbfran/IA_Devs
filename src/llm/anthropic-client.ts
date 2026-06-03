import config from "../config.js";
import { claudeClient } from "../clients/claudeClient.js";

export async function askClaude(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  const response = await claudeClient.messages.create({
    model: config.anthropicModel,
    max_tokens: 1024,
    ...(systemPrompt && { system: systemPrompt }),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claide no retorno un bloque de texto en la respuesta");
  }
  return textBlock.text;
}
