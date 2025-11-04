import type { Group } from "konva/lib/Group";

export interface View {
  getGroup(): Group;
  show(): void;
  hide(): void;
}

/**
 * Screen types for navigation
 *
 * - "menu": Main menu screen
 * - "home": Home screen (map/city selection)
 * - "game": Gameplay screen
 * - "about": About screen with game information
 * - "result": Results screen with final score
 *   - score: Final score to display on results screen
 * - "newyork": New York mini-game screen
 */
export type Screen =
  | { type: "menu" }
  | { type: "about" }
  | { type: "home" }
  | { type: "game" }
  | { type: "result"; score: number }
  | { type: "blank" }
  | { type: "newyork" };

export abstract class ScreenController {
  abstract getView(): View;

  show(): void {
    this.getView().show();
  }

  hide(): void {
    this.getView().hide();
  }
}

export interface ScreenSwitcher {
  switchToScreen(screen: Screen): void;
}
