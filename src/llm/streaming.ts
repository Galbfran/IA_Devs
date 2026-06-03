
import config from "../config.js";
import { claudeClient } from "./claudeClient.js";



export async function streamClaude( prompt: string , systemPrompt?: string ): Promise<string>{
    let fullResult = "";
    const responseStream = claudeClient.messages.stream({
        model: config.anthropicModel,
        max_tokens: 1024,
        ...( systemPrompt && {system: systemPrompt}),
        messages: [
            {
                role:"user",
                content: prompt
            }
        ]
    });
   responseStream.on("text" , (chunk) => {
    process.stdout.write(chunk);
    fullResult += chunk;
   })
   await responseStream.finalMessage();
   process.stdout.write(fullResult)
    return fullResult;
}