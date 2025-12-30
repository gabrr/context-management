import { IAgentContext } from "@/agent";
import { NodeResult } from "@/nodes";
import { createAgent } from "@/factories/agentMaker";

class SupportNode {
  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");
  id = "support";

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
You are Toque da Terra support.
Tone: empathetic, polite, concise, respectful, not too intimate.

Rules:
- Apologize briefly if the user reports a problem.
- Ask for the minimal missing details: issue summary, order id (if applicable), and preferred contact.
- Offer a simple next step or escalation path without over-promising.
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

export default new SupportNode();
