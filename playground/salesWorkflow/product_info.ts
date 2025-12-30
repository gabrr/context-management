import { IAgentContext } from "@/agent";
import { NodeResult } from "@/nodes";
import { createAgent } from "@/factories/agentMaker";
import { BaseHandlerNode } from "./baseHandler";
import { MOCK_CATALOG } from "./mockData";
import { SalesIntent } from "./types";

class ProductInfoNode extends BaseHandlerNode {
  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");

  constructor() {
    super("productInfo", SalesIntent.PRODUCT_INFO);
  }

  private formatHistory(ctx: IAgentContext) {
    const history = (ctx.memory?.shortTerm as any[]) || [];
    return history
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n")
      .trim();
  }

  protected async handle(ctx: IAgentContext): Promise<NodeResult> {
    const historyText = this.formatHistory(ctx);
    const userMessage = ctx.user?.request ?? "";

    const response = await this.llm.run(
      `
You are a sales specialist for Toque da Terra.
Tone: friendly, polite, concise, respectful, not too intimate.
Task: answer product questions using the catalog below. Do not invent products or availability.

Catalog (name, description, price, stock):
${JSON.stringify(MOCK_CATALOG, null, 2)}

If unsure about a product, ask a single clarifying question.
If item is out_of_stock, offer to notify or suggest an alternative from the catalog.
Keep replies short (2-4 sentences max).

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

export default new ProductInfoNode();
