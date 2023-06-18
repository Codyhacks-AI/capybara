import {
  ExperienceLevel,
  InputFunction,
  InputMessage,
  VSCodeConfig,
} from "./types";

export const codeHighlightingPrompt = (
  text: string,
  experienceLevel: ExperienceLevel,
  vscodeConfig: VSCodeConfig,
) => {
  return {
    messages: [
      {
        role: "system",
        content: `
              You are an expert coder that is trying to identify and highlight code blocks of poor coding style and give feedback for improvement.
              You should be looking for high level poor code quality, not syntactical and formatting issues.
              You should never give suggestions on tab sizing, identation, or whitespace.
              You should only give 0 to 5 suggestions, so choose the most important ones.
              You are giving suggestions to a ${experienceLevel}.
              `,
      },
      {
        role: "user",
        content: `
              Give me blocks of poorly written code, reasons why they are bad, and suggestions for how to improve them.
              My VSCode settings are: tab size = ${vscodeConfig.tabSize}
  
              Here is the code that I have written:
              ${text}
              `,
      },
    ] as InputMessage[],
    function: {
      name: "highlightPoorCodeStyle",
      description: `
            Returns code blocks to highlight where code can be improved, reasons for why they should be improved, and suggestions for how.
            The return type is an array of objects containing the starting and end line of each block, the reason for improvement,
            and suggestions for how to improve it.
            `,
      parameters: {
        type: "object",
        properties: {
          codeBlocksToHighlight: {
            type: "array",
            description: "Array of code blocks with poor style to highlight",
            items: {
              type: "object",
              properties: {
                startLine: {
                  type: "integer",
                  description:
                    "The starting line number of the code block to improve.",
                },
                endLine: {
                  type: "integer",
                  description:
                    "The ending line number of the code block to improve.",
                },
                comment: {
                  type: "string",
                  description:
                    "The comment including why the code block should be improved and a suggestion for how to do so.",
                },
              },
              required: ["startLine", "endLine", "comment"],
            },
          },
        },
        required: ["blocksToHighlight"],
      },
    } as InputFunction,
  };
};

export const calibrateExperienceLevel = (text: string) => {
  return {
    messages: [
      {
        role: "system",
        content: `
          You are an expert coder that is trying to first figure out the experience level of the programmer that wrote the code.
        `,
      },
      {
        role: "user",
        content: `
          Read the following code and call a function with my experience level. Here is the code
          ${text}
        `,
      },
    ] as InputMessage[],
    function: {
      name: "setExperienceLevel",
      description: `
        This function sets the experience level of the programmer based on the code that they have written so far.
      `,
      parameters: {
        type: "object",
        properties: {
          experienceLevel: {
            type: "string",
            enum: [
              "beginner",
              "intermediate",
              "experienced",
              "professional",
              "expert",
            ],
            description:
              "The experience level that we have calibrated to. It is a value from: beginner, intermediate, experienced, professional, expert.",
          },
        },
        required: ["experienceLevel"],
      },
    } as InputFunction,
  };
};
