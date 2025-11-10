import Konva from "konva";
import {
  NEXT_ARROW_FILL,
  NEXT_ARROW_ICON_COLOR,
  NEXT_ARROW_LABEL_COLOR,
  NEXT_ARROW_LABEL_FONT_SIZE,
  NEXT_ARROW_LABEL_MARGIN,
  NEXT_ARROW_RADIUS,
} from "./constants.ts";

export class NextButton {
  private readonly group: Konva.Group;
  private readonly circle: Konva.Circle;
  private readonly arrow: Konva.Path;
  private readonly label: Konva.Text;

  constructor(onClick: () => void) {
    this.group = new Konva.Group({
      visible: false,
      listening: false,
    });

    this.circle = new Konva.Circle({
      radius: NEXT_ARROW_RADIUS,
      fill: NEXT_ARROW_FILL,
      shadowColor: "#000000",
      shadowBlur: 12,
      shadowOpacity: 0.2,
      shadowOffsetY: 2,
    });
    this.group.add(this.circle);

    this.arrow = new Konva.Path({
      data: "M -8 -12 L 10 0 L -8 12 Z",
      fill: NEXT_ARROW_ICON_COLOR,
    });
    this.group.add(this.arrow);

    this.label = new Konva.Text({
      x: -60,
      y: NEXT_ARROW_RADIUS + NEXT_ARROW_LABEL_MARGIN,
      width: 120,
      align: "center",
      text: "",
      fontFamily: "Arial",
      fontSize: NEXT_ARROW_LABEL_FONT_SIZE,
      fill: NEXT_ARROW_LABEL_COLOR,
    });
    this.group.add(this.label);

    this.group.on("click tap", onClick);
    this.group.on("mouseenter", () => {
      const stage = this.group.getStage();
      if (stage) stage.container().style.cursor = "pointer";
    });
    this.group.on("mouseleave", () => {
      const stage = this.group.getStage();
      if (stage) stage.container().style.cursor = "default";
    });
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
    const stage = this.group.getStage();
    if (stage) stage.container().style.cursor = "default";
    this.group.getLayer()?.batchDraw();
  }

  isVisible(): boolean {
    return this.group.visible();
  }

  private setLabel(label: string): void {
    this.label.text(label);
  }
}
