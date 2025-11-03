import Konva from "konva";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants.ts";
import { ROAD_WIDTH } from "./constants.ts";

/**
 * Road utilities for creating roads and lane dividers
 */
export class Road {
  /**
   * Create a road rectangle
   * @param x - X position
   * @param y - Y position
   * @param width - Road width
   * @param height - Road height
   * @returns A Konva.Rect representing the road
   */
  static createRoad(
    x: number,
    y: number,
    width: number,
    height: number
  ): Konva.Rect {
    return new Konva.Rect({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: "#333333", // Dark gray road
    });
  }

  /**
   * Create lane dividers for a road
   * @param roadCenterY - Y position of the road center
   * @param roadWidth - Width of the road
   * @param roadX - X position of the road
   * @param group - The Konva.Group to add the dividers to
   */
  static createLaneDividers(
    roadCenterY: number,
    roadWidth: number,
    roadX: number,
    group: Konva.Group
  ): void {
    for (let i = 0; i < roadWidth; i += 40) {
      const dash = new Konva.Rect({
        x: roadX + i,
        y: roadCenterY - 2,
        width: 30,
        height: 4,
        fill: "#FFD700", // Yellow
      });
      group.add(dash);
    }
  }

  /**
   * Create both roads (top and bottom) with lane dividers
   * @param roadHeight - Height of each road
   * @param group - The Konva.Group to add the roads to
   * @returns Object with road centers and positions
   */
  static createRoads(roadHeight: number, group: Konva.Group) {
    const roadStartY = STAGE_HEIGHT - roadHeight;
    // Position roads on the right side of the screen
    const roadX = STAGE_WIDTH - ROAD_WIDTH;

    // Bottom road
    const road1 = Road.createRoad(roadX, roadStartY, ROAD_WIDTH, roadHeight);
    group.add(road1);

    // Top road
    const road2 = Road.createRoad(roadX, 0, ROAD_WIDTH, roadHeight);
    group.add(road2);

    // Calculate road centers
    const road1CenterY = roadStartY + roadHeight / 2;
    const road2CenterY = roadHeight / 2;

    // Add lane dividers
    Road.createLaneDividers(road1CenterY, ROAD_WIDTH, roadX, group);
    Road.createLaneDividers(road2CenterY, ROAD_WIDTH, roadX, group);

    return {
      road1CenterY,
      road2CenterY,
      roadHeight,
      roadWidth: ROAD_WIDTH,
      roadX,
    };
  }
}
