import { IAgentContext } from "@/agent";
import { NodeResult } from "@/nodes";
import { createAgent } from "@/factories/agentMaker";
import { MOCK_ORDERS } from "./mockData";

class OrderTrackingNode {
  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");
  id = "orderTracking";

  private extractOrderId(message: string): string | null {
    const match = String(message ?? "")
      .toUpperCase()
      .match(/[A-Z]\d{3,}/);
    return match ? match[0] : null;
  }

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

    const hintedOrderId =
      this.extractOrderId(userMessage) ||
      this.extractOrderId(historyText.split("\n").slice(-4).join(" "));

    const matchedOrder = MOCK_ORDERS.find(
      (o) => o.id.toUpperCase() === (hintedOrderId ?? "").toUpperCase()
    );

    const response = await this.llm.run(
      `
You are a Toque da Terra assistant handling order tracking.
Tone: friendly, polite, concise, respectful, not too intimate.

Known orders (id, status, eta, deliveryWindow, address):
${JSON.stringify(MOCK_ORDERS, null, 2)}

Rules:
- If no clear order id is provided or matched, ask once for the order id (or name + recent item) briefly.
- If matched, share status, ETA, and delivery window. If delayed, acknowledge and apologize briefly.
- Do not invent orders or ETAs beyond the list above.
- Keep replies to 2-4 sentences.

Conversation history:
${historyText || "(none)"}

Order hint from user/history: ${hintedOrderId ?? "none"}
Matched order (if any):
${matchedOrder ? JSON.stringify(matchedOrder, null, 2) : "none"}
    `,
      userMessage
    );

    return {
      nodeId: this.id,
      value: response,
    };
  }
}

export default new OrderTrackingNode();
