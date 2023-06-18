import * as vscode from "vscode";
import Flask from "./api/flask";
import OpenAI from "./api/openai";
import { OutputFunctionCall } from "./api/types";
import { start } from "repl";
import { openChatBot } from "./chatbot";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  vscode.window.showInformationMessage("Saving and checking in progress...");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = document.getText();
  // await searchNameConventions(text);
  await searchDuplicates(text);
  // highlightLine(6, 10, "ho", "hi");
  vscode.window.showInformationMessage("Saved and Logged Imporvements!");
};

export const searchNameConventions = async (text: string) => {
  try {
    const res = await OpenAI.callFunction({
      messages: [
        {
          role: "system",
          content:
            "You are a code linter that is trying to identify lines of poor coding style.",
        },
        {
          role: "user",
          content: `
            Give me blocks of poorly written code, reasons why they are bad, and suggestions for how to improve them.
            Here is the code that I have written:
            ${text}
            `,
        },
      ],
      function: {
        name: "highlightPoorCodeStyle",
        description: `
          Returns lines to highlight where code can be improved, reasons for why they should be improved, and suggestions for how.
          The return type is an array of objects containing the starting and end line to highlight, the reason for improvement,
          and suggestions for how to improve it.
          `,
        parameters: {
          type: "object",
          properties: {
            linesToHighlight: {
              type: "array",
              description: "Lines of poor code style to highlight",
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
    handleLines(res);
    // return res;
    // console.log(res);

    // const res = await OpenAI.callFunction({
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a code linter that is trying to identify lines of poor coding style.",
    //     },
    //     {
    //       role: "user",
    //       content: `
    //         Give me blocks of poorly written code.
    //         Here is the code that I have written:
    //         ${text}
    //         `,
    //     },
    //   ],
    //   function: {
    //     name: "highlightPoorCodeStyle",
    //     description: `
    //       Returns lines to highlight where code can be improved. The return type is an array of numbers representing lines containing code to highlight for improvement.
    //       `,
    //     parameters: {
    //       type: "object",
    //       properties: {
    //         lineToHighlight: {
    //           type: "string",
    //           description: "The line number to highlight for improvement.",
    //         },
    //       },
    //       required: ["lineToHighlight"],
    //     },
    //   },
    // });
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
    handleLines(res);
    return res;

  } catch (e) {
    console.log(e);
  }
};

export const handleLines = async (linesToHighlight: OutputFunctionCall | undefined) => {
  if (linesToHighlight !== undefined) {

    const lineObject = linesToHighlight.arguments.linesToHighlight;
    for (const line of lineObject) {
      const startLine = line["startLine"];
      const endLine = line["endLine"];
      const reason = line["reason"];
      const suggestion = line["suggestion"];

      vscode.window.showInformationMessage(`Line ${startLine} to ${endLine} can be improved because ${reason}. Suggestion: ${suggestion}`);

      const startNumber = await findLineNumber(line["startLine"]);
      const endNumber = await findLineNumber(line["endLine"]);

      highlightLine(startNumber, endNumber, reason, suggestion);
    }
  }
};

const findLineNumber = async (targetLineText: string) => {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const document = activeEditor.document;
    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
      const line = document.lineAt(lineNumber);
      if (line.text === targetLineText) {
        // Line found, return the line number (1-based indexing)
        return lineNumber;
      }
    }
  }
  // Line not found
  return -1;
};

const highlightLine = async (startNumber: number, endNumber: number, reason: string, suggestion: string) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return; // No active editor
  }

  let startPosition = new vscode.Position(startNumber, 0);
  let endPosition = new vscode.Position(startNumber, 1000000);
  if (startNumber >= 0 && startNumber < editor.document.lineCount) {
    const startText = editor.document.lineAt(startNumber).text;
    const startLength = startText.length;
    endPosition = new vscode.Position(startNumber, startLength);
  }

  const highlightDecorationType = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
      // this color will be used in light color themes
      borderColor: 'yellow',// Add this line to set the background color
    },
    dark: {
      // this color will be used in dark color themes
      borderColor: 'yellow', // Add this line to set the background color
    }
  });

  let disposable = vscode.commands.registerCommand('extension.kissAllen', () => {
    // Add your logic here to handle the command
    openChatBot();
  });
  const hoverComponent = new vscode.MarkdownString();
  hoverComponent.appendMarkdown(`[Click to Inquire More (⌘)](command:extension.kissAllen)`);
  hoverComponent.appendMarkdown(`\n\n
    The issue is: ${reason}  
    My suggestion is: ${suggestion} \n
    `);
  hoverComponent.isTrusted = true;

  // vscode.commands.registerCommand('explainMore', (args: { word: string }) => {
  //   const { word } = args;
  //   // Call your function here
  //   explainMore(word);
  // });

  const decoration = {
    range: new vscode.Range(startPosition, endPosition),
    hoverMessage: hoverComponent,
  };
  editor.setDecorations(highlightDecorationType, [decoration]);
};

// function explainMore(word: string) {
//   // Implement your logic here to handle the function call
//   console.log('Clicked on:', word);
// }