import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
import { MenuScreenController } from "./screens/StartScreen/StartScreenController.ts";
import { AboutScreenController } from "./screens/AboutScreen/AboutScreenController.ts";
import { GameScreenController } from "./screens/HomeScreen/GameScreenController.ts";
import { GameScreenController as BostonScreenController } from "./screens/BostonScreen/GameScreenController.ts";
import { ResultsScreenController } from "./screens/ResultsScreen/ResultsScreenController.ts";
import { BlankScreenController } from "./screens/BlankScreen/BlankScreenController.ts";
import { GameScreenController as NewYorkScreenController } from "./screens/NewYorkScreen/GameScreenController.ts";
import { GameScreenController as DCScreenController } from "./screens/DCScreen/GameScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen (Menu, Game, Results) has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */
class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private menuController: MenuScreenController;
  private aboutController: AboutScreenController;
  private gameController: GameScreenController;
  private bostonController: BostonScreenController;
  private resultsController: ResultsScreenController;
  private blankController: BlankScreenController;
  private newYorkController: NewYorkScreenController;
  private dcController: DCScreenController;

  /**
   * Constructor - Initializes the application and sets up all screens
   *
   * Creates the Konva stage and layer, initializes all screen controllers
   * (menu, about, game, results), adds their views to the layer, and starts
   * with the menu screen visible. Also sets up window resize handling to
   * keep the stage full-screen.
   *
   * @param container - The ID of the HTML container element where the canvas will be rendered
   */
  constructor(container: string) {
    // Initialize Konva stage (the main canvas)
    // The stage is the root container that holds all visual elements
    this.stage = new Konva.Stage({
      container, // ID of the HTML element to render into
      width: STAGE_WIDTH, // Initial width from constants
      height: STAGE_HEIGHT, // Initial height from constants
    });

    // Create a layer (screens will be added to this layer)
    // A layer is a container for Konva nodes that can be drawn together
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Initialize all screen controllers
    // Each controller manages a Model, View, and handles user interactions
    // Pass 'this' (the App instance) as the screenSwitcher so controllers can navigate
    this.menuController = new MenuScreenController(this);
    this.aboutController = new AboutScreenController(this);
    this.gameController = new GameScreenController(this);
    this.bostonController = new BostonScreenController(this);
    this.resultsController = new ResultsScreenController(this);
    this.blankController = new BlankScreenController();
    this.newYorkController = new NewYorkScreenController(this);
    this.dcController = new DCScreenController(this);

    // Add all screen groups to the layer
    // All screens exist simultaneously but only one is visible at a time
    // This allows for smooth transitions between screens without re-rendering
    this.layer.add(this.menuController.getView().getGroup());
    this.layer.add(this.aboutController.getView().getGroup());
    this.layer.add(this.gameController.getView().getGroup());
    this.layer.add(this.bostonController.getView().getGroup());
    this.layer.add(this.resultsController.getView().getGroup());
    this.layer.add(this.blankController.getView().getGroup());
    this.layer.add(this.newYorkController.getView().getGroup());
    this.layer.add(this.dcController.getView().getGroup());

    // Draw the layer (render everything to the canvas)
    // This initial render makes all screens available, though only one will be visible
    this.layer.draw();

    // Handle resize to keep full-screen stage
    // When the window is resized, update the stage size to match the window dimensions
    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.stage.size({ width, height }); // Update stage dimensions
      this.layer.draw(); // Redraw to reflect new size
    });

    // Start with menu screen visible
    // Show the menu screen when the application first loads
    this.menuController.getView().show();
  }

  /**
   * Switch to a different screen
   *
   * This method implements screen management by:
   * 1. Hiding all screens (setting their Groups to invisible)
   * 2. Showing only the requested screen
   *
   * This pattern ensures only one screen is visible at a time.
   * All screens are pre-rendered and exist in memory, but visibility
   * is controlled to create the illusion of navigation between screens.
   *
   * @param screen - The screen configuration object specifying which screen to show
   */
  switchToScreen(screen: Screen): void {
    // Hide all screens first by setting their Groups to invisible
    // This ensures no screen overlap or visual artifacts
    this.menuController.hide();
    this.aboutController.hide();
    this.gameController.hide();
    this.bostonController.hide();
    this.resultsController.hide();
    this.blankController.hide();
    this.newYorkController.hide();
    this.dcController.hide();

    // Show the requested screen based on the screen type
    // Each screen type has its own initialization logic
    switch (screen.type) {
      case "menu":
        // Show the menu/start screen
        this.menuController.show();
        break;

      case "about":
        // Show the about screen with game information
        this.aboutController.show();
        break;

      case "home":
        // Show the home screen (map/city selection)
        // This transitions to the HomeScreen without starting a game
        this.gameController.show();
        break;

      case "game":
        // Start the game (which also shows the game screen)
        // This triggers game initialization and displays the game screen
        this.gameController.start();
        break;

      case "result":
        // Show results screen with the final score
        // This displays the player's performance after completing the game
        this.resultsController.showResults(screen.score);
        break;

      case "blank":
        // Show blank screen placeholder
        this.blankController.show();
        break;

      case "newyork":
        // Show New York mini-game
        this.newYorkController.startGame();
        break;

      case "boston":
        // Show Boston trivia mini-game
        this.bostonController.startGame();
        break;

      case "dc":
        // Show Washington DC memory matching mini-game
        this.dcController.startGame();
        break;
    }
  }
}

// Initialize the application
// Create a new App instance, passing the ID of the HTML container element
// The container element should be defined in index.html with id="container"
new App("container");
