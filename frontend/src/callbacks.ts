import * as vscode from "vscode";
import Flask from "./api/flask";
import OpenAI from "./api/openai";
import { getConfigSettings, highlightLines } from "./vscode/editor";
import { codeHighlightingPrompt } from "./prompts";
import { addLineNumbers } from "./helpers";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  vscode.window.showInformationMessage("Running extension...");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = addLineNumbers(document.getText());
  console.log(text);
  try {
    const vscodeConfig = await getConfigSettings();
    const res = await OpenAI.callFunction(
      codeHighlightingPrompt(text, vscodeConfig),
    );
    if (!res) {
      return;
    }

    await highlightLines(document, res.arguments.codeBlocksToHighlight);
  } catch (e) {
    console.log(e);
  }
};

export const searchDuplicates = async (text: string) => {
  try {
    const res = await OpenAI.callFunction({
      messages: [
        {
          role: "system",
          content:
            "You are a code linter that is trying to identify lines of that are needlessly repeated and there is duplicate code. Please highlight BOTH lines that are duplicated",
        },
        {
          role: "user",
          content: `
            Give me blocks of duplicate code, reasons why they are bad, and suggestions for how to improve them.
            Here is the code that I have written:
            ${text}
            `,
        },
      ],
      function: {
        name: "highlightDuplicateCode",
        description: `
          Returns lines to highlight where code is repeated unneccessarily. The lines of both duplicate codes are returned.
          Please return the reasons for why they should be improved, and suggestions for how.
          The return type is an array of objects containing the starting and end line to highlight, the reason for improvement,
          and suggestions for how to improve it.
          `,
        parameters: {
          type: "object",
          properties: {
            linesToHighlight: {
              type: "array",
              description: "Lines of duplicate code to highlight",
              items: {
                type: "object",
                properties: {
                  startLine: {
                    type: "string",
                    description:
                      "The starting line of the code block to improve.",
                  },
                  endLine: {
                    type: "string",
                    description: "The end line of the code block to improve.",
                  },
                  reason: {
                    type: "string",
                    description: "The reason why the code can be improved.",
                  },
                  suggestion: {
                    type: "string",
                    description: "A suggestion for how to improve the code.",
                  },
                },
                required: ["startLine", "endLine", "reason", "suggestion"],
              },
            },
          },
          required: ["linesToHighlight"],
        },
      },
    });
    // console.log(res);
  } catch (e) {
    console.log(e);
  }
};
