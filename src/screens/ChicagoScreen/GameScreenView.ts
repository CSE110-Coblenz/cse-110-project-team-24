import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { Museum, MuseumFact } from "./Museum.ts";
import { MuseumNode } from "./MuseumNode.ts";
import { FactCard } from "./FactCard.ts";
import { InfoPanel } from "./InfoPanel.ts";
import {
  BACKGROUND_COLOR,
  FACT_CARD_HEIGHT,
  INFO_PANEL_VERTICAL_MARGIN,
  TITLE_COLOR,
  TITLE_FONT_SIZE,
} from "./constants.ts";

type FactDropHandler = (museumId: string) => void;

/**
 * GameScreenView - Renders the museum matching UI using Konva
 */
export class GameScreenView implements View {
  private group: Konva.Group;
  private museumNodes: Map<string, MuseumNode> = new Map();
  private factCard: FactCard;
  private infoPanel: InfoPanel;
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
      fill: BACKGROUND_COLOR,
    });
    this.group.add(background);

    const title = new Konva.Text({
      x: 0,
      y: 30,
      width: STAGE_WIDTH,
      align: "center",
      text: "Match the fact to the museum",
      fontSize: TITLE_FONT_SIZE,
      fontFamily: "Arial",
      fill: TITLE_COLOR,
    });
    this.group.add(title);

    this.factCard = new FactCard(() => this.handleCardDrop());
    this.factCard.resetPosition(this.center);
    this.group.add(this.factCard.getGroup());

    this.infoPanel = new InfoPanel(
      STAGE_WIDTH * 0.8,
      this.center.x,
      this.center.y + FACT_CARD_HEIGHT / 2 + INFO_PANEL_VERTICAL_MARGIN
    );
    this.group.add(this.infoPanel.getNode());
  }

  /**
   * Set which museums to render around the circle
   */
  setMuseums(museums: Museum[]): void {
    // Clear previous nodes
    for (const node of this.museumNodes.values()) {
      node.getGroup().destroy();
    }
    this.museumNodes.clear();

    museums.forEach((museum, index) => {
      const angle = (index / museums.length) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(STAGE_WIDTH, STAGE_HEIGHT) * 0.32;
      const x = this.center.x + radius * Math.cos(angle);
      const y = this.center.y + radius * Math.sin(angle);

      const node = new MuseumNode(museum, { x, y });

      this.group.add(node.getGroup());
      this.museumNodes.set(museum.id, node);
    });

    this.group.getLayer()?.draw();
  }

  /**
   * Update the fact shown in the center card
   */
  setFact(fact: MuseumFact | null): void {
    if (!fact) {
      this.factCard.setText("All facts matched! Nice work.");
      this.factCard.resetPosition(this.center);
      this.factCard.setDraggable(false);
      this.group.getLayer()?.draw();
      return;
    }

    this.factCard.resetPosition(this.center);
    this.factCard.setDraggable(true);
    this.factCard.setText(fact.fact);
    this.group.getLayer()?.draw();
  }

  /**
   * Visually mark the museum as matched
   */
  markMuseumMatched(museumId: string): void {
    const node = this.museumNodes.get(museumId);
    if (!node) return;

    node.markMatched();
    this.group.getLayer()?.draw();
  }

  /**
   * Display detail text after a match
   */
  showDetail(detail: string): void {
    this.infoPanel.showDetail(detail);
    this.group.getLayer()?.draw();
  }

  /**
   * Reset info prompt
   */
  showPrompt(): void {
    this.infoPanel.showPrompt();
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
    const cardCenter = this.factCard.getCenter();

    for (const [museumId, node] of this.museumNodes.entries()) {
      if (node.isHit(cardCenter)) {
        this.onFactDrop(museumId);
        this.factCard.resetPosition(this.center);
        this.group.getLayer()?.draw();
        return;
      }
    }

    // No museum hit: gently return card to center
    this.factCard.getGroup().to({
      x: this.center.x - this.factCard.getWidth() / 2,
      y: this.center.y - this.factCard.getHeight() / 2,
      duration: 0.15,
      easing: Konva.Easings.EaseOut,
      onFinish: () => this.group.getLayer()?.draw(),
    });
  }
}
