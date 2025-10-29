import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class GameScreenView implements View {
  private group: Konva.Group;
  private lemonImage: Konva.Image | Konva.Circle | null = null;
  private scoreText: Konva.Text;
  private timerText: Konva.Text;

  constructor(onLemonClick: () => void) {
    // Note: onLemonClick parameter kept for compatibility with Controller
    this.group = new Konva.Group({ visible: false });

    // Simple road at the bottom
    const roadHeight = 150; // Road height
    const roadStartY = STAGE_HEIGHT - roadHeight;
    const road = new Konva.Rect({
      x: 0,
      y: roadStartY,
      width: STAGE_WIDTH,
      height: roadHeight,
      fill: "#333333", // Dark gray road
    });
    this.group.add(road);

    // Lane divider - dashed yellow line in the middle
    const roadCenterY = roadStartY + roadHeight / 2;
    // Create dashed line effect using small rectangles
    for (let i = 0; i < STAGE_WIDTH; i += 40) {
      const dash = new Konva.Rect({
        x: i,
        y: roadCenterY - 2,
        width: 30,
        height: 4,
        fill: "#FFD700", // Yellow
      });
      this.group.add(dash);
    }

    // Score display (hidden for now - will add back for taxi game)
    this.scoreText = new Konva.Text({
      x: 20,
      y: 20,
      text: "Score: 0",
      fontSize: 32,
      fontFamily: "Arial",
      fill: "black",
      visible: false, // Hidden
    });
    this.group.add(this.scoreText);

    // Timer display (hidden for now - will add back for taxi game)
    this.timerText = new Konva.Text({
      x: STAGE_WIDTH - 150,
      y: 20,
      text: "Time: 60",
      fontSize: 32,
      fontFamily: "Arial",
      fill: "red",
      visible: false, // Hidden
    });
    this.group.add(this.timerText);
  }

  /**
   * Update score display
   */
  updateScore(score: number): void {
    this.scoreText.text(`Score: ${score}`);
    this.group.getLayer()?.draw();
  }

  /**
   * Randomize lemon position
   */
  randomizeLemonPosition(): void {
    if (!this.lemonImage) return;

    // Define safe boundaries (avoid edges)
    const padding = 100;
    const minX = padding;
    const maxX = STAGE_WIDTH - padding;
    const minY = padding;
    const maxY = STAGE_HEIGHT - padding;

    // Generate random position
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    // Update lemon position
    this.lemonImage.x(randomX);
    this.lemonImage.y(randomY);
    this.group.getLayer()?.draw();
  }

  /**
   * Update timer display
   */
  updateTimer(timeRemaining: number): void {
    this.timerText.text(`Time: ${timeRemaining}`);
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

  getGroup(): Konva.Group {
    return this.group;
  }
}
