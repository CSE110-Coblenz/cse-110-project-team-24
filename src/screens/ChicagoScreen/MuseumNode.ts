import Konva from "konva";
import type { Museum } from "./Museum.ts";
import {
  MUSEUM_FILL_COLOR,
  MUSEUM_HIT_RADIUS,
  MUSEUM_IMAGE_SHADOW_BLUR,
  MUSEUM_IMAGE_SHADOW_COLOR,
  MUSEUM_LABEL_BACKGROUND,
  MUSEUM_LABEL_FONT_FAMILY,
  MUSEUM_LABEL_FONT_SIZE,
  MUSEUM_LABEL_TEXT_COLOR,
  MUSEUM_LABEL_VERTICAL_GAP,
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
  private readonly label: Konva.Label;
  private readonly labelTag: Konva.Tag;
  private readonly labelText: Konva.Text;
  private readonly imageMask: Konva.Group;
  private readonly hitRadius: number;
  private center: { x: number; y: number };

  constructor(museum: Museum, position: { x: number; y: number }) {
    this.museum = museum;
    this.hitRadius = MUSEUM_HIT_RADIUS;
    this.center = { ...position };

    this.group = new Konva.Group();

    this.circle = new Konva.Circle({
      x: MUSEUM_RADIUS,
      y: MUSEUM_RADIUS,
      radius: MUSEUM_RADIUS,
      fill: MUSEUM_FILL_COLOR,
      stroke: MUSEUM_STROKE_COLOR,
      strokeWidth: 2,
      shadowColor: MUSEUM_IMAGE_SHADOW_COLOR,
      shadowBlur: MUSEUM_IMAGE_SHADOW_BLUR,
      shadowOpacity: 0.35,
      shadowOffsetY: 4,
      listening: false,
    });
    this.group.add(this.circle);

    this.imageMask = new Konva.Group({
      x: MUSEUM_RADIUS,
      y: MUSEUM_RADIUS,
      clipFunc: (ctx) => {
        ctx.beginPath();
        ctx.arc(0, 0, MUSEUM_RADIUS - 6, 0, Math.PI * 2);
      },
    });
    this.group.add(this.imageMask);

    this.label = new Konva.Label({
      x: MUSEUM_RADIUS - MUSEUM_LABEL_WIDTH / 2,
      y: MUSEUM_RADIUS * 2 + MUSEUM_LABEL_VERTICAL_GAP,
    });
    this.labelTag = new Konva.Tag({
      fill: MUSEUM_LABEL_BACKGROUND,
      cornerRadius: 12,
      shadowColor: "rgba(22, 37, 66, 0.18)",
      shadowBlur: 12,
      shadowOpacity: 0.6,
      shadowOffsetY: 4,
    });
    this.labelText = new Konva.Text({
      width: MUSEUM_LABEL_WIDTH,
      align: "center",
      text: museum.name,
      fontSize: MUSEUM_LABEL_FONT_SIZE,
      fontFamily: MUSEUM_LABEL_FONT_FAMILY,
      fill: MUSEUM_LABEL_TEXT_COLOR,
      padding: 10,
    });
    this.label.add(this.labelTag);
    this.label.add(this.labelText);
    this.group.add(this.label);

    this.setPosition(position);
    this.loadImage();
  }

  getId(): string {
    return this.museum.id;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  isHit(point: { x: number; y: number }, extraRadius = 0): boolean {
    const pos = this.getCenter();
    const dx = point.x - pos.x;
    const dy = point.y - pos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.hitRadius + extraRadius;
  }

  markMatched(): void {
    this.group.to({
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 0.2,
    });

    this.circle.fill(MUSEUM_MATCH_FILL_COLOR);
    this.circle.stroke(MUSEUM_MATCH_STROKE_COLOR);
    this.labelTag.fill("#eff8ef");
    this.labelText.fill(MUSEUM_MATCH_STROKE_COLOR);
  }

  setPosition(position: { x: number; y: number }): void {
    this.center = { ...position };
    this.group.position({
      x: position.x - MUSEUM_RADIUS,
      y: position.y - MUSEUM_RADIUS,
    });
  }

  getCenter(): { x: number; y: number } {
    return this.center;
  }

  getHitRadius(): number {
    return this.hitRadius;
  }

  private loadImage(): void {
    Konva.Image.fromURL(
      this.museum.imageUrl,
      (image) => {
        image.width(MUSEUM_RADIUS * 2);
        image.height(MUSEUM_RADIUS * 2);
        image.offsetX(MUSEUM_RADIUS);
        image.offsetY(MUSEUM_RADIUS);
        image.listening(false);
        this.imageMask.add(image);
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
