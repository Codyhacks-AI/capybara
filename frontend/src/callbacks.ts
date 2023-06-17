import * as vscode from "vscode";
import { getOpenAIApi } from "./api";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  const api = getOpenAIApi();
  vscode.window.showInformationMessage("Saved!");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = document.getText();
};
