import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import * as vscode from "vscode";

export const chat = new ChatOpenAI({
  openAIApiKey: vscode.workspace
    .getConfiguration()
    .get("capybaras.openAiApiKey") as string,
  temperature: 0,
});

export const startCodeCommentChat = (
  document: string,
  comment: string,
  startLine: number,
  endLine: number,
) => {
  const codeCommentHelpPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are chatting on this ${comment} about lines ${startLine} to ${endLine}.`,
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
    input: string;
    chain: ConversationChain;
  }): Promise<string> => {
    const result = await params.chain.call({
      input: params.input,
    });
    if (result.response) {
      return result.response as string;
    } else {
      throw Error("Bad response from codeCommentChat");
    }
  },
};

export default LangChain;
