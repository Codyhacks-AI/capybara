// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { onDocumentSave } from "./callbacks";
import axios from "axios";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage("Extension started!");

  // AXIOS DEFAULTS
  axios.defaults.headers["Content-Type"] = "application/json";

  vscode.workspace.onDidSaveTextDocument(onDocumentSave);
}

// This method is called when your extension is deactivated
export function deactivate() {}
