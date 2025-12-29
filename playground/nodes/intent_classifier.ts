import { BaseNode, NodeResult } from "@/nodes";
import { IAgentContext } from "@/agent";
import { createAgent } from "@/factories/agentMaker";

// This node uses the LLM (AI) to classify the user's intent
class IntentClassifierNode extends BaseNode {
  id = "intentClassifier";

  llm = createAgent("ollama", "qwen2.5:1.5b-instruct");

  async run(ctx: IAgentContext): Promise<NodeResult> {
    const intent = await this.llm.run(
      `
			You are an intent classifier.  
			From the user's message, return exactly ONE of the following intents:

			Intents: BUY, INFORMATION, CHAT, SUPPORT, UNKNOWN

			Rules:
			- Return ONLY the intent string.
			- If nothing matches, return 'UNKNOWN'.
			- No explanations.
			`,
      ctx.user?.request ?? ""
    );

    return {
      nodeId: this.id,
      value: intent,
    };
  }
}

export default new IntentClassifierNode();
