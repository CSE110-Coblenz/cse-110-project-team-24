import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * PostcardScreenView - Renders the postcard UI using Konva
 */
export class PostcardScreenView implements View {
  private group: Konva.Group;


  constructor() {
    this.group = new Konva.Group({ visible: false });

    // Background
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#87CEEB", // Sky blue
    });
    this.group.add(bg);


    Konva.Image.fromURL("/public/Postcards/BostonPostcard.jpg", (img) => {
      img.width(200);
      img.height(100);
      img.x(300);
      img.y(400);
      this.group.add(img);
    });

    Konva.Image.fromURL("/public/Postcards/BostonPostcard.jpg", (img) => {
      img.width(200);
      img.height(100);
      img.x(500);
      img.y(100);
      this.group.add(img);
    });

    Konva.Image.fromURL("/public/Postcards/BostonPostcard.jpg", (img2) => {
      img2.width(200);
      img2.height(100);
      img2.x(15);
      img2.y(200);
      this.group.add(img2);
    });


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
