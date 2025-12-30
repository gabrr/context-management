import cors from "cors";
import express from "express";
import { createShortMemory } from "./memory";
import { createSalesAgent } from "./salesAgent";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

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

    res.json(result.lastNodeResult?.value);

    console.log(result.memory?.shortTerm);
    console.log(result.nodeResults?.map((r) => [r.nodeId, r.value]));
    console.log(JSON.stringify(result.lastNodeResult?.value));

    memory.addUser(message);
    memory.addAssistant(result?.lastNodeResult?.value as string);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
