import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { PostcardScreenModel } from "./PostcardScreenModel.ts";
import { PostcardScreenView } from "./PostcardScreenView.ts";

/**
 * PostcardScreenController - Coordinates game logic between Postcard Model and View
 */
export class PostcardScreenController extends ScreenController {
  private model: PostcardScreenModel;
  private view: PostcardScreenView;
  private screenSwitcher: ScreenSwitcher;


  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new PostcardScreenModel();
    this.view = new PostcardScreenView(() => this.exitToHome());


    this.updatePostcards();
  }

  //Update the postcards in the view
  updatePostcards(): void {
    const postcards = this.model.getActivePostcards();
    let previousPostcardx: number | null = null;
    let previousPostcardy: number | null = null;
    postcards.forEach((postcard) => {
      this.view.addPostcard(
        postcard.postcardImageSrc,
        postcard.xPos,
        postcard.yPos,
        (postcardSrc: string) => this.zoomInOnPostcard(postcardSrc),
      );

      //Add line between postcards
      if (previousPostcardx != null && previousPostcardy != null) {
        this.addLineBetweenPostcards(
          previousPostcardx,
          previousPostcardy,
          postcard.xPos,
          postcard.yPos,
        );
      }
      previousPostcardx = postcard.xPos;
      previousPostcardy = postcard.yPos;
    });
  }

  //Exit to home screen
  exitToHome(): void {
    this.screenSwitcher.switchToScreen({ type: "home" });
  }



//Add lines between each postcard
  addLineBetweenPostcards(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0): void {
    this.view.addLine(x1, y1, x2, y2);
  }

  //Zoom in on a postcard
  zoomInOnPostcard(postcardSrc: string): void {
    const postcard = this.model.getActivePostcards().find(p => p.postcardImageSrc === postcardSrc);
    if (!postcard) {
      console.error("Postcard not found: " + postcardSrc);
      return;
    }

    //console.log("Zooming in on postcard: " + postcard.title);
    if(!this.model.getIsZoomedIn()){
      this.model.setIsZoomedIn(true);
      this.view.zoomInOnPostcard(postcardSrc, postcard.title, () => this.zoomOutOfPostcard());
    }
  }

  //Zoom out of postcard
  zoomOutOfPostcard(): void {
    //console.log("Zooming out of postcard");
    this.model.setIsZoomedIn(false);
    this.view.zoomOutOfPostcard();
  }


  /**
   * Get the view group
   */
  getView(): PostcardScreenView {
    return this.view;
  }





}
