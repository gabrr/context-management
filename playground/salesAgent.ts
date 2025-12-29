import Agent from "@/agent";
import { logNode } from "@/nodes";

const agent = new Agent({ instructions: { system: "You are a sales agent." } });

agent.error(logNode).add(logNode);

export default agent;
