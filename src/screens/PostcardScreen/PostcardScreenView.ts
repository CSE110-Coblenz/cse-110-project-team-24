import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * PostcardScreenView - Renders the postcard UI using Konva
 */
export class PostcardScreenView implements View {
  private group: Konva.Group;

  //Values for consistency
  private centerValueX: number = STAGE_WIDTH / 2;
  private centerValueY: number = STAGE_HEIGHT / 2;
  private PostcardWidth: number = STAGE_WIDTH / 6;
  private PostcardHeight: number = STAGE_HEIGHT / 6;



  constructor() {
    this.group = new Konva.Group({ visible: false });

    // Background
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#F5F5DC", // Beige color
    });
    this.group.add(bg);




  }

  addPostcard(imageSrc: string, xPos: number, yPos: number): void {
    const groupPostcard = new Konva.Group({ visible: false });
    let image1: Konva.Image | null = null;

    // Load the main postcard image
    Konva.Image.fromURL(imageSrc, (img) => {
      img.width(this.PostcardWidth);
      img.height(this.PostcardHeight);
      img.offsetX(img.width() / 2);
      img.offsetY(img.height() / 2);
      image1 = img;
      groupPostcard.add(img);

      // Load the tape images after the main image is loaded
      Konva.Image.fromURL("/public/Postcards/TapeImage.png", (tapeImg) => {
        tapeImg.width(image1 ? image1.width() / 2 : 0);
        tapeImg.height(image1 ? image1.height() / 2 : 0);
        groupPostcard.add(tapeImg);
      });

      Konva.Image.fromURL("/public/Postcards/TapeImage.png", (tapeImg) => {
        tapeImg.width(image1 ? image1.width() / 2 : 0);
        tapeImg.height(image1 ? image1.height() / 2 : 0);
        groupPostcard.add(tapeImg);
      });

      // Load the pin image after the main image is loaded
      Konva.Image.fromURL("/public/Postcards/PinImage.png", (pinImg) => {
        pinImg.width(image1 ? image1.width() / 2 : 0);
        pinImg.height(image1 ? image1.height() / 2 : 0);
        pinImg.offsetX(pinImg.width() / 2);
        pinImg.offsetY(pinImg.height() / 2);
        pinImg.x(-(image1 ? image1.width() / 2 : 0) + pinImg.width() / 2 + -30);
        pinImg.y(-(image1 ? image1.height() / 2 : 0) + pinImg.height() / 2 + -20);
        groupPostcard.add(pinImg);
      });

      // Position the group after all images are added
      groupPostcard.offsetX(groupPostcard.width() / 2);
      groupPostcard.offsetY(groupPostcard.height() / 2);
      groupPostcard.x(this.centerValueX + xPos);
      groupPostcard.y(this.centerValueY - yPos);

      // Add the group to the main group
      this.group.add(groupPostcard);

      // Make the group visible
      groupPostcard.visible(true);
    });
  }


  /**
   * Show the screen
   */
  show(): void {

    //Turns on all the postcard visibilities
    this.group.children?.forEach((child) => { child.visible(true); });

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
