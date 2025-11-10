import Konva from "konva";
import type { Museum } from "./Museum.ts";
import {
  MUSEUM_FILL_COLOR,
  MUSEUM_HIT_RADIUS,
  MUSEUM_LABEL_OFFSET_Y,
  MUSEUM_LABEL_WIDTH,
  MUSEUM_MATCH_FILL_COLOR,
  MUSEUM_MATCH_STROKE_COLOR,
  MUSEUM_RADIUS,
  MUSEUM_STROKE_COLOR,
} from "./constants.ts";

export class MuseumNode {
  private readonly museum: Museum;
  private readonly group: Konva.Group;
  private readonly circle: Konva.Circle;
  private readonly label: Konva.Text;
  private image?: Konva.Image;
  private readonly hitRadius: number;

  constructor(museum: Museum, position: { x: number; y: number }) {
    this.museum = museum;
    this.hitRadius = MUSEUM_HIT_RADIUS;

    this.group = new Konva.Group({
      x: position.x,
      y: position.y,
      offsetX: MUSEUM_RADIUS,
      offsetY: MUSEUM_RADIUS,
    });

    this.circle = new Konva.Circle({
      radius: MUSEUM_RADIUS,
      fill: MUSEUM_FILL_COLOR,
      stroke: MUSEUM_STROKE_COLOR,
      strokeWidth: 2,
    });
    this.group.add(this.circle);

    this.label = new Konva.Text({
      x: -MUSEUM_LABEL_WIDTH / 2,
      y: MUSEUM_LABEL_OFFSET_Y,
      width: MUSEUM_LABEL_WIDTH,
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

    this.circle.fill(MUSEUM_MATCH_FILL_COLOR);
    this.circle.stroke(MUSEUM_MATCH_STROKE_COLOR);
  }

  setPosition(position: { x: number; y: number }): void {
    this.group.position({
      x: position.x,
      y: position.y,
    });
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
            err
          );
        }
      }
    );
  }
}
