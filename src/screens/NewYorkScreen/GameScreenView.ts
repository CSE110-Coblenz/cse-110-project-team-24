import Konva from "konva";
import type { View } from "../../types.ts";
import { Road } from "./Road.ts";
import { Taxi } from "./Taxi.ts";
import { STAGE_WIDTH } from "../../constants.ts";
import { getFactPairByIndex, NEW_YORK_FACT_PAIRS } from "./NewYorkFacts.ts";
import {
  createLeftToRightAnimation,
  createRightToLeftAnimation,
  type TaxiAnimation,
} from "./AnimateTaxi.ts";

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

  // Taxi speed in pixels per frame (increase this number to make taxis faster)
  private readonly taxiSpeed: number = 3;

  constructor(onTaxi1Click: () => void, onTaxi2Click: () => void) {
    this.group = new Konva.Group({ visible: false });

    // Create roads with lane dividers
    const roadHeight = 250;
    const { road1CenterY, road2CenterY } = Road.createRoads(
      roadHeight,
      this.group
    );

    // Create taxis with fact pairs
    const taxiWidth = 100;
    const taxiHeight = 100;

    // Get fact pair in order (starting with index 0)
    const factPair = getFactPairByIndex(this.currentFactIndex);

    // Taxi 1 on bottom road (displays fact1, moves left to right)
    this.taxi1 = Taxi.createTaxi(
      -taxiWidth, // Start off-screen left
      road1CenterY - 50,
      factPair.fact1,
      taxiWidth,
      taxiHeight
    );
    this.group.add(this.taxi1);
    // Store reference to taxi1 text for updates
    this.taxi1Text = this.taxi1.children[1] as Konva.Text;
    // Make taxi1 clickable
    this.taxi1.on("click", onTaxi1Click);
    this.taxi1.listening(true);

    // Taxi 2 on top road (displays fact2, moves right to left)
    this.taxi2 = Taxi.createTaxi(
      STAGE_WIDTH, // Start off-screen right
      road2CenterY - 50,
      factPair.fact2,
      taxiWidth,
      taxiHeight
    );
    this.group.add(this.taxi2);
    // Store reference to taxi2 text for updates
    this.taxi2Text = this.taxi2.children[1] as Konva.Text;
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

    // Store taxi width for animation initialization
    this.taxiWidth = taxiWidth;
  }

  private taxiWidth!: number;

  /**
   * Update taxis with the next fact pair
   */
  private updateToNextFact(): void {
    // Increment index and wrap around if needed
    this.currentFactIndex =
      (this.currentFactIndex + 1) % NEW_YORK_FACT_PAIRS.length;
    const factPair = getFactPairByIndex(this.currentFactIndex);

    // Update taxi texts with new facts
    this.taxi1Text.text(factPair.fact1);
    this.taxi2Text.text(factPair.fact2);
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
      this.taxiWidth,
      this.taxiSpeed,
      () => this.updateToNextFact()
    );

    // Animation for taxi2: moves right to left
    // Also update facts when taxi2 resets (goes off-screen left)
    this.taxi2Animation = createRightToLeftAnimation(
      this.taxi2,
      layer,
      this.taxiWidth,
      this.taxiSpeed,
      () => this.updateToNextFact()
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

  getGroup(): Konva.Group {
    return this.group;
  }
}
