import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import type { City, MapGraph } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";

/**
 * GameScreenController - Coordinates game logic between Model and View
 */
export class GameScreenController extends ScreenController {
  private model: GameScreenModel;
  private view: GameScreenView;
  private onLocationChangeListeners: Array<(city: City) => void> = [];
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    super();
    this.screenSwitcher = screenSwitcher;

    this.model = new GameScreenModel();
    this.view = new GameScreenView(() => {});
    // When a city is clicked, navigate to the appropriate screen
    this.view.setCityClickHandler((city: City) => {
      if (city === "New York") {
        this.screenSwitcher.switchToScreen({ type: "newyork" });
      } else if (city === "Boston") {
        this.screenSwitcher.switchToScreen({ type: "boston" });
      } else {
        // For other cities, show blank screen for now
        this.screenSwitcher.switchToScreen({ type: "blank" });
      }
    });
    // Set up postcard button to navigate to postcard screen
    this.view.setPostcardButtonHandler(() => {
      this.screenSwitcher.switchToScreen({ type: "postcard" });
    });
    // Set up back button to navigate to start/menu screen
    this.view.setBackButtonHandler(() => {
      this.screenSwitcher.switchToScreen({ type: "menu" });
    });
  }

  /**
   * Initialize or reset the map state
   */
  start(): void {
    this.model.reset();
    this.view.show();
    this.emitLocationChanged();
  }

  // --- Map/Travel API exposed to the View ---
  getGraph(): MapGraph {
    return this.model.getGraph();
  }

  getCurrentCity(): City {
    return this.model.getCurrentCity();
  }

  getConnectedCities(from?: City): City[] {
    return this.model.getConnectedCities(from);
  }

  canTravelTo(destination: City): boolean {
    return this.model.canTravelTo(destination);
  }

  travelTo(destination: City): boolean {
    const moved = this.model.travelTo(destination);
    if (moved) this.emitLocationChanged();
    return moved;
  }

  // --- Simple listener pattern for location changes ---
  onLocationChange(listener: (city: City) => void): void {
    this.onLocationChangeListeners.push(listener);
  }

  private emitLocationChanged(): void {
    const city = this.model.getCurrentCity();
    for (const l of this.onLocationChangeListeners) l(city);
  }

  // Legacy no-op methods preserved for compatibility if called elsewhere
  // Remove once the rest of the app migrates to map-based flow

  // endGame intentionally removed for map mode

  // Not applicable for map mode
  getFinalScore(): number {
    return 0;
  }

  /**
   * Get the view group
   */
  getView(): GameScreenView {
    return this.view;
  }
}
