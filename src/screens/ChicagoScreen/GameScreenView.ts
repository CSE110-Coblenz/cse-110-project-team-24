import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
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
  private readonly group: Konva.Group;
  private readonly museumNodes: Map<string, MuseumNode> = new Map();
  private museums: Museum[] = [];
  private readonly factCard: FactCard;
  private readonly infoPanel: InfoPanel;
  private readonly onFactDrop: FactDropHandler;
  private readonly resizeHandler: () => void;

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
    this.group.add(this.factCard.getGroup());

    this.infoPanel = new InfoPanel(
      STAGE_WIDTH * 0.8,
      STAGE_WIDTH / 2,
      STAGE_HEIGHT / 2 + FACT_CARD_HEIGHT / 2 + INFO_PANEL_VERTICAL_MARGIN
    );
    this.group.add(this.infoPanel.getNode());

    this.resizeHandler = () => this.updateLayout();
    window.addEventListener("resize", this.resizeHandler);

    this.updateLayout();
  }

  /**
   * Set which museums to render around the circle
   */
  setMuseums(museums: Museum[]): void {
    this.museums = [...museums];
    this.syncMuseumNodes();
    this.updateLayout();
    this.group.getLayer()?.draw();
  }

  /**
   * Update the fact shown in the center card
   */
  setFact(fact: MuseumFact | null): void {
    const center = this.getCenter();

    if (!fact) {
      this.factCard.setText("All facts matched! Nice work.");
      this.factCard.resetPosition(center);
      this.factCard.setDraggable(false);
      this.updateLayout();
      this.group.getLayer()?.draw();
      return;
    }

    this.factCard.resetPosition(center);
    this.factCard.setDraggable(true);
    this.factCard.setText(fact.fact);
    this.updateLayout();
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
    this.updateLayout();
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
    const center = this.getCenter();

    for (const [museumId, node] of this.museumNodes.entries()) {
      if (node.isHit(cardCenter)) {
        this.onFactDrop(museumId);
        this.factCard.resetPosition(center);
        this.group.getLayer()?.draw();
        return;
      }
    }

    // No museum hit: gently return card to center
    this.factCard.getGroup().to({
      x: center.x - this.factCard.getWidth() / 2,
      y: center.y - this.factCard.getHeight() / 2,
      duration: 0.15,
      easing: Konva.Easings.EaseOut,
      onFinish: () => this.group.getLayer()?.draw(),
    });
  }

  private syncMuseumNodes(): void {
    const desiredIds = new Set(this.museums.map((museum) => museum.id));

    for (const [id, node] of this.museumNodes.entries()) {
      if (!desiredIds.has(id)) {
        node.getGroup().destroy();
        this.museumNodes.delete(id);
      }
    }

    for (const museum of this.museums) {
      if (!this.museumNodes.has(museum.id)) {
        const node = new MuseumNode(museum, this.getCenter());
        this.group.add(node.getGroup());
        this.museumNodes.set(museum.id, node);
      }
    }
  }

  private layoutMuseums(): void {
    if (this.museums.length === 0) return;

    const center = this.getCenter();
    const { width, height } = this.getStageSize();
    const radius = Math.min(width, height) * 0.32;

    this.museums.forEach((museum, index) => {
      const angle = (index / this.museums.length) * Math.PI * 2 - Math.PI / 2;
      const position = {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      };
      const node = this.museumNodes.get(museum.id);
      node?.setPosition(position);
    });
  }

  private updateLayout(): void {
    const center = this.getCenter();
    const { width } = this.getStageSize();
    const infoWidth = width * 0.8;

    this.layoutMuseums();

    if (!this.factCard.getGroup().isDragging()) {
      this.factCard.resetPosition(center);
    }

    this.infoPanel.updateLayout(
      infoWidth,
      center.x,
      center.y + FACT_CARD_HEIGHT / 2 + INFO_PANEL_VERTICAL_MARGIN
    );
  }

  private getCenter(): { x: number; y: number } {
    const { width, height } = this.getStageSize();
    return {
      x: width / 2,
      y: height / 2,
    };
  }

  private getStageSize(): { width: number; height: number } {
    const stage = this.group.getStage();
    if (stage) {
      return {
        width: stage.width(),
        height: stage.height(),
      };
    }
    return { width: STAGE_WIDTH, height: STAGE_HEIGHT };
  }
}
