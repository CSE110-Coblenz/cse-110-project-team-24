import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { View } from "../../types.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import type { Museum, MuseumFact } from "./Museum.ts";
import { FactCard } from "./FactCard.ts";
import { InfoPanel } from "./InfoPanel.ts";
import { MuseumCollection } from "./MuseumCollection.ts";
import { NextButton } from "./NextButton.ts";
import {
  BACKGROUND_COLOR,
  BACKGROUND_GRADIENT_COLORS,
  CENTER_GLOW_COLOR,
  FACT_CARD_HEIGHT,
  FACT_CARD_WIDTH,
  INFO_PANEL_VERTICAL_MARGIN,
  NEXT_ARROW_OFFSET,
  NEXT_ARROW_RADIUS,
  ORBIT_DASH_PATTERN,
  ORBIT_RADIUS_OFFSET,
  ORBIT_STROKE_COLOR,
  TITLE_COLOR,
  TITLE_FONT_SIZE,
  TITLE_SUBTEXT_COLOR,
  TITLE_SUBTEXT_FONT_SIZE,
} from "./constants.ts";

type FactDropHandler = (museumId: string) => void;
type NextHandler = () => void;

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
  private readonly onNext: NextHandler;
  private readonly nextButton: NextButton;
  private readonly resizeHandler: () => void;
  private readonly orbitCircle: Konva.Circle;
  private readonly centerGlow: Konva.Circle;
  private readonly retryOverlayGroup: Konva.Group;
  private readonly retryMessage: Konva.Text;
  private readonly retryButtonGroup: Konva.Group;
  private readonly exitButtonGroup: Konva.Group;
  private readonly homeButtonGroup: Konva.Group;

  constructor(onFactDrop: FactDropHandler, onNext: NextHandler) {
    this.onFactDrop = onFactDrop;
    this.onNext = onNext;
    this.group = new Konva.Group({ visible: false });

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: BACKGROUND_COLOR,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: STAGE_HEIGHT },
      fillLinearGradientColorStops: [
        0,
        BACKGROUND_GRADIENT_COLORS[0],
        1,
        BACKGROUND_GRADIENT_COLORS[1],
      ],
    });
    this.group.add(background);

    const title = new Konva.Text({
      x: 0,
      y: 30,
      width: STAGE_WIDTH,
      align: "center",
      text: "Match the fact to the museum",
      fontSize: TITLE_FONT_SIZE,
      fontFamily: "Clash Display, 'Trebuchet MS', Arial, sans-serif",
      fill: TITLE_COLOR,
    });
    this.group.add(title);

    const subtitle = new Konva.Text({
      x: 0,
      y: 70,
      width: STAGE_WIDTH,
      align: "center",
      text: "Explore the icons that define Chicago’s culture",
      fontSize: TITLE_SUBTEXT_FONT_SIZE,
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      fill: TITLE_SUBTEXT_COLOR,
      opacity: 0.85,
    });
    this.group.add(subtitle);

    this.centerGlow = new Konva.Circle({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2,
      radius: 180,
      fill: CENTER_GLOW_COLOR,
      opacity: 0.8,
      listening: false,
    });
    this.group.add(this.centerGlow);

    this.museumLayer = new Konva.Group();
    this.group.add(this.museumLayer);

    this.orbitCircle = new Konva.Circle({
      stroke: ORBIT_STROKE_COLOR,
      strokeWidth: 2,
      dash: ORBIT_DASH_PATTERN,
      opacity: 0.6,
      listening: false,
    });
    this.museumLayer.add(this.orbitCircle);

    this.factCard = new FactCard((event) => this.handleCardDrop(event));
    this.group.add(this.factCard.getGroup());

    this.museumCollection = new MuseumCollection(this.museumLayer);

    this.infoPanel = new InfoPanel(
      STAGE_WIDTH * 0.8,
      STAGE_WIDTH / 2,
      STAGE_HEIGHT / 2 + FACT_CARD_HEIGHT / 2 + INFO_PANEL_VERTICAL_MARGIN
    );
    this.group.add(this.infoPanel.getNode());

    this.nextButton = new NextButton(() => this.onNext());
    this.group.add(this.nextButton.getGroup());

    // Retry overlay (hidden by default)
    this.retryOverlayGroup = new Konva.Group({ visible: false });
    const overlayBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "rgba(0, 0, 0, 0.55)",
    });
    this.retryOverlayGroup.add(overlayBg);

    const panel = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 220,
      y: STAGE_HEIGHT / 2 - 140,
      width: 440,
      height: 280,
      fill: "#ffffff",
      cornerRadius: 16,
      stroke: "#1f2937",
      strokeWidth: 3,
    });
    this.retryOverlayGroup.add(panel);

    this.retryMessage = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 90,
      text: "",
      fontSize: 26,
      fontFamily: "Arial",
      fill: "#111827",
      width: 400,
      align: "center",
    });
    this.retryMessage.offsetX(this.retryMessage.width() / 2);
    this.retryOverlayGroup.add(this.retryMessage);

    this.retryButtonGroup = new Konva.Group({
      x: STAGE_WIDTH / 2 - 180,
      y: STAGE_HEIGHT / 2 + 30,
    });
    const retryRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 160,
      height: 50,
      fill: "#16a34a",
      cornerRadius: 10,
      stroke: "#15803d",
      strokeWidth: 2,
    });
    const retryText = new Konva.Text({
      x: 80,
      y: 15,
      text: "Try Again",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#ffffff",
      align: "center",
      width: 160,
    });
    retryText.offsetX(retryText.width() / 2);
    this.retryButtonGroup.add(retryRect);
    this.retryButtonGroup.add(retryText);
    this.retryButtonGroup.listening(true);

    this.exitButtonGroup = new Konva.Group({
      x: STAGE_WIDTH / 2 + 20,
      y: STAGE_HEIGHT / 2 + 30,
    });
    const exitRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 160,
      height: 50,
      fill: "#2563eb",
      cornerRadius: 10,
      stroke: "#1d4ed8",
      strokeWidth: 2,
    });
    const exitText = new Konva.Text({
      x: 80,
      y: 15,
      text: "Exit",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#ffffff",
      align: "center",
      width: 160,
    });
    exitText.offsetX(exitText.width() / 2);
    this.exitButtonGroup.add(exitRect);
    this.exitButtonGroup.add(exitText);
    this.exitButtonGroup.listening(true);

    // Home button for win popup (centered)
    this.homeButtonGroup = new Konva.Group({
      x: STAGE_WIDTH / 2 - 80,
      y: STAGE_HEIGHT / 2 + 30,
    });
    const homeRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: 160,
      height: 50,
      fill: "#16a34a",
      cornerRadius: 10,
      stroke: "#15803d",
      strokeWidth: 2,
    });
    const homeText = new Konva.Text({
      x: 80,
      y: 15,
      text: "Home",
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#ffffff",
      align: "center",
      width: 160,
    });
    homeText.offsetX(homeText.width() / 2);
    this.homeButtonGroup.add(homeRect);
    this.homeButtonGroup.add(homeText);
    this.homeButtonGroup.listening(true);
    this.homeButtonGroup.visible(false); // Hidden by default

    this.retryOverlayGroup.add(this.retryButtonGroup);
    this.retryOverlayGroup.add(this.exitButtonGroup);
    this.retryOverlayGroup.add(this.homeButtonGroup);
    this.group.add(this.retryOverlayGroup);

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
  setFact(
    fact: MuseumFact | null,
    options: { draggable?: boolean } = { draggable: true }
  ): void {
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
    this.factCard.setDraggable(options.draggable ?? true);
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
   * Reset all museums to their unmatched visual state
   */
  resetAllMuseums(): void {
    this.museumCollection.resetAll();
    this.group.getLayer()?.draw();
  }

  lockFactCard(): void {
    this.factCard.setDraggable(false);
  }

  unlockFactCard(): void {
    this.factCard.setDraggable(true);
  }

  showNextButton(label: string): void {
    this.nextButton.show(label);
    this.group.getLayer()?.draw();
  }

  hideNextButton(): void {
    this.nextButton.hide();
    this.group.getLayer()?.draw();
  }

  isNextButtonVisible(): boolean {
    return this.nextButton.isVisible();
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
   * Show retry overlay with callbacks
   */
  showRetryOverlay(
    score: number,
    total: number,
    onRetry: () => void,
    onExit: () => void
  ): void {
    this.retryMessage.text(
      `You scored ${score} out of ${total}.\nKeep trying to nail every fact!`
    );
    this.retryMessage.offsetX(this.retryMessage.width() / 2);

    // Show retry and exit buttons, hide home button
    this.retryButtonGroup.visible(true);
    this.exitButtonGroup.visible(true);
    this.homeButtonGroup.visible(false);

    this.retryButtonGroup.off("click");
    this.exitButtonGroup.off("click");
    this.retryButtonGroup.on("click", onRetry);
    this.exitButtonGroup.on("click", onExit);

    this.retryOverlayGroup.visible(true);
    this.group.getLayer()?.draw();
  }

  hideRetryOverlay(): void {
    this.retryOverlayGroup.visible(false);
    this.retryButtonGroup.off("click");
    this.exitButtonGroup.off("click");
    this.homeButtonGroup.off("click");
    this.group.getLayer()?.draw();
  }

  /**
   * Show win overlay with callbacks
   */
  showWinOverlay(score: number, total: number, onHome: () => void): void {
    this.retryMessage.text(`${score}/${total} You win!`);
    this.retryMessage.offsetX(this.retryMessage.width() / 2);

    // Hide retry and exit buttons, show home button
    this.retryButtonGroup.visible(false);
    this.exitButtonGroup.visible(false);
    this.homeButtonGroup.visible(true);

    this.homeButtonGroup.off("click");
    this.homeButtonGroup.on("click", onHome);

    this.retryOverlayGroup.visible(true);
    this.group.getLayer()?.draw();
  }

  /**
   * Provide the view group to the scene
   */
  getGroup(): Konva.Group {
    return this.group;
  }

  private handleCardDrop(event: KonvaEventObject<DragEvent>): void {
    const stage = event.target.getStage() ?? this.group.getStage();
    const pointerPosition = stage?.getPointerPosition();
    const cardCenter = this.factCard.getCenter();
    const center = this.getCenter();

    if (this.nextButton.isVisible()) {
      this.factCard.resetPosition(center);
      this.group.getLayer()?.draw();
      return;
    }

    let hitMuseumId: string | null = null;
    if (pointerPosition) {
      hitMuseumId = this.museumCollection.hitTest(pointerPosition);
    }

    if (!hitMuseumId) {
      const halfDiagonal = Math.sqrt(
        (this.factCard.getWidth() / 2) ** 2 +
          (this.factCard.getHeight() / 2) ** 2
      );
      hitMuseumId = this.museumCollection.hitTest(cardCenter, halfDiagonal);
    }

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

    this.centerGlow.position(center);
    this.centerGlow.radius(Math.max(FACT_CARD_WIDTH, FACT_CARD_HEIGHT) * 1.1);

    this.museumCollection.layout({ center, radius });
    this.orbitCircle.position(center);
    this.orbitCircle.radius(Math.max(0, radius + ORBIT_RADIUS_OFFSET));

    if (!this.factCard.getGroup().isDragging()) {
      this.factCard.resetPosition(center);
    }

    const infoY = center.y + FACT_CARD_HEIGHT / 2 + INFO_PANEL_VERTICAL_MARGIN;
    this.infoPanel.updateLayout(infoWidth, center.x, infoY);

    const nextX =
      center.x + FACT_CARD_WIDTH / 2 + NEXT_ARROW_OFFSET + NEXT_ARROW_RADIUS;
    this.nextButton.setPosition({ x: nextX, y: center.y });
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
