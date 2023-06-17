import * as vscode from "vscode";
import { getOpenAIApi } from "./api";
import { OpenAI } from "langchain/llms/openai";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  const api = getOpenAIApi();
  vscode.window.showInformationMessage("Saved!");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = document.getText();

  console.log("Sending request...");
  const res = await api.callChain({
    chainName: "hi",
    inputs: { name: "Tommy" },
  });
  console.log("RESULT:", res);
};
