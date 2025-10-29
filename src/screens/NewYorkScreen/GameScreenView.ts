import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class GameScreenView implements View {
  private group: Konva.Group;

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
