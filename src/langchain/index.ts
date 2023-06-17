import { hiPrompt } from "./templates";
import { createPromptLLMChain } from "./chains";

export const createChains = () => {
  createPromptLLMChain({ prompt: hiPrompt, name: "hi" });
};
