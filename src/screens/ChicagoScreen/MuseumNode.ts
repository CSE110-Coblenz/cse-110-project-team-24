import Konva from "konva";
import type { Museum } from "./Museum.ts";

export interface MuseumNodeOptions {
  radius?: number;
  labelWidth?: number;
  labelOffsetY?: number;
  hitRadius?: number;
}

const DEFAULT_OPTIONS: Required<MuseumNodeOptions> = {
  radius: 60,
  labelWidth: 120,
  labelOffsetY: 80,
  hitRadius: 70,
};

export class MuseumNode {
  private readonly museum: Museum;
  private readonly group: Konva.Group;
  private readonly circle: Konva.Circle;
  private readonly label: Konva.Text;
  private image?: Konva.Image;
  private readonly hitRadius: number;

  constructor(
    museum: Museum,
    position: { x: number; y: number },
    options: MuseumNodeOptions = {}
  ) {
    const { radius, labelWidth, labelOffsetY, hitRadius } = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    this.museum = museum;
    this.hitRadius = hitRadius;

    this.group = new Konva.Group({
      x: position.x,
      y: position.y,
      offsetX: radius,
      offsetY: radius,
    });

    this.circle = new Konva.Circle({
      radius,
      fill: "#e1ecf7",
      stroke: "#1f4d7a",
      strokeWidth: 2,
    });
    this.group.add(this.circle);

    this.label = new Konva.Text({
      x: -labelWidth / 2,
      y: labelOffsetY,
      width: labelWidth,
      align: "center",
      text: museum.name,
      fontSize: 16,
      fontFamily: "Arial",
      fill: "#1a1a1a",
    });
    this.group.add(this.label);

    this.loadImage();
  }

  getId(): string {
    return this.museum.id;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  isHit(point: { x: number; y: number }): boolean {
    const pos = this.group.position();
    const dx = point.x - pos.x;
    const dy = point.y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.hitRadius;
  }

  markMatched(): void {
    this.group.to({
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 0.2,
    });

    this.circle.fill("#cbe5c8");
    this.circle.stroke("#3a6b49");
  }

  private loadImage(): void {
    Konva.Image.fromURL(
      this.museum.imageUrl,
      (image) => {
        image.width(100);
        image.height(100);
        image.x(-50);
        image.y(-50);
        this.image = image;
        this.group.add(image);
        this.group.getLayer()?.batchDraw();
      },
      (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.warn(
            `Image failed to load for museum ${this.museum.name}`,
            err,
          );
        }
      },
    );
  }
}

