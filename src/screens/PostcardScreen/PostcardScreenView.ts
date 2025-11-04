import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * PostcardScreenView - Renders the postcard UI using Konva
 */
export class PostcardScreenView implements View {
  private group: Konva.Group;
  private lineGroup: Konva.Group;

  //Values for consistency
  private centerValueX: number = STAGE_WIDTH / 2;
  private centerValueY: number = STAGE_HEIGHT / 2;
  private PostcardWidth: number = STAGE_WIDTH / 4.3;
  private PostcardHeight: number = STAGE_HEIGHT / 4.3;



  constructor() {
    this.group = new Konva.Group({ visible: false });
    this.lineGroup = new Konva.Group({ visible: false });

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

      // For hovering effect
      img.on('mouseover', () => {
        img.scale({ x: 1.1, y: 1.1 }); // Slightly enlarge the image
        img.getLayer()?.draw();
        });
  
        img.on('mouseout', () => {
        img.scale({ x: 1, y: 1 }); // Reset the image size
        img.getLayer()?.draw();
        });

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
        pinImg.width(image1 ? image1.width() / 3 : 0);
        pinImg.height(image1 ? image1.height() / 3 : 0);
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

  addLine(x1: number, y1: number, x2: number, y2: number): void {

    // dashed line
    const redLine = new Konva.Line({
      points: [this.centerValueX + x1 - 300,this.centerValueX - y1 + -1000, this.centerValueX + x2 - 300, this.centerValueX - y2 + -1000],
      stroke: 'red',
      strokeWidth: 15,
      lineJoin: 'round',
      dash: [33, 10]
    });
    
    this.lineGroup.add(redLine);
    
    
  }

  /**
   * Show the screen
   */
  show(): void {

    //Turns on all the postcard visibilities
    this.group.children?.forEach((child) => { child.visible(true); });
    this.group.visible(true);
    this.group.add(this.lineGroup);
    this.lineGroup.visible(true);
    this.lineGroup.moveToTop();
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
