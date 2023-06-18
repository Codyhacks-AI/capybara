import * as vscode from "vscode";
import Flask from "./api/flask";
import OpenAI from "./api/openai";
import { getConfigSettings, highlightLines } from "./vscode/editor";
import { calibrateExperienceLevel, codeHighlightingPrompt } from "./prompts";
import { addLineNumbers } from "./helpers";
import {
  BlockTip,
  CodeBlocksToHighlight,
  ExperienceLevel,
  ExperienceLevelInstance,
} from "./types";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  vscode.window.showInformationMessage("Running extension...");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = addLineNumbers(document.getText());
  try {
    const vscodeConfig = await getConfigSettings();

    const experienceLevelResult = await OpenAI.callFunction({
      ...calibrateExperienceLevel(text),
      arguments: ExperienceLevelInstance,
    });
    if (!experienceLevelResult) {
      return;
    }
    const experienceLevel = experienceLevelResult.arguments.experienceLevel;
    vscode.window.showInformationMessage(
      `Calculated experience level: ${experienceLevel}`,
    );

    const highlightResult = await OpenAI.callFunction({
      ...codeHighlightingPrompt(text, experienceLevel, vscodeConfig),
      arguments: CodeBlocksToHighlight,
    });
    if (!highlightResult) {
      return;
    }
    await highlightLines(
      document,
      highlightResult.arguments.codeBlocksToHighlight,
    );
  } catch (e) {
    console.log(e);
  }
};
