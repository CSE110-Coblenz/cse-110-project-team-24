import Konva from "konva";
import {
  NEXT_BUTTON_CORNER_RADIUS,
  NEXT_BUTTON_FILL,
  NEXT_BUTTON_FONT_SIZE,
  NEXT_BUTTON_HEIGHT,
  NEXT_BUTTON_TEXT_COLOR,
  NEXT_BUTTON_WIDTH,
} from "./constants.ts";

export class NextButton {
  private readonly group: Konva.Group;
  private readonly background: Konva.Rect;
  private readonly label: Konva.Text;

  constructor(onClick: () => void) {
    this.group = new Konva.Group({
      visible: false,
      listening: false,
      offsetX: NEXT_BUTTON_WIDTH / 2,
      offsetY: NEXT_BUTTON_HEIGHT / 2,
    });

    this.background = new Konva.Rect({
      width: NEXT_BUTTON_WIDTH,
      height: NEXT_BUTTON_HEIGHT,
      cornerRadius: NEXT_BUTTON_CORNER_RADIUS,
      fill: NEXT_BUTTON_FILL,
      shadowColor: "#000000",
      shadowBlur: 12,
      shadowOpacity: 0.2,
    });
    this.group.add(this.background);

    this.label = new Konva.Text({
      x: 0,
      y: 0,
      width: NEXT_BUTTON_WIDTH,
      height: NEXT_BUTTON_HEIGHT,
      align: "center",
      verticalAlign: "middle",
      text: "Next ▶",
      fontFamily: "Arial",
      fontSize: NEXT_BUTTON_FONT_SIZE,
      fill: NEXT_BUTTON_TEXT_COLOR,
    });
    this.group.add(this.label);

    this.group.on("click tap", onClick);
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  setPosition(position: { x: number; y: number }): void {
    this.group.position(position);
  }

  show(label: string): void {
    this.setLabel(label);
    this.group.visible(true);
    this.group.listening(true);
    this.group.getLayer()?.batchDraw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.listening(false);
    this.group.getLayer()?.batchDraw();
  }

  isVisible(): boolean {
    return this.group.visible();
  }

  private setLabel(label: string): void {
    this.label.text(label);
  }
}
