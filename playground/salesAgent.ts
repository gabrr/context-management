import Agent from "@/agent";
import { errorNode } from "@/nodes";
import intentClassifierNode from "./salesWorkflow/intent_classifier";
import tasksRouting from "./salesWorkflow/tasksRouting";

export const createSalesAgent = () => {
  const agent = new Agent();

  agent.error(errorNode).add(intentClassifierNode).add(tasksRouting);

  return agent;
};
