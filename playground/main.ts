import express from "express";
import cors from "cors";
import { createSalesAgent } from "./salesAgent";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/api/v1/sales-agent/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const agent = createSalesAgent();
    const result = await agent.run({ user: { request: message } });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
