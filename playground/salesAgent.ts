import Agent from "@/agent";
import { logNode } from "@/nodes";

export const createSalesAgent = () => {
  const agent = new Agent({
    instructions: { system: "You are a sales agent." },
  });

  agent.error(logNode).add(logNode);

  return agent;
};
