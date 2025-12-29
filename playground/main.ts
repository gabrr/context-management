import { IAgentContext } from "@/agent";
import cors from "cors";
import express from "express";
import { createShortMemory } from "./memory";
import { createSalesAgent } from "./salesAgent";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

const beautifyResponse = (response: IAgentContext) => {
  return response.nodeResults
    ?.map((result) => {
      return `${result.nodeId}: ${result.value} <br />`;
    })
    .join("\n");
};

const memory = createShortMemory({ maxTurns: 16 });

app.post("/api/v1/sales-agent/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const agent = createSalesAgent();

    const shortTermMemory = memory.context();

    const result = await agent.run({
      user: { request: message },
      memory: { shortTerm: shortTermMemory },
    });

    memory.addUser(message);
    memory.addAssistant(result?.lastNodeResult?.value as string);

    res.json(beautifyResponse(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
