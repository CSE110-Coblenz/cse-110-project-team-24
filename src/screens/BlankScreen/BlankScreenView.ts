import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

export class BlankScreenView implements View {
  private group: Konva.Group;

  constructor() {
    this.group = new Konva.Group({ visible: false });

    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#ffffff",
    });
    this.group.add(bg);

    const placeholder = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      text: "Blank screen placeholder",
      fontSize: 24,
      fontFamily: "Arial",
      fill: "#666",
      align: "center",
    });
    placeholder.offsetX(placeholder.width() / 2);
    placeholder.offsetY(placeholder.height() / 2);
    this.group.add(placeholder);
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}


