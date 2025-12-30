import { IAgentContext } from "@/agent";
import { NodeResult } from "@/nodes";
import { createAgent } from "@/factories/agentMaker";
import { COMPANY_PROFILE } from "./mockData";

class CompanyInfoNode {
  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");
  id = "companyInfo";

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
You speak for Toque da Terra.
Tone: friendly, polite, concise, respectful, not too intimate.

Company profile:
${JSON.stringify(COMPANY_PROFILE, null, 2)}

Rules:
- Answer questions about the company, shipping, and policies using the profile.
- Keep replies short (2-3 sentences). If unsure, say what you do know and offer to check.

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

export default new CompanyInfoNode();
