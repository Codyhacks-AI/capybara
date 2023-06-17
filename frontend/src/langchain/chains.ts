import { OpenAI } from "langchain/llms/openai";
import { BaseChain, LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

const chainMap: { [key: string]: BaseChain } = {};

export const createPromptLLMChain = (params: {
  llm: OpenAI;
  prompt: PromptTemplate;
  name: string;
}): LLMChain => {
  const { llm, prompt, name } = params;
  if (chainMap[name]) {
    throw Error("Prompt already exists");
  }
  const chain = new LLMChain({ llm, prompt });
  chainMap[name] = chain;
  return chain;
};

export const getChain = (name: string): BaseChain => {
  if (!chainMap[name]) {
    throw Error(`Chain ${name} doesn't exist!`);
  }
  return chainMap[name];
};
