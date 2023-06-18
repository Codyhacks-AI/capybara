import * as vscode from "vscode";
import { BlockTip, ExperienceLevel, VSCodeConfig } from "../types";

const yellowDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "yellow",
});

const redDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: "rgba(255, 0, 0, 0.3)",
});

type BlockTipWithRange = BlockTip & { range: vscode.Range };

class VSCodeState {
  highlightedBlocks: BlockTipWithRange[];

  constructor() {
    this.highlightedBlocks = [];
  }
}

const state = new VSCodeState();

export const highlightLines = async (
  document: vscode.TextDocument,
  blocksToHighlight: BlockTip[],
): Promise<void> => {
  const editor = await vscode.window.showTextDocument(document);
  const decorations: vscode.DecorationOptions[] = [];
  const blockTipsWithRange: BlockTipWithRange[] = [];
  blocksToHighlight.map((block) => {
    const { startLine, endLine, comment } = block;
    const endLineRef = editor.document.lineAt(endLine - 1);
    const range = new vscode.Range(
      new vscode.Position(startLine - 1, 0),
      new vscode.Position(endLine - 1, endLineRef.text.length),
    );
    const hoverMessage = [new vscode.MarkdownString(comment)];
    decorations.push({
      range,
      hoverMessage,
    });
    blockTipsWithRange.push({
      ...block,
      range,
    });
  });
  state.highlightedBlocks = [...blockTipsWithRange];
  editor.setDecorations(redDecoration, decorations);
};

export const getConfigSettings = async (): Promise<VSCodeConfig> => {
  const tabSize =
    (vscode.workspace.getConfiguration("editor").get("tabSize") as number) || 4;
  const experienceLevel = vscode.workspace
    .getConfiguration()
    .get("capybaras.experienceLevel") as ExperienceLevel;
  return {
    tabSize,
    experienceLevel,
  };
};

export const rangesOverlap = (
  queryRange: vscode.Range,
  keyRange: vscode.Range,
) => {
  return !!keyRange.intersection(queryRange);
};
