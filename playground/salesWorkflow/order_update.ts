import { IAgentContext } from "@/agent";
import { NodeResult } from "@/nodes";
import { createAgent } from "@/factories/agentMaker";
import { MOCK_ORDERS } from "./mockData";

class OrderUpdateNode {
  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");
  id = "orderUpdate";

  private formatHistory(ctx: IAgentContext) {
    const history = (ctx.memory?.shortTerm as any[]) || [];
    return history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n")
      .trim();
  }

  async run(ctx: IAgentContext): Promise<NodeResult> {
    const historyText = this.formatHistory(ctx);
    const userMessage = ctx.user?.request ?? "";

    const response = await this.llm.run(
      `
You are a Toque da Terra assistant handling delivery updates.
Tone: friendly, polite, concise, respectful, not too intimate.

Known orders (for reference only, do not invent):
${JSON.stringify(MOCK_ORDERS, null, 2)}

Rules:
- If the order id or key details (address, delivery window, contact) are missing, ask briefly for the most critical missing item first.
- Summarize the requested change back to the user.
- State that the update is noted/queued, not yet finalized.
- Keep replies to 2-4 sentences.

Conversation history:
${historyText || "(none)"}
    `,
      userMessage
    );

    return {
      nodeId: this.id,
      value: response,
    };
  }
}

export default new OrderUpdateNode();
