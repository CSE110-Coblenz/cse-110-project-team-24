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
    this.view = new PostcardScreenView();

    //this.view.addPostcard("/public/Postcards/BostonPostcard.jpg", 700, -500);
    //this.view.addPostcard("/public/Postcards/SanDiegoPostcard.jpg", 0, 0);
    this.updatePostcards();
    //this.view.addLine(0, 0, 800, 600);
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

//Add lines between each postcard
  addLineBetweenPostcards(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0): void {
    this.view.addLine(x1, y1, x2, y2);
  }

  /**
   * Get the view group
   */
  getView(): PostcardScreenView {
    return this.view;
  }





}
