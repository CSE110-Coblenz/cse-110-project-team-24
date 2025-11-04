import { ScreenController } from "../../types.ts";
import { BlankScreenView } from "./BlankScreenView.ts";

export class BlankScreenController extends ScreenController {
  private view: BlankScreenView;

  constructor() {
    super();
    this.view = new BlankScreenView();
  }

  getView(): BlankScreenView {
    return this.view;
  }
}


