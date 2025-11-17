import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import {
  FACT_CARD_BADGE_BACKGROUND,
  FACT_CARD_BADGE_FONT_SIZE,
  FACT_CARD_BADGE_TEXT,
  FACT_CARD_BADGE_TEXT_COLOR,
  FACT_CARD_CORNER_RADIUS,
  FACT_CARD_FONT_FAMILY,
  FACT_CARD_FONT_SIZE,
  FACT_CARD_HEIGHT,
  FACT_CARD_TEXT_COLOR,
  FACT_CARD_TEXT_MARGIN,
  FACT_CARD_WIDTH,
} from "./constants.ts";

export class FactCard {
  private readonly group: Konva.Group;
  private readonly text: Konva.Text;
  private readonly badge: Konva.Label;

  constructor(onDragEnd: (event: KonvaEventObject<DragEvent>) => void) {
    this.group = new Konva.Group({ draggable: true });

    const background = new Konva.Rect({
      width: FACT_CARD_WIDTH,
      height: FACT_CARD_HEIGHT,
      cornerRadius: FACT_CARD_CORNER_RADIUS,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: FACT_CARD_WIDTH, y: FACT_CARD_HEIGHT },
      fillLinearGradientColorStops: [0, "#ffffff", 1, "#f0f5ff"],
      stroke: "#1f4d7a",
      strokeWidth: 3,
      shadowColor: "#1f4d7a",
      shadowBlur: 20,
      shadowOpacity: 0.2,
      shadowOffsetY: 10,
    });

    this.badge = new Konva.Label({
      x: FACT_CARD_TEXT_MARGIN,
      y: 12,
      opacity: 0.9,
    });
    const badgeTag = new Konva.Tag({
      cornerRadius: 14,
      fill: FACT_CARD_BADGE_BACKGROUND,
    });
    const badgeText = new Konva.Text({
      text: FACT_CARD_BADGE_TEXT,
      fontSize: FACT_CARD_BADGE_FONT_SIZE,
      fontFamily: FACT_CARD_FONT_FAMILY,
      fontStyle: "600",
      fill: FACT_CARD_BADGE_TEXT_COLOR,
      padding: 10,
    });
    this.badge.add(badgeTag);
    this.badge.add(badgeText);

    this.text = new Konva.Text({
      x: FACT_CARD_TEXT_MARGIN,
      y: 56,
      width: FACT_CARD_WIDTH - FACT_CARD_TEXT_MARGIN * 2,
      align: "center",
      text: "",
      fontSize: FACT_CARD_FONT_SIZE,
      fontFamily: FACT_CARD_FONT_FAMILY,
      fill: FACT_CARD_TEXT_COLOR,
    });

    this.group.add(background);
    this.group.add(this.badge);
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
