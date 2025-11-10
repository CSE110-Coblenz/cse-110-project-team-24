import Konva from "konva";

export interface FactCardOptions {
  width?: number;
  height?: number;
  cornerRadius?: number;
}

const DEFAULT_OPTIONS: Required<FactCardOptions> = {
  width: 240,
  height: 140,
  cornerRadius: 16,
};

export class FactCard {
  private readonly group: Konva.Group;
  private readonly text: Konva.Text;
  private readonly options: Required<FactCardOptions>;

  constructor(onDragEnd: () => void, options: FactCardOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    const { width, height, cornerRadius } = this.options;

    this.group = new Konva.Group({ draggable: true });

    const background = new Konva.Rect({
      width,
      height,
      cornerRadius,
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
      width: width - 24,
      align: "center",
      text: "",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#1a1a1a",
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
    const { width, height } = this.options;
    this.group.position({
      x: center.x - width / 2,
      y: center.y - height / 2,
    });
  }

  getCenter(): { x: number; y: number } {
    const { width, height } = this.options;
    return {
      x: this.group.x() + width / 2,
      y: this.group.y() + height / 2,
    };
  }

  getWidth(): number {
    return this.options.width;
  }

  getHeight(): number {
    return this.options.height;
  }
}

