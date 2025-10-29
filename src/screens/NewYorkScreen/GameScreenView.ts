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
    const roadHeight = 250; // Road height
    const roadWidth = STAGE_WIDTH;
    const roadStartY = STAGE_HEIGHT - roadHeight;
    const road1 = new Konva.Rect({
      x: 0,
      y: roadStartY,
      width: roadWidth,
      height: roadHeight,
      fill: "#333333", // Dark gray road
    });
    this.group.add(road1);

    const road2 = new Konva.Rect({
      x: 0,
      y: 0,
      width: roadWidth,
      height: roadHeight,
      fill: "#333333", // Dark gray road
    });
    this.group.add(road2);

    // Lane divider - dashed yellow line in the middle of each road
    const road1CenterY = roadStartY + roadHeight / 2; // Center of bottom road
    const road2CenterY = roadHeight / 2; // Center of top road (starts at y=0)
    // Create dashed line effect using small rectangles
    for (let i = 0; i < roadWidth; i += 40) {
      // Lane divider for road1 (bottom road)
      const dash1 = new Konva.Rect({
        x: i,
        y: road1CenterY - 2,
        width: 30,
        height: 4,
        fill: "#FFD700", // Yellow
      });
      this.group.add(dash1);

      // Lane divider for road2 (top road)
      const dash2 = new Konva.Rect({
        x: i,
        y: road2CenterY - 2,
        width: 30,
        height: 4,
        fill: "#FFD700", // Yellow
      });
      this.group.add(dash2);
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
