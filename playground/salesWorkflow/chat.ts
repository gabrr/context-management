import { BaseNode, NodeResult } from "@/nodes";
import { IAgentContext } from "@/agent";
import { createAgent } from "@/factories/agentMaker";

export const createSystemPrompt = (history: MemoryMsg[]) => {
  const historyText = history
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  return `
  You are a sales agent.
  Previous conversation history:
  ${historyText}

  Answer the user's latest message based on the history above if relevant.
  `;
};

interface MemoryMsg {
  role: "user" | "assistant";
  content: string;
}

class ChatNode extends BaseNode {
  id = "chat";
  // Using the same model as intent_classifier for consistency, presumably available locally
  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");

  async run(ctx: IAgentContext): Promise<NodeResult> {
    // Access memory from context.
    // We assume ctx.memory.shortTerm is the array of messages from playground/memory.ts
    const history = (ctx.memory?.shortTerm as MemoryMsg[]) || [];

    const systemPrompt = createSystemPrompt(history);

    console.log(systemPrompt);

    const userMessage = ctx.user?.request ?? "";

    const response = await this.llm.run(systemPrompt, userMessage);

    return {
      nodeId: this.id,
      value: response,
    };
  }
}

export default new ChatNode();
