import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/SanDiegoScreen/GameScreenController.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";

describe("GameScreenController", () => {
  let controller: GameScreenController;
  let mockScreenSwitcher: ScreenSwitcher;

  beforeEach(() => {
    mockScreenSwitcher = {
      switchToScreen: vi.fn(),
    };
    controller = new GameScreenController(mockScreenSwitcher);
  });

  describe("startGame", () => {
    it("should initialize the game and show the view", () => {
      const view = controller.getView();
      const showSpy = vi.spyOn(view, "show");
      const showMessageSpy = vi.spyOn(view, "showMessage");
      const hideWinScreenSpy = vi.spyOn(view, "hideWinScreen");

      controller.startGame();

      expect(hideWinScreenSpy).toHaveBeenCalled();
      expect(showMessageSpy).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe("handleLetterInput", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should add letter and update view", () => {
      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");

      (controller as any).handleLetterInput("A");

      expect(updateGuessesSpy).toHaveBeenCalled();
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

      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const initialCallCount = updateGuessesSpy.mock.calls.length;

      (controller as any).handleLetterInput("A");

      // Should not update view if game is over
      expect(updateGuessesSpy.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe("handleBackspace", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should remove letter and update view", () => {
      const view = controller.getView();
      (controller as any).handleLetterInput("A");
      (controller as any).handleLetterInput("B");

      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const initialCallCount = updateGuessesSpy.mock.calls.length;

      (controller as any).handleBackspace();

      expect(updateGuessesSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });
  });

  describe("handleEnter", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should show error message if guess is less than 5 letters", () => {
      const view = controller.getView();
      const showMessageSpy = vi.spyOn(view, "showMessage");

      (controller as any).handleLetterInput("A");
      (controller as any).handleLetterInput("B");
      (controller as any).handleEnter();

      expect(showMessageSpy).toHaveBeenCalledWith("Word must be 5 letters!", "#D32F2F");
    });

    it("should submit valid 5-letter guess", () => {
      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");

      (controller as any).handleLetterInput("B");
      (controller as any).handleLetterInput("E");
      (controller as any).handleLetterInput("A");
      (controller as any).handleLetterInput("C");
      (controller as any).handleLetterInput("H");
      (controller as any).handleEnter();

      expect(updateGuessesSpy).toHaveBeenCalled();
    });

    it("should show win screen when game is won", () => {
      const view = controller.getView();
      const showWinScreenSpy = vi.spyOn(view, "showWinScreen");

      // Get target word and submit it
      const targetWord = (controller as any).model.getTargetWord();
      for (const letter of targetWord) {
        (controller as any).handleLetterInput(letter);
      }
      (controller as any).handleEnter();

      expect(showWinScreenSpy).toHaveBeenCalled();
    });

    it("should show game over message when max guesses reached", () => {
      const view = controller.getView();
      const showMessageSpy = vi.spyOn(view, "showMessage");

      // Submit 6 wrong guesses
      for (let i = 0; i < 6; i++) {
        (controller as any).handleLetterInput("X");
        (controller as any).handleLetterInput("Y");
        (controller as any).handleLetterInput("Z");
        (controller as any).handleLetterInput("W");
        (controller as any).handleLetterInput("V");
        (controller as any).handleEnter();
      }

      expect(showMessageSpy).toHaveBeenCalledWith(
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
      expect(view.show).toBeDefined();
      expect(view.hide).toBeDefined();
    });
  });
});
