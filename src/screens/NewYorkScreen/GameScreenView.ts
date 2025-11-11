import Konva from "konva";
import type { View } from "../../types.ts";
import { Road } from "./Road.ts";
import { Taxi } from "./Taxi.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { getFactPairByIndex, NEW_YORK_FACT_PAIRS } from "./NewYorkFacts.ts";
import {
  createLeftToRightAnimation,
  createRightToLeftAnimation,
  type TaxiAnimation,
} from "./AnimateTaxi.ts";
import { TAXI_SPEED, TAXI_WIDTH, TAXI_HEIGHT } from "./constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class GameScreenView implements View {
  private group: Konva.Group;
  private taxi1: Konva.Group;
  private taxi2: Konva.Group;
  private taxi1Animation!: TaxiAnimation; // Initialized in startAnimations()
  private taxi2Animation!: TaxiAnimation; // Initialized in startAnimations()
  private currentFactIndex: number = 0;
  private taxi1Text!: Konva.Text;
  private taxi2Text!: Konva.Text;
  private scoreText!: Konva.Text;
  private isFact1OnTaxi1Flag: boolean = true; // Randomized assignment per round
  private roundsSeenSinceReset: number = 0;
  private retryOverlayGroup: Konva.Group;
  private retryMessage: Konva.Text;
  private retryButtonGroup: Konva.Group;
  private exitButtonGroup: Konva.Group;

  private onCycleComplete?: () => void;

  constructor(
    onTaxi1Click: () => void,
    onTaxi2Click: () => void,
    onCycleComplete?: () => void
  ) {
    this.group = new Konva.Group({ visible: false });
    this.onCycleComplete = onCycleComplete;

    // Create roads with lane dividers
    // Note: roadHeight parameter is ignored, calculated internally from percentages
    const { road1CenterY, road2CenterY } = Road.createRoads(0, this.group);

    // Create taxis with fact pairs

    // Get fact pair in order (starting with index 0)
    const factPair = getFactPairByIndex(this.currentFactIndex);
    // Randomize which taxi shows fact1/fact2 for this round
    this.isFact1OnTaxi1Flag = Math.random() < 0.5;

    // Taxi 1 on bottom road (displays fact1, moves left to right)
    this.taxi1 = Taxi.createTaxi(
      -TAXI_WIDTH, // Start off-screen left
      road1CenterY - 50,
      this.isFact1OnTaxi1Flag ? factPair.fact1 : factPair.fact2,
      TAXI_WIDTH,
      TAXI_HEIGHT
    );
    this.group.add(this.taxi1);
    // Store reference to taxi1 text for updates (text bubble group is at index 1, text is at index 1 within that group)
    const taxi1TextBubbleGroup = this.taxi1.children[1] as Konva.Group;
    this.taxi1Text = taxi1TextBubbleGroup.children[1] as Konva.Text;
    // Make taxi1 clickable
    this.taxi1.on("click", onTaxi1Click);
    this.taxi1.listening(true);

    // Taxi 2 on top road (displays fact2, moves right to left)
    // flipHorizontal = true to reverse the image direction
    this.taxi2 = Taxi.createTaxi(
      STAGE_WIDTH, // Start off-screen right
      road2CenterY - 50,
      this.isFact1OnTaxi1Flag ? factPair.fact2 : factPair.fact1,
      TAXI_WIDTH,
      TAXI_HEIGHT,
      true // Flip horizontally
    );
    this.group.add(this.taxi2);
    // Store reference to taxi2 text for updates (text bubble group is at index 1, text is at index 1 within that group)
    const taxi2TextBubbleGroup = this.taxi2.children[1] as Konva.Group;
    this.taxi2Text = taxi2TextBubbleGroup.children[1] as Konva.Text;
    // Make taxi2 clickable
    this.taxi2.on("click", onTaxi2Click);
    this.taxi2.listening(true);

    // Score display
    this.scoreText = new Konva.Text({
      x: 20,
      y: 20,
      text: "Score: 0",
      fontSize: 32,
      fontFamily: "Arial",
      fill: "black",
    });
    this.group.add(this.scoreText);

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

    this.retryOverlayGroup.add(this.retryButtonGroup);
    this.retryOverlayGroup.add(this.exitButtonGroup);
    this.group.add(this.retryOverlayGroup);
  }

  /**
   * Update taxis with the next fact pair
   */
  private updateToNextFact(): void {
    // Increment index and wrap around if needed
    this.currentFactIndex =
      (this.currentFactIndex + 1) % NEW_YORK_FACT_PAIRS.length;
    const factPair = getFactPairByIndex(this.currentFactIndex);

    // Randomize assignment each round
    this.isFact1OnTaxi1Flag = Math.random() < 0.5;

    // Update taxi texts with new facts based on assignment
    this.taxi1Text.text(
      this.isFact1OnTaxi1Flag ? factPair.fact1 : factPair.fact2
    );
    this.taxi2Text.text(
      this.isFact1OnTaxi1Flag ? factPair.fact2 : factPair.fact1
    );

    this.roundsSeenSinceReset =
      (this.roundsSeenSinceReset + 1) % NEW_YORK_FACT_PAIRS.length;
    if (this.currentFactIndex === 0 && this.roundsSeenSinceReset === 0) {
      this.onCycleComplete?.();
    }
  }

  /**
   * Initialize animations (called when layer is available)
   */
  private initializeAnimations(): void {
    const layer = this.group.getLayer();
    if (!layer || this.taxi1Animation || this.taxi2Animation) {
      return; // Already initialized or layer not available
    }

    // Animation for taxi1: moves left to right
    // Update facts when taxi1 resets (goes off-screen right)
    this.taxi1Animation = createLeftToRightAnimation(
      this.taxi1,
      layer,
      TAXI_WIDTH,
      TAXI_SPEED,
      () => this.updateToNextFact()
    );

    // Animation for taxi2: moves right to left
    // Also update facts when taxi2 resets (goes off-screen left)
    this.taxi2Animation = createRightToLeftAnimation(
      this.taxi2,
      layer,
      TAXI_WIDTH,
      TAXI_SPEED
    );
  }

  /**
   * Show the screen
   */
  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
    // Initialize animations if not already done (layer now available)
    this.initializeAnimations();
    // Start animations when screen is shown
    this.taxi1Animation?.start();
    this.taxi2Animation?.start();
  }

  /**
   * Hide the screen
   */
  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
    // Stop animations when screen is hidden
    this.taxi1Animation?.stop();
    this.taxi2Animation?.stop();
  }

  /**
   * Stop taxi animations
   */
  stopAnimations(): void {
    this.taxi1Animation?.stop();
    this.taxi2Animation?.stop();
  }

  /**
   * Reset facts and taxi positions for a fresh game
   */
  resetGameState(): void {
    this.currentFactIndex = 0;
    const factPair = getFactPairByIndex(this.currentFactIndex);
    this.isFact1OnTaxi1Flag = Math.random() < 0.5;
    this.taxi1Text.text(
      this.isFact1OnTaxi1Flag ? factPair.fact1 : factPair.fact2
    );
    this.taxi2Text.text(
      this.isFact1OnTaxi1Flag ? factPair.fact2 : factPair.fact1
    );
    // Reset taxi positions to start off-screen like initial load
    this.taxi1.x(-TAXI_WIDTH);
    this.taxi2.x(STAGE_WIDTH);
    this.roundsSeenSinceReset = 0;
    this.group.getLayer()?.draw();
  }

  /**
   * Update score display
   */
  updateScore(score: number): void {
    this.scoreText.text(`Score: ${score}`);
    this.group.getLayer()?.draw();
  }

  /**
   * Get current fact index (for checking which taxi is correct)
   */
  getCurrentFactIndex(): number {
    return this.currentFactIndex;
  }

  /**
   * Expose current assignment: true if taxi1 displays fact1, false if taxi1 displays fact2
   */
  isFact1OnTaxi1(): boolean {
    return this.isFact1OnTaxi1Flag;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  /**
   * Toggle taxi clickability
   */
  setTaxiInteractivity(enabled: boolean): void {
    this.taxi1.listening(enabled);
    this.taxi2.listening(enabled);
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
    this.group.getLayer()?.draw();
  }
}
