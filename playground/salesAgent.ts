import Agent from "@/agent";
import { logNode } from "@/nodes";
import chatNode from "./salesWorkflow/chat";
import intentClassifierNode from "./salesWorkflow/intent_classifier";

export const createSalesAgent = () => {
  const agent = new Agent({
    instructions: { system: "You are a sales agent." },
  });

  agent.error(logNode).add(intentClassifierNode).add(chatNode);

  return agent;
};
