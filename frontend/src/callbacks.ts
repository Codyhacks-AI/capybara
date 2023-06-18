import * as vscode from "vscode";
import Flask from "./api/flask";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  vscode.window.showInformationMessage("Saved!");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = document.getText();
  console.log("LKJ:LSKDFJ:DLKFSF");
  const res = await Flask.test();
  console.log("RESULT", res);
};
