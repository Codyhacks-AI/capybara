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
};

export type OutputFunctionCall = {
  name: string;
  arguments: {
    linesToHighlight: {
      startLine: string;
      endLine: string;
      reason: string;
      suggestion: string;
    }[];
  };
};
