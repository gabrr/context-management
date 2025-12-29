import OpenAI from "openai";

export interface TextAgent {
  run(instructions: string, inputText: string): Promise<string>;
}

export class OllamaAgent implements TextAgent {
  host: string = "http://localhost:11434";
  model: string;

  constructor(model: string = "llama3.1:8b") {
    this.model = model;
  }

  async run(instructions: string, inputText: string): Promise<string> {
    const prompt = `System: ${instructions.trim()}\n\nUser: ${inputText.trim()}\n\nAssistant:`;

    const response = await fetch(`${this.host}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = (await response.json()) as { response: string };
    return data.response.trim();
  }
}

export class OpenAIAgent implements TextAgent {
  private openai: OpenAI;
  private model: string;

  constructor(model: string = "gpt-5-nano") {
    this.model = model;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY_LOCAL || process.env.OPENAI_API_KEY,
    });
  }

  async run(instructions: string, inputText: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: inputText.trim() },
      ],
    });

    return response.choices[0].message.content || "";
  }
}
