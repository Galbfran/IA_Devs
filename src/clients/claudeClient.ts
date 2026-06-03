import Anthropic from "@anthropic-ai/sdk";
import config from "../config.js";

export const claudeClient = new Anthropic({ apiKey: config.anthropicApiKey });
