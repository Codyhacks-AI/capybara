import { getChain } from "./langchain/chains";

class OpenAIApi {
  BASE_URL = "http://localhost:5000/";
}

export const getOpenAIApi = () => {
  return new OpenAIApi();
};
