import { Class } from "utility-types";

export type InputMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type NumericParameter = {
  type: "integer" | "number";
  description?: string;
};

export type StringParameter = {
  type: "string";
  description?: string;
  enum?: string[];
};

export type ArrayParameter = {
  type: "array";
  items: Parameter;
  description?: string;
};

export type ObjectParameter = {
  type: "object";
  properties: {
    [key: string]: Parameter;
  };
  required: string[];
  description?: string;
};

export type Parameter =
  | NumericParameter
  | StringParameter
  | ObjectParameter
  | ArrayParameter;

export type InputFunction = {
  name: string;
  description: string;
  parameters: Parameter;
  enum?: string[];
};

export class BlockTip {
  startLine!: number;
  endLine!: number;
  comment!: string;
}

export class CodeBlocksToHighlight {
  codeBlocksToHighlight!: BlockTip[];
}

export class ExperienceLevelInstance {
  experienceLevel!: ExperienceLevel;
}

export type FunctionCall<A extends Class<unknown> = any> = {
  name: string;
  arguments: InstanceType<A>;
};

export enum ExperienceLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Experienced = "Experienced",
  Professional = "Professional",
}

export type VSCodeConfig = {
  tabSize: number;
  experienceLevel: ExperienceLevel;
};

export type WebviewData = {
  document: string;
  block: BlockTip;
};
