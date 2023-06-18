import { Class } from "utility-types";
import { createRequest, Request } from ".";
import * as vscode from "vscode";
import { Configuration, OpenAIApi } from "openai";
import { InputMessage, InputFunction, OutputFunctionCall } from "./types";

const config = new Configuration({
  apiKey: vscode.workspace
    .getConfiguration()
    .get("capybaras.openAiApiKey") as string,
});
const openai = new OpenAIApi(config);

// type FunctionOutput = {
//   id: string;
//   choices: {
//     index: number;
//     message: OutputMessage;
//   }[];
// };

export const OpenAI = {
  callFunction: async (params: {
    messages: InputMessage[];
    function: InputFunction;
  }): Promise<OutputFunctionCall | undefined> => {
    const input = {
      model: "gpt-3.5-turbo-0613",
      messages: params.messages,
      functions: [params.function],
    };
    const message = (await openai.createChatCompletion(input)).data.choices[0]
      .message;
    if (message && message.function_call) {
      const functionCall = message.function_call;
      const output: OutputFunctionCall = {
        name: functionCall.name!,
        arguments: JSON.parse(functionCall.arguments!),
      };
      console.log(output);
      return output;
    }
  },
};

export default OpenAI;
