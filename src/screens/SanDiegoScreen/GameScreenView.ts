import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { LetterState, GuessResult } from "./GameScreenModel.ts";

export class GameScreenView implements View {
  private group: Konva.Group;
  private gridGroup: Konva.Group;
  private keyboardGroup: Konva.Group;
  private winScreenGroup!: Konva.Group; // Initialized in createWinScreen()
  private messageText: Konva.Text;
  private titleText: Konva.Text;
  private guessBoxes: Konva.Rect[][] = [];
  private guessTexts: Konva.Text[][] = [];
  private keyboardButtons: Map<string, Konva.Group> = new Map();
  private onLetterInput: ((letter: string) => void) | null = null;
  private onBackspace: (() => void) | null = null;
  private onEnter: (() => void) | null = null;
  private onMenuClick: (() => void) | null = null;

  private readonly WORD_LENGTH = 5;
  private readonly MAX_GUESSES = 6;
  private readonly BOX_SIZE = 60;
  private readonly BOX_GAP = 10;
  private readonly GRID_START_X =
    STAGE_WIDTH / 2 -
    (this.WORD_LENGTH * (this.BOX_SIZE + this.BOX_GAP) - this.BOX_GAP) / 2;
  private readonly GRID_START_Y = 150;

  constructor() {
    this.group = new Konva.Group({ visible: false });
    this.gridGroup = new Konva.Group();
    this.keyboardGroup = new Konva.Group();

    // Background - San Diego theme (ocean blue)
    const bg = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "#E3F2FD", // Light blue
    });
    this.group.add(bg);

    // Title
    this.titleText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 40,
      text: "San Diego Wordle",
      fontSize: 36,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#1976D2",
      align: "center",
    });
    this.titleText.offsetX(this.titleText.width() / 2);
    this.group.add(this.titleText);

    // Message text (for win/lose/errors)
    this.messageText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: 100,
      text: "Guess a 5-letter word about San Diego!",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#333",
      align: "center",
    });
    this.messageText.offsetX(this.messageText.width() / 2);
    this.group.add(this.messageText);

    // Create guess grid
    this.createGrid();
    this.group.add(this.gridGroup);

    // Create keyboard
    this.createKeyboard();
    this.group.add(this.keyboardGroup);

    // Create win screen
    this.createWinScreen();
    this.group.add(this.winScreenGroup);

    // Set up keyboard event listeners
    this.setupKeyboardListeners();
  }

  private createWinScreen(): void {
    this.winScreenGroup = new Konva.Group({ visible: false });

    // Semi-transparent overlay
    const overlay = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "rgba(0, 0, 0, 0.7)",
    });
    this.winScreenGroup.add(overlay);

    // Win screen background - same color as game background
    const winBg = new Konva.Rect({
      x: STAGE_WIDTH / 2 - 300,
      y: STAGE_HEIGHT / 2 - 250,
      width: 600,
      height: 500,
      fill: "#E3F2FD", // Same as game background
      cornerRadius: 20,
      stroke: "#4CAF50",
      strokeWidth: 4,
    });
    this.winScreenGroup.add(winBg);

    // Congratulations text
    const congratsText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 180,
      text: "Congratulations!",
      fontSize: 42,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#4CAF50",
      align: "center",
    });
    congratsText.offsetX(congratsText.width() / 2);
    this.winScreenGroup.add(congratsText);

    const youWinText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: STAGE_HEIGHT / 2 - 130,
      text: "You Win!",
      fontSize: 32,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#1976D2",
      align: "center",
    });
    youWinText.offsetX(youWinText.width() / 2);
    this.winScreenGroup.add(youWinText);

    // Image placeholder - made bigger
    const imagePlaceholderWidth = 400;
    const imagePlaceholderHeight = 280;
    const imagePlaceholderY = STAGE_HEIGHT / 2 - 80;
    const imagePlaceholder = new Konva.Rect({
      x: STAGE_WIDTH / 2 - imagePlaceholderWidth / 2,
      y: imagePlaceholderY,
      width: imagePlaceholderWidth,
      height: imagePlaceholderHeight,
      fill: "#ffffff",
      stroke: "#1976D2",
      strokeWidth: 3,
      cornerRadius: 10,
    });
    this.winScreenGroup.add(imagePlaceholder);

    const placeholderText = new Konva.Text({
      x: STAGE_WIDTH / 2,
      y: imagePlaceholderY + imagePlaceholderHeight / 2,
      text: "Image Placeholder",
      fontSize: 18,
      fontFamily: "Arial",
      fill: "#666",
      align: "center",
    });
    placeholderText.offsetX(placeholderText.width() / 2);
    placeholderText.offsetY(placeholderText.height() / 2);
    this.winScreenGroup.add(placeholderText);

    // Menu button - positioned below the image box
    const menuButton = new Konva.Group({
      x: STAGE_WIDTH / 2 - 100,
      y: imagePlaceholderY + imagePlaceholderHeight + 30, // 30px spacing below image
    });

    const menuButtonBg = new Konva.Rect({
      x: 0,
      y: 0,
      width: 200,
      height: 50,
      fill: "#1976D2",
      cornerRadius: 10,
      shadowBlur: 5,
      shadowColor: "black",
      shadowOpacity: 0.3,
    });

    const menuButtonText = new Konva.Text({
      x: 100,
      y: 25,
      text: "MENU",
      fontSize: 24,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#ffffff",
      align: "center",
    });
    menuButtonText.offsetX(menuButtonText.width() / 2);
    menuButtonText.offsetY(menuButtonText.height() / 2);

    menuButton.add(menuButtonBg);
    menuButton.add(menuButtonText);

    // Hover effects
    menuButton.on("mouseenter", () => {
      menuButtonBg.fill("#1565C0");
      this.group.getLayer()?.draw();
    });
    menuButton.on("mouseleave", () => {
      menuButtonBg.fill("#1976D2");
      this.group.getLayer()?.draw();
    });

    menuButton.on("click", () => {
      this.onMenuClick?.();
    });

    this.winScreenGroup.add(menuButton);
  }

  private createGrid(): void {
    for (let row = 0; row < this.MAX_GUESSES; row++) {
      const rowBoxes: Konva.Rect[] = [];
      const rowTexts: Konva.Text[] = [];

      for (let col = 0; col < this.WORD_LENGTH; col++) {
        const x = this.GRID_START_X + col * (this.BOX_SIZE + this.BOX_GAP);
        const y = this.GRID_START_Y + row * (this.BOX_SIZE + this.BOX_GAP);

        // Box
        const box = new Konva.Rect({
          x: x,
          y: y,
          width: this.BOX_SIZE,
          height: this.BOX_SIZE,
          fill: "#ffffff",
          stroke: "#ccc",
          strokeWidth: 2,
          cornerRadius: 5,
        });
        this.gridGroup.add(box);
        rowBoxes.push(box);

        // Text - centered in box
        const text = new Konva.Text({
          x: x + this.BOX_SIZE / 2,
          y: y + this.BOX_SIZE / 2,
          text: "",
          fontSize: 32,
          fontFamily: "Arial",
          fontStyle: "bold",
          fill: "#333",
          align: "center",
        });
        // Set initial offset - will be recalculated when text changes
        text.offsetX(0);
        text.offsetY(0);
        this.gridGroup.add(text);
        rowTexts.push(text);
      }

      this.guessBoxes.push(rowBoxes);
      this.guessTexts.push(rowTexts);
    }
  }

  private createKeyboard(): void {
    const keyboardRows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
    ];

    const keyWidth = 45;
    const keyHeight = 50;
    const keyGap = 8;
    const startY = STAGE_HEIGHT - 200;
    const rowHeight = keyHeight + keyGap;

    keyboardRows.forEach((row, rowIndex) => {
      const rowWidth = row.length * (keyWidth + keyGap) - keyGap;
      const startX = STAGE_WIDTH / 2 - rowWidth / 2;

      row.forEach((key, colIndex) => {
        const isSpecial = key === "ENTER" || key === "BACK";
        const width = isSpecial ? keyWidth * 1.5 : keyWidth;
        const x =
          startX +
          colIndex * (keyWidth + keyGap) +
          (isSpecial && key === "ENTER" ? -keyWidth * 0.25 : 0) +
          (isSpecial && key === "BACK" ? keyWidth * 0.25 : 0);

        const buttonGroup = new Konva.Group({
          x: x,
          y: startY + rowIndex * rowHeight,
        });
        const rect = new Konva.Rect({
          x: 0,
          y: 0,
          width: width,
          height: keyHeight,
          fill: "#818384",
          cornerRadius: 5,
          stroke: "#ffffff",
          strokeWidth: 1,
        });

        const text = new Konva.Text({
          x: width / 2,
          y: keyHeight / 2,
          text: key,
          fontSize: key === "ENTER" || key === "BACK" ? 12 : 16,
          fontFamily: "Arial",
          fontStyle: "bold",
          fill: "#ffffff",
          align: "center",
        });
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2);

        buttonGroup.add(rect);
        buttonGroup.add(text);

        // Click handler
        buttonGroup.on("click", () => {
          if (key === "ENTER") {
            this.onEnter?.();
          } else if (key === "BACK") {
            this.onBackspace?.();
          } else {
            this.onLetterInput?.(key);
          }
        });

        // Hover effect
        buttonGroup.on("mouseenter", () => {
          rect.fill("#9CA3AF");
          this.group.getLayer()?.draw();
        });
        buttonGroup.on("mouseleave", () => {
          rect.fill("#818384");
          this.group.getLayer()?.draw();
        });

        this.keyboardGroup.add(buttonGroup);
        this.keyboardButtons.set(key, buttonGroup);
      });
    });
  }

  private setupKeyboardListeners(): void {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", (e) => {
      if (!this.group.visible()) return;

      const key = e.key.toUpperCase();
      if (key.length === 1 && /[A-Z]/.test(key)) {
        this.onLetterInput?.(key);
      } else if (key === "BACKSPACE" || key === "DELETE") {
        this.onBackspace?.();
      } else if (key === "ENTER") {
        this.onEnter?.();
      }
    });
  }

  private getColorForState(state: LetterState): string {
    switch (state) {
      case "correct":
        return "#6AAA64"; // Green
      case "wrong-position":
        return "#C9B458"; // Yellow
      case "not-in-word":
        return "#787C7E"; // Gray
      default:
        return "#ffffff"; // White
    }
  }

  /**
   * Update the grid with guesses
   */
  updateGuesses(guesses: GuessResult[], currentGuess: string): void {
    // Clear all
    for (let row = 0; row < this.MAX_GUESSES; row++) {
      for (let col = 0; col < this.WORD_LENGTH; col++) {
        this.guessTexts[row][col].text("");
        this.guessTexts[row][col].fill("#333"); // Reset to black text
        this.guessBoxes[row][col].fill("#ffffff");
        this.guessBoxes[row][col].stroke("#ccc");
      }
    }

    // Draw submitted guesses
    guesses.forEach((guess, rowIndex) => {
      guess.letters.forEach((letter, colIndex) => {
        const text = this.guessTexts[rowIndex][colIndex];
        text.text(letter);
        // Recalculate offsets for proper centering
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2 - 4); // Small adjustment for better vertical centering

        const color = this.getColorForState(guess.states[colIndex]);
        this.guessBoxes[rowIndex][colIndex].fill(color);
        this.guessBoxes[rowIndex][colIndex].stroke(color);
        if (guess.states[colIndex] === "correct") {
          text.fill("#ffffff");
        } else {
          text.fill("#ffffff");
        }
      });
    });

    // Draw current guess
    const currentRow = guesses.length;
    if (currentRow < this.MAX_GUESSES) {
      const currentLetters = currentGuess.split("");
      currentLetters.forEach((letter, colIndex) => {
        const text = this.guessTexts[currentRow][colIndex];
        // Set text and ensure it's visible (black text on white background)
        text.text(letter);
        // Recalculate offsets for proper centering
        text.offsetX(text.width() / 2);
        text.offsetY(text.height() / 2 - 4); // Small adjustment for better vertical centering
        text.fill("#333"); // Black text for current guess
        // Ensure box is white with gray stroke for current guess
        this.guessBoxes[currentRow][colIndex].fill("#ffffff");
        this.guessBoxes[currentRow][colIndex].stroke("#ccc");
      });

      // Clear any remaining boxes in the current row that don't have letters
      for (
        let colIndex = currentLetters.length;
        colIndex < this.WORD_LENGTH;
        colIndex++
      ) {
        const text = this.guessTexts[currentRow][colIndex];
        text.text("");
        text.offsetX(0);
        text.offsetY(0);
        text.fill("#333");
        this.guessBoxes[currentRow][colIndex].fill("#ffffff");
        this.guessBoxes[currentRow][colIndex].stroke("#ccc");
      }
    }

    this.group.getLayer()?.draw();
  }

  /**
   * Get color for keyboard button based on letter state
   */
  private getKeyboardColorForState(state: LetterState): string {
    switch (state) {
      case "correct":
        return "#6AAA64"; // Green
      case "wrong-position":
        return "#C9B458"; // Yellow
      case "not-in-word":
        return "#DC3545"; // Red for letters not in word
      default:
        return "#818384"; // Default gray
    }
  }

  /**
   * Update keyboard button colors based on letter states
   */
  updateKeyboard(guesses: GuessResult[]): void {
    const letterStates = new Map<string, LetterState>();

    // Process guesses to determine best state for each letter
    guesses.forEach((guess) => {
      guess.letters.forEach((letter, index) => {
        const state = guess.states[index];
        const currentState = letterStates.get(letter);

        // Priority: correct > wrong-position > not-in-word
        if (
          !currentState ||
          (currentState === "not-in-word" && state !== "not-in-word") ||
          (currentState === "wrong-position" && state === "correct")
        ) {
          letterStates.set(letter, state);
        }
      });
    });

    // Update keyboard button colors
    this.keyboardButtons.forEach((buttonGroup, key) => {
      if (key === "ENTER" || key === "BACK") return;

      const state = letterStates.get(key);
      if (state) {
        const rect = buttonGroup.children[0] as Konva.Rect;
        const color = this.getKeyboardColorForState(state);
        rect.fill(color);
      } else {
        // Reset to default gray if letter hasn't been guessed
        const rect = buttonGroup.children[0] as Konva.Rect;
        rect.fill("#818384");
      }
    });

    this.group.getLayer()?.draw();
  }

  /**
   * Show message
   */
  showMessage(message: string, color: string = "#333"): void {
    this.messageText.text(message);
    this.messageText.fill(color);
    this.messageText.offsetX(this.messageText.width() / 2);
    this.group.getLayer()?.draw();
  }

  /**
   * Set handlers
   */
  setHandlers(
    onLetterInput: (letter: string) => void,
    onBackspace: () => void,
    onEnter: () => void,
    onMenuClick?: () => void
  ): void {
    this.onLetterInput = onLetterInput;
    this.onBackspace = onBackspace;
    this.onEnter = onEnter;
    this.onMenuClick = onMenuClick || null;
  }

  /**
   * Show win screen
   */
  showWinScreen(_guessCount: number): void {
    // Hide game elements
    this.gridGroup.visible(false);
    this.keyboardGroup.visible(false);
    this.titleText.visible(false);
    this.messageText.visible(false);

    // Show win screen
    this.winScreenGroup.visible(true);
    this.group.getLayer()?.draw();
  }

  /**
   * Hide win screen and show game
   */
  hideWinScreen(): void {
    this.winScreenGroup.visible(false);
    this.gridGroup.visible(true);
    this.keyboardGroup.visible(true);
    this.titleText.visible(true);
    this.messageText.visible(true);
    this.group.getLayer()?.draw();
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
