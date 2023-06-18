export class Empty {
  [key: string]: never;
}
export type EmptyObject = Record<string, never>;

export const addLineNumbers = (text: string) => {
  const lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    lines[i] = `[${i + 1}:] ` + lines[i];
  }
  return lines.join("\n");
};
