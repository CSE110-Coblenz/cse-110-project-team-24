import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/SanDiegoScreen/GameScreenController.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";

// Mock the view
vi.mock("../../../src/screens/SanDiegoScreen/GameScreenView.ts", () => {
  class MockGameScreenView {
    updateGuesses = vi.fn();
    updateKeyboard = vi.fn();
    showMessage = vi.fn();
    showWinScreen = vi.fn();
    hideWinScreen = vi.fn();
    setHandlers = vi.fn();
    show = vi.fn();
    hide = vi.fn();
    getGroup = vi.fn(() => ({ visible: false }));
  }

  return {
    GameScreenView: MockGameScreenView,
  };
});

describe("GameScreenController", () => {
  let controller: GameScreenController;
  let mockScreenSwitcher: ScreenSwitcher;
  let mockView: any;

  beforeEach(() => {
    mockScreenSwitcher = {
      switchToScreen: vi.fn(),
    };
    controller = new GameScreenController(mockScreenSwitcher);
    mockView = controller.getView();
  });

  describe("startGame", () => {
    it("should initialize the game and show the view", () => {
      controller.startGame();

      expect(mockView.hideWinScreen).toHaveBeenCalled();
      expect(mockView.showMessage).toHaveBeenCalled();
      expect(mockView.updateGuesses).toHaveBeenCalled();
      expect(mockView.updateKeyboard).toHaveBeenCalled();
      expect(mockView.show).toHaveBeenCalled();
    });
  });

  describe("handleLetterInput", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should add letter and update view", () => {
      vi.clearAllMocks();
      (controller as any).handleLetterInput("A");

      expect(mockView.updateGuesses).toHaveBeenCalled();
      expect(mockView.updateKeyboard).toHaveBeenCalled();
    });

    it("should not add letter if game is over", () => {
      // Complete the game by losing (6 wrong guesses)
      for (let i = 0; i < 6; i++) {
        (controller as any).handleLetterInput("X");
        (controller as any).handleLetterInput("Y");
        (controller as any).handleLetterInput("Z");
        (controller as any).handleLetterInput("W");
        (controller as any).handleLetterInput("V");
        (controller as any).handleEnter();
      }

      vi.clearAllMocks();
      (controller as any).handleLetterInput("A");

      // Should not update view if game is over
      expect(mockView.updateGuesses).not.toHaveBeenCalled();
      expect(mockView.updateKeyboard).not.toHaveBeenCalled();
    });
  });

  describe("handleBackspace", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should remove letter and update view", () => {
      (controller as any).handleLetterInput("A");
      (controller as any).handleLetterInput("B");

      vi.clearAllMocks();
      (controller as any).handleBackspace();

      expect(mockView.updateGuesses).toHaveBeenCalled();
      expect(mockView.updateKeyboard).toHaveBeenCalled();
    });
  });

  describe("handleEnter", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should show error message if guess is less than 5 letters", () => {
      vi.clearAllMocks();
      (controller as any).handleLetterInput("A");
      (controller as any).handleLetterInput("B");
      (controller as any).handleEnter();

      expect(mockView.showMessage).toHaveBeenCalledWith("Word must be 5 letters!", "#D32F2F");
    });

    it("should submit valid 5-letter guess", () => {
      vi.clearAllMocks();
      (controller as any).handleLetterInput("B");
      (controller as any).handleLetterInput("E");
      (controller as any).handleLetterInput("A");
      (controller as any).handleLetterInput("C");
      (controller as any).handleLetterInput("H");
      (controller as any).handleEnter();

      expect(mockView.updateGuesses).toHaveBeenCalled();
      expect(mockView.updateKeyboard).toHaveBeenCalled();
    });

    it("should show win screen when game is won", () => {
      vi.clearAllMocks();
      
      // Get target word and submit it
      const targetWord = (controller as any).model.getTargetWord();
      for (const letter of targetWord) {
        (controller as any).handleLetterInput(letter);
      }
      (controller as any).handleEnter();

      expect(mockView.showWinScreen).toHaveBeenCalled();
    });

    it("should show game over message when max guesses reached", () => {
      // Submit 6 wrong guesses
      for (let i = 0; i < 6; i++) {
        (controller as any).handleLetterInput("X");
        (controller as any).handleLetterInput("Y");
        (controller as any).handleLetterInput("Z");
        (controller as any).handleLetterInput("W");
        (controller as any).handleLetterInput("V");
        (controller as any).handleEnter();
      }

      expect(mockView.showMessage).toHaveBeenCalledWith(
        expect.stringContaining("Game Over!"),
        "#D32F2F"
      );
    });
  });

  describe("handleMenuClick", () => {
    it("should navigate to home screen", () => {
      (controller as any).handleMenuClick();

      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });
  });

  describe("getView", () => {
    it("should return the view instance", () => {
      const view = controller.getView();
      expect(view).toBeDefined();
      expect(view).toBe(mockView);
      expect(view.show).toBeDefined();
      expect(view.hide).toBeDefined();
    });
  });
});
