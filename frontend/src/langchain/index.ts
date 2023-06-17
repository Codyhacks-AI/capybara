import { hiPrompt } from "./templates";
import { defaultLLM } from "./models";
import { createPromptLLMChain } from "./chains";

export const createChains = () => {
  createPromptLLMChain({ llm: defaultLLM, prompt: hiPrompt, name: "hi" });
};
