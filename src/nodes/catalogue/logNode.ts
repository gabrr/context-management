import { IAgentContext } from "@/agent";
import { BaseNode, NodeResult } from "@/nodes";

class LogNode extends BaseNode {
  id = "logNode";

  async run(ctx: IAgentContext): Promise<NodeResult | void> {
    console.log(ctx.lastNodeResult?.value);
    return {
      nodeId: this.id,
      value: ctx.lastNodeResult?.value as string,
    };
  }
}

export default new LogNode();
