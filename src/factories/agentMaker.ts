import { TextAgent, OpenAIAgent, OllamaAgent } from "../llms/llms";

export type AgentProvider = "openai" | "ollama";

/** Factory that creates either an OpenAI or Ollama text agent. */
export function createAgent(
  provider: AgentProvider = "openai",
  model?: string
): TextAgent {
  console.log(`Creating agent: ${provider} ${model || ""}`);

  if (provider === "openai") {
    return new OpenAIAgent(model || "gpt-5-nano");
  } else if (provider === "ollama") {
    return new OllamaAgent(model || "llama3.2:3b");
  }

  throw new Error(`Unknown provider: ${provider}`);
}
