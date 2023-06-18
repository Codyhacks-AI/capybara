import { Class } from "utility-types";
import { createRequest, Request } from ".";
import * as vscode from "vscode";
import { Configuration, OpenAIApi } from "openai";
import { InputMessage, InputFunction, FunctionCall } from "../types";

const config = new Configuration({
  apiKey: vscode.workspace
    .getConfiguration()
    .get("capybaras.openAiApiKey") as string,
});
const openai = new OpenAIApi(config);

export const OpenAI = {
  callFunction: async <A extends Class<unknown>>(params: {
    messages: InputMessage[];
    function: InputFunction;
    arguments: A;
  }): Promise<FunctionCall<A> | undefined> => {
    const input = {
      model: "gpt-4-0613",
      messages: params.messages,
      functions: [params.function],
    };
    console.log(input);
    const output = await openai.createChatCompletion(input);
    const message = output.data.choices[0].message;
    if (message && message.function_call) {
      const functionCall = message.function_call;
      const output: FunctionCall<A> = {
        name: functionCall.name!,
        arguments: JSON.parse(functionCall.arguments!),
      };
      console.log(output);
      return output;
    }
  },
};

export default OpenAI;
