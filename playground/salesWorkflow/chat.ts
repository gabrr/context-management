import { BaseNode, NodeResult } from "@/nodes";
import { IAgentContext } from "@/agent";
import { createAgent } from "@/factories/agentMaker";
import { IntentResult, SalesIntent } from "./types";

export const createSystemPrompt = (history: MemoryMsg[]) => {
  const historyText = history
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  return `
You are a Toque da Terra assistant.
Tone: friendly, polite, concise, respectful, not too intimate.
Use the history if relevant, otherwise focus on the latest message.

Company: Toque da Terra (spices).

History:
${historyText}

==
  `;
};

interface MemoryMsg {
  role: "user" | "assistant";
  content: string;
}

class ChatNode extends BaseNode {
  id = "chat";
  // Using the same model as intent_classifier for consistency, presumably available locally
  llm = createAgent("ollama", "llama3.2:3b");

  private getIntent(ctx: IAgentContext): IntentResult | null {
    const intentResult = (ctx.nodeResults ?? [])
      .slice()
      .reverse()
      .find((r) => r?.nodeId === "intentClassifier")?.value as
      | IntentResult
      | undefined;

    return intentResult ?? null;
  }

  async run(ctx: IAgentContext): Promise<NodeResult> {
    // Access memory from context.
    // We assume ctx.memory.shortTerm is the array of messages from playground/memory.ts
    const history = (ctx.memory?.shortTerm as MemoryMsg[]) || [];

    const hasPreviousAnswer = (ctx.nodeResults ?? []).some(
      (r) => r.nodeId !== "intentClassifier"
    );

    if (hasPreviousAnswer) {
      ctx.tools?.logger?.(
        "[chat] skipped: previous node already produced an answer",
        {}
      );
      return {
        nodeId: this.id,
        value: { status: "skipped", reason: "previous_answer" },
      };
    }

    const intent = this.getIntent(ctx);
    if (
      intent &&
      intent.intent !== SalesIntent.CHAT &&
      intent.intent !== SalesIntent.UNKNOWN
    ) {
      ctx.tools?.logger?.(
        `[chat] skipped: intent ${intent.intent} not CHAT/UNKNOWN`,
        {}
      );
      return {
        nodeId: this.id,
        value: {
          status: "skipped",
          reason: "intent_not_chat",
          intent: intent.intent,
        },
      };
    }

    const systemPrompt = createSystemPrompt(history);

    const userMessage = ctx.user?.request ?? "";

    const response = await this.llm.run(systemPrompt, userMessage);

    return {
      nodeId: this.id,
      value: response,
    };
  }
}

export default new ChatNode();
