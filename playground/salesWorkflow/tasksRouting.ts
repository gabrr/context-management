import { BaseNode, NodeResult } from "@/nodes";
import { IntentResult, SalesIntent } from "./types";
import { IAgentContext } from "@/agent";

import productInfoNode from "./product_info";
import orderTrackingNode from "./order_tracking";
import orderUpdateNode from "./order_update";
import companyInfoNode from "./company_info";
import supportNode from "./support";
import chatNode from "./chat";

function tasksRouting(
  id: string,
  routes: Array<{ intent: SalesIntent; node: BaseNode }>
): BaseNode {
  return new (class Router extends BaseNode {
    id = id;

    async run(ctx: IAgentContext): Promise<NodeResult> {
      const intentResult = ctx.lastNodeResult?.value;

      const handler =
        routes.find((r) => r.intent === intentResult)?.node ?? chatNode;

      return (await handler.run(ctx)) as NodeResult;
    }
  })();
}

const ROUTES = [
  { intent: SalesIntent.PRODUCT_INFO, node: productInfoNode },
  { intent: SalesIntent.ORDER_TRACKING, node: orderTrackingNode },
  { intent: SalesIntent.ORDER_UPDATE, node: orderUpdateNode },
  { intent: SalesIntent.COMPANY_INFO, node: companyInfoNode },
  { intent: SalesIntent.SUPPORT, node: supportNode },
  { intent: SalesIntent.CHAT, node: chatNode },
  { intent: SalesIntent.UNKNOWN, node: chatNode }, // fallback
];

const routerNode = tasksRouting("router", ROUTES);
export default routerNode;
