import { BaseNode, NodeResult } from "@/nodes";
import { IAgentContext } from "@/agent";
import { createAgent } from "@/factories/agentMaker";
import { IntentResult, SalesIntent } from "./types";

// This node uses the LLM (AI) to classify the user's intent
class IntentClassifierNode extends BaseNode {
  id = "intentClassifier";

  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");

  private parseIntent(output: string): IntentResult {
    const raw = String(output ?? "").trim();
    const [intentRaw, confidenceRaw] = raw.split("|").map((s) => s.trim());

    const normalized = intentRaw?.toUpperCase() as
      | keyof typeof SalesIntent
      | undefined;

    const intent =
      SalesIntent[normalized as keyof typeof SalesIntent] ??
      SalesIntent.UNKNOWN;

    let confidence = Number.parseFloat(confidenceRaw ?? "");
    if (Number.isNaN(confidence)) confidence = 0.5;
    confidence = Math.max(0, Math.min(1, confidence));

    return { intent, confidence };
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

    const intentOutput = await this.llm.run(
      `
You are an intent classifier for Toque da Terra.
Return a single intent and confidence for the latest user message, considering short history if helpful.

Allowed intents (use exact tokens):
- PRODUCT_INFO (spices, pricing, availability, product questions)
- ORDER_TRACKING (delivery status, ETA)
- ORDER_UPDATE (change delivery address/time/contact)
- COMPANY_INFO (about, policies, shipping)
- SUPPORT (issues, complaints, damaged/late)
- CHAT (small talk, greetings)
- UNKNOWN (anything else)

Output format (no prose): INTENT|confidence
- confidence: number 0-1.
- Example: ORDER_TRACKING|0.82
- If unsure, use UNKNOWN|0.35

Conversation history (may be empty):
${historyText || "(none)"}
    `,
      userMessage
    );

    const parsed = this.parseIntent(intentOutput);

    return {
      nodeId: this.id,
      value: parsed,
    };
  }
}

export default new IntentClassifierNode();
