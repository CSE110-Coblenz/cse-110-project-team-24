import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { Museum, MuseumFact } from "./Museum.ts";

const FACT_CARD_WIDTH = 240;
const FACT_CARD_HEIGHT = 140;

type FactDropHandler = (museumId: string) => void;

interface MuseumNode {
  group: Konva.Group;
  hitRadius: number;
  label: Konva.Text;
  image?: Konva.Image;
}

/**
 * GameScreenView - Renders the museum matching UI using Konva
 */
export class GameScreenView implements View {
  private group: Konva.Group;
  private museumNodes: Map<string, MuseumNode> = new Map();
  private factCard: Konva.Group;
  private factText: Konva.Text;
  private infoText: Konva.Text;
  private onFactDrop: FactDropHandler;
  private readonly center = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

  constructor(onFactDrop: FactDropHandler) {
    this.onFactDrop = onFactDrop;
    this.group = new Konva.Group({ visible: false });

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#f5f7fa",
    });
    this.group.add(background);

    const title = new Konva.Text({
      x: 0,
      y: 30,
      width: STAGE_WIDTH,
      align: "center",
      text: "Match the fact to the museum",
      fontSize: 32,
      fontFamily: "Arial",
      fill: "#1a1a1a",
    });
    this.group.add(title);

    this.factCard = new Konva.Group({
      x: this.center.x - FACT_CARD_WIDTH / 2,
      y: this.center.y - FACT_CARD_HEIGHT / 2,
      draggable: true,
    });

    const cardBackground = new Konva.Rect({
      width: FACT_CARD_WIDTH,
      height: FACT_CARD_HEIGHT,
      cornerRadius: 16,
      fill: "#ffffff",
      stroke: "#1f4d7a",
      strokeWidth: 3,
      shadowColor: "#1f4d7a",
      shadowBlur: 10,
      shadowOpacity: 0.2,
    });

    this.factText = new Konva.Text({
      x: 12,
      y: 12,
      width: FACT_CARD_WIDTH - 24,
      align: "center",
      text: "",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#1a1a1a",
    });

    this.factCard.add(cardBackground);
    this.factCard.add(this.factText);
    this.group.add(this.factCard);

    this.factCard.on("dragend", () => this.handleCardDrop());

    this.infoText = new Konva.Text({
      x: STAGE_WIDTH * 0.1,
      y: STAGE_HEIGHT * 0.75,
      width: STAGE_WIDTH * 0.8,
      align: "center",
      text: "Drag the fact card onto the museum it belongs to.",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#2f3b52",
      lineHeight: 1.4,
    });
    this.group.add(this.infoText);
  }

  /**
   * Set which museums to render around the circle
   */
  setMuseums(museums: Museum[]): void {
    // Clear previous nodes
    for (const node of this.museumNodes.values()) {
      node.group.destroy();
    }
    this.museumNodes.clear();

    museums.forEach((museum, index) => {
      const angle = (index / museums.length) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(STAGE_WIDTH, STAGE_HEIGHT) * 0.32;
      const x = this.center.x + radius * Math.cos(angle);
      const y = this.center.y + radius * Math.sin(angle);

      const node = new Konva.Group({
        x,
        y,
        offsetX: 60,
        offsetY: 60,
      });

      const circle = new Konva.Circle({
        width: 120,
        height: 120,
        radius: 60,
        fill: "#e1ecf7",
        stroke: "#1f4d7a",
        strokeWidth: 2,
      });
      node.add(circle);

      const label = new Konva.Text({
        x: -60,
        y: 80,
        width: 120,
        align: "center",
        text: museum.name,
        fontSize: 16,
        fontFamily: "Arial",
        fill: "#1a1a1a",
      });
      node.add(label);

      this.group.add(node);

      Konva.Image.fromURL(
        museum.imageUrl,
        (image) => {
          image.width(100);
          image.height(100);
          image.x(-50);
          image.y(-50);
          node.add(image);
          this.group.getLayer()?.batchDraw();
        },
        (err) => {
          if (err) {
            // No image available, leave circle-only representation
            // eslint-disable-next-line no-console
            console.warn(`Image failed to load for museum ${museum.name}`, err);
          }
        }
      );

      this.museumNodes.set(museum.id, {
        group: node,
        hitRadius: 70,
        label,
      });
    });

    this.group.getLayer()?.draw();
  }

  /**
   * Update the fact shown in the center card
   */
  setFact(fact: MuseumFact | null): void {
    if (!fact) {
      this.factText.text("All facts matched! Nice work.");
      this.resetCardPosition();
      this.factCard.draggable(false);
      this.group.getLayer()?.draw();
      return;
    }

    this.resetCardPosition();
    this.factCard.draggable(true);
    this.factText.text(fact.fact);
    this.group.getLayer()?.draw();
  }

  /**
   * Visually mark the museum as matched
   */
  markMuseumMatched(museumId: string): void {
    const node = this.museumNodes.get(museumId);
    if (!node) return;

    node.group.to({
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 0.2,
    });

    node.group.getChildren().forEach((child) => {
      if (child instanceof Konva.Circle) {
        child.fill("#cbe5c8");
        child.stroke("#3a6b49");
      }
    });

    this.group.getLayer()?.draw();
  }

  /**
   * Display detail text after a match
   */
  showDetail(detail: string): void {
    this.infoText.text(detail);
    this.group.getLayer()?.draw();
  }

  /**
   * Reset info prompt
   */
  showPrompt(): void {
    this.infoText.text("Drag the fact card onto the museum it belongs to.");
    this.group.getLayer()?.draw();
  }

  /**
   * Show the screen
   */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  /**
   * Hide the screen
   */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  /**
   * Provide the view group to the scene
   */
  getGroup(): Konva.Group {
    return this.group;
  }

  private handleCardDrop(): void {
    const cardCenter = {
      x: this.factCard.x() + FACT_CARD_WIDTH / 2,
      y: this.factCard.y() + FACT_CARD_HEIGHT / 2,
    };

    for (const [museumId, node] of this.museumNodes.entries()) {
      const pos = node.group.position();
      const dx = cardCenter.x - pos.x;
      const dy = cardCenter.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= node.hitRadius) {
        this.onFactDrop(museumId);
        this.resetCardPosition();
        this.group.getLayer()?.draw();
        return;
      }
    }

    // No museum hit: gently return card to center
    this.factCard.to({
      x: this.center.x - FACT_CARD_WIDTH / 2,
      y: this.center.y - FACT_CARD_HEIGHT / 2,
      duration: 0.15,
      easing: Konva.Easings.EaseOut,
      onFinish: () => this.group.getLayer()?.draw(),
    });
  }

  private resetCardPosition(): void {
    this.factCard.position({
      x: this.center.x - FACT_CARD_WIDTH / 2,
      y: this.center.y - FACT_CARD_HEIGHT / 2,
    });
  }
}
