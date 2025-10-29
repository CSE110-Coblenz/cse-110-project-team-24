import Konva from "konva";
import type { View } from "../../types.ts";
import { Road } from "./Road.ts";
import { Taxi } from "./Taxi.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class GameScreenView implements View {
  private group: Konva.Group;

  constructor(onLemonClick: () => void) {
    // Note: onLemonClick parameter kept for compatibility with Controller
    this.group = new Konva.Group({ visible: false });

    // Create roads with lane dividers
    const roadHeight = 250;
    const { road1CenterY, road2CenterY } = Road.createRoads(
      roadHeight,
      this.group
    );

    // Create taxis
    const taxiTexts = ["Fact1", "Fact2", "Fact3", "Fact4", "Fact5"];

    // Taxi 1 on bottom road
    const taxi1 = Taxi.createTaxi(0, road1CenterY - 50, taxiTexts[1]);
    this.group.add(taxi1);

    // Taxi 2 on top road (example)
    const taxi2 = Taxi.createTaxi(
      STAGE_WIDTH - 100,
      road2CenterY - 50,
      taxiTexts[0]
    );
    this.group.add(taxi2);
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
