import { PromptTemplate } from "langchain/prompts";

export const hiPrompt = new PromptTemplate({
  template: "Can you say hello to {name} for me?",
  inputVariables: ["name"],
});
