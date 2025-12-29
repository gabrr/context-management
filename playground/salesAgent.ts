import Agent from "@/agent";
import { logNode } from "@/nodes";
import intentClassifierNode from "./nodes/intent_classifier";

export const createSalesAgent = () => {
  const agent = new Agent({
    instructions: { system: "You are a sales agent." },
  });

  agent.error(logNode).add(intentClassifierNode).add(logNode);

  return agent;
};
