import * as vscode from "vscode";
import Flask from "./api/flask";
import OpenAI from "./api/openai";

export const onDocumentSave = async (document: vscode.TextDocument) => {
  vscode.window.showInformationMessage("Saved!");
  const filename = document.fileName;
  const languageId = document.languageId;
  const text = document.getText();
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
    console.log(res);

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
