import { OpenAI } from "langchain/llms/openai";
import { BaseChain, LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import * as vscode from "vscode";

const chainMap: { [key: string]: BaseChain } = {};
const openAIApiKey = vscode.workspace
  .getConfiguration()
  .get("capybaras.openAiApiKey") as string;

export const createPromptLLMChain = (params: {
  prompt: PromptTemplate;
  name: string;
}): LLMChain => {
  const { prompt, name } = params;
  if (chainMap[name]) {
    throw Error("Prompt already exists");
  }
  const defaultLLM = new OpenAI({
    openAIApiKey,
    temperature: 0.9,
  });
  const chain = new LLMChain({ llm: defaultLLM, prompt });
  chainMap[name] = chain;
  return chain;
};

export const getChain = (name: string): BaseChain => {
  if (!chainMap[name]) {
    throw Error(`Chain ${name} doesn't exist!`);
  }
  return chainMap[name];
};
