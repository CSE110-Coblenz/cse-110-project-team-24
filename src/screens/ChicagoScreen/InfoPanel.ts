import Konva from "konva";
import {
  INFO_PANEL_BACKGROUND_COLOR,
  INFO_PANEL_BORDER_COLOR,
  INFO_PANEL_MIN_HEIGHT,
  INFO_PANEL_PADDING,
  INFO_PANEL_SHADOW_COLOR,
  INFO_TEXT_COLOR,
  INFO_TEXT_FONT_SIZE,
  INFO_TEXT_LINE_HEIGHT,
  PROMPT_TEXT,
} from "./constants.ts";

export class InfoPanel {
  private readonly group: Konva.Group;
  private readonly background: Konva.Rect;
  private readonly textNode: Konva.Text;

  constructor(width: number, centerX: number, yPosition: number) {
    this.group = new Konva.Group();
    this.background = new Konva.Rect({
      cornerRadius: 20,
      fill: INFO_PANEL_BACKGROUND_COLOR,
      stroke: INFO_PANEL_BORDER_COLOR,
      strokeWidth: 1,
      shadowColor: INFO_PANEL_SHADOW_COLOR,
      shadowBlur: 24,
      shadowOpacity: 0.4,
      shadowOffsetY: 8,
      listening: false,
    });

    this.textNode = new Konva.Text({
      text: PROMPT_TEXT,
      align: "center",
      fontSize: INFO_TEXT_FONT_SIZE,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fill: INFO_TEXT_COLOR,
      lineHeight: INFO_TEXT_LINE_HEIGHT,
    });

    this.group.add(this.background);
    this.group.add(this.textNode);

    this.updateLayout(width, centerX, yPosition);
  }

  getNode(): Konva.Group {
    return this.group;
  }

  showDetail(detail: string): void {
    this.textNode.text(detail);
    this.updatePanelHeight();
  }

  showPrompt(): void {
    this.textNode.text(PROMPT_TEXT);
    this.updatePanelHeight();
  }

  updateLayout(width: number, centerX: number, yPosition: number): void {
    this.group.position({
      x: centerX - width / 2,
      y: yPosition,
    });

    this.background.width(width);
    this.textNode.width(width - INFO_PANEL_PADDING * 2);
    this.textNode.x(INFO_PANEL_PADDING);
    this.textNode.y(INFO_PANEL_PADDING);
    this.background.x(0);
    this.background.y(0);

    this.updatePanelHeight();
  }

  private updatePanelHeight(): void {
    const textHeight = this.textNode.height();
    const desiredHeight = Math.max(
      INFO_PANEL_MIN_HEIGHT,
      textHeight + INFO_PANEL_PADDING * 2
    );

    this.background.height(desiredHeight);
    this.group.height(desiredHeight);
  }
}
