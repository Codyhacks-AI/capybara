import * as vscode from "vscode";
import { getAPI } from "./api";
import { OpenAI } from "langchain/llms/openai";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  const api = getAPI();
  vscode.window.showInformationMessage("Saved!");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = document.getText();

  console.log("Sending request...");
  const openAIApiKey: string =
    "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";
  const model = new OpenAI({
    openAIApiKey,
    temperature: 0.9,
  });

  const res = await model.call(
    "What would be a good company name a company that makes colorful socks?",
  );
  console.log(res);

  // const res = await api.callChain({
  //   chainName: "hi",
  //   inputs: { name: "Tommy" },
  // });
  // console.log("RESULT:", res);
};
