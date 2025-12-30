import Agent from "@/agent";
import { errorNode, BaseNode, NodeResult } from "@/nodes";
import { IAgentContext } from "@/agent";
import intentClassifierNode from "./salesWorkflow/intent_classifier";
import productInfoNode from "./salesWorkflow/product_info";
import orderTrackingNode from "./salesWorkflow/order_tracking";
import orderUpdateNode from "./salesWorkflow/order_update";
import companyInfoNode from "./salesWorkflow/company_info";
import supportNode from "./salesWorkflow/support";
import chatNode from "./salesWorkflow/chat";
import { SalesIntent, IntentResult } from "./salesWorkflow/types";

export const createSalesAgent = () => {
  const agent = new Agent();

  const ROUTES = [
    { intent: SalesIntent.PRODUCT_INFO, node: productInfoNode },
    { intent: SalesIntent.ORDER_TRACKING, node: orderTrackingNode },
    { intent: SalesIntent.ORDER_UPDATE, node: orderUpdateNode },
    { intent: SalesIntent.COMPANY_INFO, node: companyInfoNode },
    { intent: SalesIntent.SUPPORT, node: supportNode },
    { intent: SalesIntent.CHAT, node: chatNode },
    { intent: SalesIntent.UNKNOWN, node: chatNode }, // fallback
  ];

  const routerNode = makeRouter("router", ROUTES);

  agent.error(errorNode).add(intentClassifierNode).add(routerNode);

  return agent;
};

function makeRouter(
  id: string,
  routes: Array<{ intent: SalesIntent; node: BaseNode }>
): BaseNode {
  return new (class Router extends BaseNode {
    id = id;
    async run(ctx: IAgentContext): Promise<NodeResult> {
      const intentResult = (ctx.nodeResults ?? [])
        .slice()
        .reverse()
        .find((r) => r.nodeId === "intentClassifier")?.value as IntentResult;

      const intent = intentResult ?? {
        intent: SalesIntent.UNKNOWN,
        confidence: 0,
      };

      const handler =
        routes.find((r) => r.intent === intent.intent)?.node ?? chatNode;

      return (await handler.run(ctx)) as NodeResult;
    }
  })();
}
