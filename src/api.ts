import { getChain } from "./langchain/chains";

class API {
  async callChain(params: { chainName: string; inputs: any }) {
    const chain = getChain(params.chainName);
    console.log("Chain called with inputs", params.inputs);
    return await chain.call(params.inputs);
  }
}

export const getAPI = () => {
  return new API();
};
