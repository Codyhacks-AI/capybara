import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import * as vscode from "vscode";

export const chat = new ChatOpenAI({
  openAIApiKey: vscode.workspace
    .getConfiguration()
    .get("capybaras.openAiApiKey") as string,
  temperature: 0,
});

const splitter = new CharacterTextSplitter({
  chunkSize: 1536,
  chunkOverlap: 200,
});

export const startCodeCommentChat = async (
  document: string,
  comment: string,
  startLine: number,
  endLine: number,
) => {
  const splitCode = await splitter.createDocuments([document], [], {
    chunkHeader: `Code --- `,
    appendChunkOverlapHeader: true,
  });
  const codeCommentHelpPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are chatting with a human about code quality in a file that they wrote. There is a comment that references lines start through end.
      {input}. Respond to each message!`,
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  const codeCommentChain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: codeCommentHelpPrompt,
    llm: chat,
  });

  return codeCommentChain;
};

export const LangChain = {
  callChain: async (params: {
    args: {
      input: string;
      comment: string;
      start: number;
      end: number;
      code: string;
    };
    chain: ConversationChain;
  }): Promise<string> => {
    const result = await params.chain.call({
      input: JSON.stringify({
        comment: params.args.comment,
        start: params.args.start,
        end: params.args.end,
        code: params.args.code,
        message: params.args.input,
      }),
    });
    if (result.response) {
      return result.response as string;
    } else {
      throw Error("Bad response from codeCommentChat");
    }
  },
};

export default LangChain;
