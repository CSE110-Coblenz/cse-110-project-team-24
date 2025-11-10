import Konva from "konva";
import {
  INFO_TEXT_COLOR,
  INFO_TEXT_FONT_SIZE,
  INFO_TEXT_LINE_HEIGHT,
  PROMPT_TEXT,
} from "./constants.ts";

export class InfoPanel {
  private readonly textNode: Konva.Text;

  constructor(width: number, centerX: number, yPosition: number) {
    this.textNode = new Konva.Text({
      x: centerX - width / 2,
      y: yPosition,
      width,
      align: "center",
      text: PROMPT_TEXT,
      fontSize: INFO_TEXT_FONT_SIZE,
      fontFamily: "Arial",
      fill: INFO_TEXT_COLOR,
      lineHeight: INFO_TEXT_LINE_HEIGHT,
    });
  }

  getNode(): Konva.Text {
    return this.textNode;
  }

  showDetail(detail: string): void {
    this.textNode.text(detail);
  }

  showPrompt(): void {
    this.textNode.text(PROMPT_TEXT);
  }
}
