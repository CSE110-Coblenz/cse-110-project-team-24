import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * PostcardScreenView - Renders the postcard UI using Konva
 */
export class PostcardScreenView implements View {
  private group: Konva.Group;
  private lineGroup: Konva.Group;
  private zoomedInGroup: Konva.Group | null = null;

  //Values for consistency
  private centerValueX: number = STAGE_WIDTH / 2;
  private centerValueY: number = STAGE_HEIGHT / 2;
  private PostcardWidth: number = STAGE_WIDTH / 4.9;
  private PostcardHeight: number = STAGE_HEIGHT / 4.9;



  constructor(returnToHome: () => void) {
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

    //Button to return home
    Konva.Image.fromURL("/public/Postcards/PinImage.png", (img) => {
      img.width(100);
      img.height(100);
      img.x(STAGE_WIDTH - img.width() - 20);
      img.y(20);
      img.on("click", () => {
        returnToHome();
      });
      img.on("mouseover", () => {
        img.scale({ x: 1.1, y: 1.1 }); // Slightly enlarge the image
        img.getLayer()?.draw();
        });
      img.on("mouseout", () => {
        img.scale({ x: 1, y: 1 }); // Reset the image size
        img.getLayer()?.draw();
        });
      this.group.add(img);
    });



  }

  addPostcard(imageSrc: string, xPos: number, yPos: number, postcardPressed: (postcardName: string) => void): void {
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
        console.log("Postcard hovered: " + imageSrc);
        });
  
      img.on('mouseout', () => {
        img.scale({ x: 1, y: 1 }); // Reset the image size
        img.getLayer()?.draw();
        });

      // On click, trigger the postcardPressed callback
      img.on('click', () => {
        postcardPressed(imageSrc);
        console.log("Postcard clicked: " + imageSrc);
      });

      // Load the tape images after the main image is loaded
      Konva.Image.fromURL("/public/Postcards/TapeImage.png", (tapeImg) => {
        tapeImg.width(image1 ? image1.width() / 3 : 0);
        tapeImg.height(image1 ? image1.height() / 3 : 0);
        tapeImg.offsetX(tapeImg.width() / 2);
        tapeImg.offsetY(tapeImg.height() / 2);
        tapeImg.x((image1 ? (image1.getPosition().x + image1.width() / 2.2) : 0));
        tapeImg.y((image1 ? (image1.getPosition().y - image1.height() / 2.2) : 0));
        groupPostcard.add(tapeImg);
      });

      Konva.Image.fromURL("/public/Postcards/TapeImage.png", (tapeImg) => {
        tapeImg.width(image1 ? image1.width() / 3 : 0);
        tapeImg.height(image1 ? image1.height() / 3 : 0);
        tapeImg.offsetX(tapeImg.width() / 2);
        tapeImg.offsetY(tapeImg.height() / 2);
        tapeImg.x((image1 ? (image1.getPosition().x - image1.width() / 2.2) : 0));
        tapeImg.y((image1 ? (image1.getPosition().y + image1.height() / 2.2) : 0));
        groupPostcard.add(tapeImg);
      });

      // // Load the pin image after the main image is loaded
      // Konva.Image.fromURL("/public/Postcards/PinImage.png", (pinImg) => {
      //   pinImg.width(image1 ? image1.width() / 3 : 0);
      //   pinImg.height(image1 ? image1.height() / 3 : 0);
      //   pinImg.offsetX(pinImg.width() / 2);
      //   pinImg.offsetY(pinImg.height() / 2);
      //   pinImg.x(-(image1 ? image1.width() / 2 : 0) + pinImg.width() / 2 + -30);
      //   pinImg.y(-(image1 ? image1.height() / 2 : 0) + pinImg.height() / 2 + -20);
      //   groupPostcard.add(pinImg);
      // });

      // Position the group after all images are added
      groupPostcard.offsetX(groupPostcard.width() / 2);
      groupPostcard.offsetY(groupPostcard.height() / 2);
      groupPostcard.x((STAGE_WIDTH / 100) * xPos);
      groupPostcard.y((STAGE_HEIGHT / 100) * -yPos + STAGE_HEIGHT);

      // Add the group to the main group
      this.group.add(groupPostcard);

      // Make the group visible
      groupPostcard.visible(true);
    });
  }

  addLine(x1: number, y1: number, x2: number, y2: number): void {

    // dashed line
    const redLine = new Konva.Line({
      points: [((STAGE_WIDTH / 100) * x1),((STAGE_HEIGHT / 100) * -y1 + STAGE_HEIGHT), ((STAGE_WIDTH / 100) * x2), ((STAGE_HEIGHT / 100) * -y2 + STAGE_HEIGHT)],
      stroke: 'red',
      strokeWidth: 5,
      lineJoin: 'round',
      dash: [33, 10]
    });
    
    this.lineGroup.add(redLine);
    
    
  }

  //Zoom in on a postcard
  zoomInOnPostcard(postcardImg: string, cityName: string, exitZoom: () => void = () => {}): void {

    this.zoomedInGroup = new Konva.Group();


    //Background overlay
    const overlay = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: 'black',
      opacity: 0.7,
    });
    overlay.on("click", () => {
      exitZoom();
    });

    this.zoomedInGroup.add(overlay);

    //Load the postcard image
    Konva.Image.fromURL(postcardImg, (img) => {
      img.width(this.PostcardWidth * 2);
      img.height(this.PostcardHeight * 2);
      img.offsetX(img.width() / 2);
      img.offsetY(img.height() / 2);
      img.x(this.centerValueX);
      img.y(this.centerValueY - 50);
      this.zoomedInGroup?.add(img);
      this.group.getLayer()?.draw();
    });

    //City name text
    const cityText = new Konva.Text({
      x: this.centerValueX,
      y: this.centerValueY + (this.PostcardHeight),
      text: cityName,
      fontSize: 70,
      fontFamily: 'Arial',
      fill: 'white',
      align: 'center',
    });
    cityText.offsetX(cityText.width() / 2); // Center horizontally
    this.zoomedInGroup.add(cityText);

    //Exit zoom button
    Konva.Image.fromURL("/public/Postcards/PinImage.png", (img) => {
      img.width(100);
      img.height(100);
      img.x(STAGE_WIDTH - img.width() - 10);
      img.y(10);
      img.on("click", () => {
        exitZoom();

      });
      img.on("mouseover", () => {
        img.scale({ x: 1.1, y: 1.1 }); // Slightly enlarge the image
        img.getLayer()?.draw();
      });
      img.on("mouseout", () => {
        img.scale({ x: 1, y: 1 }); // Reset the image size
        img.getLayer()?.draw();
      });
      this.zoomedInGroup?.add(img);
      this.group.getLayer()?.draw();
    });

    this.group.add(this.zoomedInGroup);
    this.group.getLayer()?.draw();

  }

  //Zoom out of postcard
  zoomOutOfPostcard(): void {
    if(this.zoomedInGroup){
      this.zoomedInGroup.destroy();
      this.group.getLayer()?.draw();
    }
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
    this.lineGroup.moveToBottom();
    this.lineGroup.moveUp();
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
