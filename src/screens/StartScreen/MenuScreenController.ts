import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MenuScreenView } from "./MenuScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MenuScreenController extends ScreenController {
  private view: MenuScreenView;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;
    this.view = new MenuScreenView(
      () => this.handleStartClick(),
      () => this.handleAboutClick()
    );
  }

  /**
   * Handle start button click
   */
  private handleStartClick(): void {
    this.screenSwitcher.switchToScreen({ type: "game" });
  }

  /**
   * Handle about button click
   */
  private handleAboutClick(): void {
    this.screenSwitcher.switchToScreen({ type: "about" });
  }

  /**
   * Get the view
   */
  getView(): MenuScreenView {
    return this.view;
  }
}
