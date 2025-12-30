import { IAgentContext } from "@/agent";
import { BaseNode, NodeResult } from "@/nodes";
import { IntentResult, SalesIntent } from "./types";

/**
 * Base handler that executes only when the upstream intent matches targetIntent.
 * Subclasses implement handle(ctx) with their business logic.
 */
export abstract class BaseHandlerNode extends BaseNode {
  id: string;
  targetIntent: SalesIntent;

  constructor(id: string, targetIntent: SalesIntent) {
    super();
    this.id = id;
    this.targetIntent = targetIntent;
  }

  protected abstract handle(ctx: IAgentContext): Promise<NodeResult>;

  private getIntentResult(ctx: IAgentContext): IntentResult | null {
    const intentResult = (ctx.nodeResults ?? [])
      .slice()
      .reverse()
      .find((r) => r?.nodeId === "intentClassifier")?.value as
      | IntentResult
      | undefined;

    return intentResult ?? null;
  }

  async run(ctx: IAgentContext): Promise<NodeResult> {
    const intentResult = this.getIntentResult(ctx);

    if (!intentResult) {
      console.log(`[${this.id}] skipped: missing intent classification`, {});
      return {
        nodeId: this.id,
        value: { status: "skipped", reason: "missing_intent" },
      };
    }

    if (intentResult.intent !== this.targetIntent) {
      console.log(
        `[${this.id}] skipped: intent ${intentResult.intent} != ${this.targetIntent}`,
        {}
      );
      return {
        nodeId: this.id,
        value: {
          status: "skipped",
          reason: "intent_mismatch",
          intent: intentResult.intent,
        },
      };
    }

    return this.handle(ctx);
  }
}
