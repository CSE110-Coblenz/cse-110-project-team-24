import Konva from "konva";
import {
  FACT_CARD_CORNER_RADIUS,
  FACT_CARD_FONT_FAMILY,
  FACT_CARD_FONT_SIZE,
  FACT_CARD_HEIGHT,
  FACT_CARD_TEXT_COLOR,
  FACT_CARD_WIDTH,
} from "./constants.ts";

export class FactCard {
  private readonly group: Konva.Group;
  private readonly text: Konva.Text;

  constructor(onDragEnd: () => void) {
    this.group = new Konva.Group({ draggable: true });

    const background = new Konva.Rect({
      width: FACT_CARD_WIDTH,
      height: FACT_CARD_HEIGHT,
      cornerRadius: FACT_CARD_CORNER_RADIUS,
      fill: "#ffffff",
      stroke: "#1f4d7a",
      strokeWidth: 3,
      shadowColor: "#1f4d7a",
      shadowBlur: 10,
      shadowOpacity: 0.2,
    });

    this.text = new Konva.Text({
      x: 12,
      y: 12,
      width: FACT_CARD_WIDTH - 24,
      align: "center",
      text: "",
      fontSize: FACT_CARD_FONT_SIZE,
      fontFamily: FACT_CARD_FONT_FAMILY,
      fill: FACT_CARD_TEXT_COLOR,
    });

    this.group.add(background);
    this.group.add(this.text);
    this.group.on("dragend", onDragEnd);
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  setText(fact: string): void {
    this.text.text(fact);
  }

  setDraggable(enabled: boolean): void {
    this.group.draggable(enabled);
  }

  resetPosition(center: { x: number; y: number }): void {
    this.group.position({
      x: center.x - FACT_CARD_WIDTH / 2,
      y: center.y - FACT_CARD_HEIGHT / 2,
    });
  }

  getCenter(): { x: number; y: number } {
    return {
      x: this.group.x() + FACT_CARD_WIDTH / 2,
      y: this.group.y() + FACT_CARD_HEIGHT / 2,
    };
  }

  getWidth(): number {
    return FACT_CARD_WIDTH;
  }

  getHeight(): number {
    return FACT_CARD_HEIGHT;
  }
}
