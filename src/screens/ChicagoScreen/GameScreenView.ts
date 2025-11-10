import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import type { Museum, MuseumFact } from "./Museum.ts";
import { FactCard } from "./FactCard.ts";
import { InfoPanel } from "./InfoPanel.ts";
import { MuseumCollection } from "./MuseumCollection.ts";
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
  private readonly museumLayer: Konva.Group;
  private readonly museumCollection: MuseumCollection;
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

    this.museumLayer = new Konva.Group();
    this.group.add(this.museumLayer);

    this.factCard = new FactCard(() => this.handleCardDrop());
    this.group.add(this.factCard.getGroup());

    this.museumCollection = new MuseumCollection(this.museumLayer);

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
    this.museumCollection.setMuseums(museums);
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
    this.museumCollection.markMatched(museumId);
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

    const hitMuseumId = this.museumCollection.hitTest(cardCenter);
    if (hitMuseumId) {
      this.onFactDrop(hitMuseumId);
      this.factCard.resetPosition(center);
      this.group.getLayer()?.draw();
      return;
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

  private updateLayout(): void {
    const center = this.getCenter();
    const { width, height } = this.getStageSize();
    const infoWidth = width * 0.8;
    const radius = Math.min(width, height) * 0.32;

    this.museumCollection.layout({ center, radius });

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
