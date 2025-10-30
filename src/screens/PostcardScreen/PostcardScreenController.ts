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


  }


  /**
   * Get the view group
   */
  getView(): PostcardScreenView {
    return this.view;
  }





}
