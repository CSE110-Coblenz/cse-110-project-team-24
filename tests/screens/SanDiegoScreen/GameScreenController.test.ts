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
    it("should reset the model and show the view", () => {
      const view = controller.getView();
      const showSpy = vi.spyOn(view, "show");
      const showMessageSpy = vi.spyOn(view, "showMessage");
      const hideWinScreenSpy = vi.spyOn(view, "hideWinScreen");
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const updateKeyboardSpy = vi.spyOn(view, "updateKeyboard");

      controller.startGame();

      expect(hideWinScreenSpy).toHaveBeenCalled();
      expect(showMessageSpy).toHaveBeenCalledWith(
        "Guess a 5-letter word about San Diego! (Any 5 letters!)",
        "#333"
      );
      expect(updateGuessesSpy).toHaveBeenCalled();
      expect(updateKeyboardSpy).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe("handleLetterInput", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should add letter to model and update view", () => {
      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const updateKeyboardSpy = vi.spyOn(view, "updateKeyboard");

      controller["handleLetterInput"]("A");

      expect(updateGuessesSpy).toHaveBeenCalled();
      expect(updateKeyboardSpy).toHaveBeenCalled();
    });

    it("should not add letter if game is over", () => {
      // Complete the game by losing
      for (let i = 0; i < 6; i++) {
        controller["handleLetterInput"]("X");
        controller["handleLetterInput"]("Y");
        controller["handleLetterInput"]("Z");
        controller["handleLetterInput"]("W");
        controller["handleLetterInput"]("V");
        controller["handleEnter"]();
      }

      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const initialCallCount = updateGuessesSpy.mock.calls.length;

      controller["handleLetterInput"]("A");

      // Should not update view if game is over
      expect(updateGuessesSpy.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe("handleBackspace", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should remove letter from model and update view", () => {
      const view = controller.getView();
      controller["handleLetterInput"]("A");
      controller["handleLetterInput"]("B");
      controller["handleLetterInput"]("C");

      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const initialCallCount = updateGuessesSpy.mock.calls.length;

      controller["handleBackspace"]();

      expect(updateGuessesSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it("should not remove letter if game is over", () => {
      // Complete the game
      for (let i = 0; i < 6; i++) {
        controller["handleLetterInput"]("X");
        controller["handleLetterInput"]("Y");
        controller["handleLetterInput"]("Z");
        controller["handleLetterInput"]("W");
        controller["handleLetterInput"]("V");
        controller["handleEnter"]();
      }

      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const initialCallCount = updateGuessesSpy.mock.calls.length;

      controller["handleBackspace"]();

      // Should not update view if game is over
      expect(updateGuessesSpy.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe("handleEnter", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should show error message if guess is less than 5 letters", () => {
      const view = controller.getView();
      const showMessageSpy = vi.spyOn(view, "showMessage");

      controller["handleLetterInput"]("A");
      controller["handleLetterInput"]("B");
      controller["handleEnter"]();

      expect(showMessageSpy).toHaveBeenCalledWith("Word must be 5 letters!", "#D32F2F");
    });

    it("should submit valid 5-letter guess", () => {
      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const updateKeyboardSpy = vi.spyOn(view, "updateKeyboard");

      controller["handleLetterInput"]("B");
      controller["handleLetterInput"]("E");
      controller["handleLetterInput"]("A");
      controller["handleLetterInput"]("C");
      controller["handleLetterInput"]("H");
      controller["handleEnter"]();

      expect(updateGuessesSpy).toHaveBeenCalled();
      expect(updateKeyboardSpy).toHaveBeenCalled();
    });

    it("should show win screen when game is won", () => {
      const view = controller.getView();
      const showWinScreenSpy = vi.spyOn(view, "showWinScreen");

      // Get target word and submit it
      const targetWord = controller["model"].getTargetWord();
      for (const letter of targetWord) {
        controller["handleLetterInput"](letter);
      }
      controller["handleEnter"]();

      expect(showWinScreenSpy).toHaveBeenCalled();
    });

    it("should show game over message when max guesses reached", () => {
      const view = controller.getView();
      const showMessageSpy = vi.spyOn(view, "showMessage");

      // Submit 6 wrong guesses
      for (let i = 0; i < 6; i++) {
        controller["handleLetterInput"]("X");
        controller["handleLetterInput"]("Y");
        controller["handleLetterInput"]("Z");
        controller["handleLetterInput"]("W");
        controller["handleLetterInput"]("V");
        controller["handleEnter"]();
      }

      expect(showMessageSpy).toHaveBeenCalledWith(
        expect.stringContaining("Game Over!"),
        "#D32F2F"
      );
    });

    it("should restart game when ENTER is pressed after game over", () => {
      const view = controller.getView();
      const startGameSpy = vi.spyOn(controller, "startGame");

      // Complete the game by losing
      for (let i = 0; i < 6; i++) {
        controller["handleLetterInput"]("X");
        controller["handleLetterInput"]("Y");
        controller["handleLetterInput"]("Z");
        controller["handleLetterInput"]("W");
        controller["handleLetterInput"]("V");
        controller["handleEnter"]();
      }

      // Press ENTER again to restart
      controller["handleEnter"]();

      expect(startGameSpy).toHaveBeenCalled();
    });

    it("should not restart game when ENTER is pressed after winning", () => {
      const view = controller.getView();
      const startGameSpy = vi.spyOn(controller, "startGame");

      // Win the game
      const targetWord = controller["model"].getTargetWord();
      for (const letter of targetWord) {
        controller["handleLetterInput"](letter);
      }
      controller["handleEnter"]();

      const initialCallCount = startGameSpy.mock.calls.length;

      // Press ENTER again (should not restart)
      controller["handleEnter"]();

      expect(startGameSpy.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe("handleMenuClick", () => {
    it("should navigate to home screen", () => {
      controller["handleMenuClick"]();

      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });
  });

  describe("updateView", () => {
    it("should update guesses and keyboard in view", () => {
      controller.startGame();
      const view = controller.getView();
      const updateGuessesSpy = vi.spyOn(view, "updateGuesses");
      const updateKeyboardSpy = vi.spyOn(view, "updateKeyboard");

      controller["updateView"]();

      expect(updateGuessesSpy).toHaveBeenCalled();
      expect(updateKeyboardSpy).toHaveBeenCalled();
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

