import { OpenAI } from "langchain/llms/openai";
import * as dotenv from "dotenv";
import * as vscode from "vscode";

dotenv.config();
const openAIApiKey: string =
  "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";
// export const defaultLLM = new OpenAI({
//   openAIApiKey: `${env:OPENAI_API_KEY}`,
  temperature: 0.9,
});
