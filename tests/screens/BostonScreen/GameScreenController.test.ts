import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/BostonScreen/GameScreenController.ts";
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
    it("should initialize the game and display the first question", () => {
      const view = controller.getView();
      const showSpy = vi.spyOn(view, "show");
      const setScoreSpy = vi.spyOn(view, "setScore");
      const setQuestionSpy = vi.spyOn(view, "setQuestion");

      controller.startGame();

      expect(setScoreSpy).toHaveBeenCalledWith(0);
      expect(setQuestionSpy).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe("handleChoice", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should increment score for correct answer", () => {
      const view = controller.getView();
      const setScoreSpy = vi.spyOn(view, "setScore");

      // First question correct answer is at index 1 (1773)
      (controller as any).handleChoice(1);

      expect(setScoreSpy).toHaveBeenCalledWith(1);
    });

    it("should not increment score for incorrect answer", () => {
      const view = controller.getView();
      const setScoreSpy = vi.spyOn(view, "setScore");

      // First question correct answer is at index 1, so 0 is wrong
      (controller as any).handleChoice(0);

      // Score should remain 0 for incorrect answer
      expect(setScoreSpy).not.toHaveBeenCalled();
    });
  });

  describe("handleNext", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should advance to next question when available", () => {
      const view = controller.getView();
      const setQuestionSpy = vi.spyOn(view, "setQuestion");

      // Clear the call from startGame
      setQuestionSpy.mockClear();

      // Answer first question and move to next
      (controller as any).handleChoice(1);
      (controller as any).handleNext();

      expect(setQuestionSpy).toHaveBeenCalled();
    });

    it("should end game when on last question", () => {
      const view = controller.getView();
      const showResultsSpy = vi.spyOn(view, "showResults");

      // Answer all 5 questions
      for (let i = 0; i < 5; i++) {
        (controller as any).handleChoice(0);
        (controller as any).handleNext();
      }

      expect(showResultsSpy).toHaveBeenCalled();
    });
  });

  describe("endGame", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should navigate to home screen when menu button is clicked", () => {
      const view = controller.getView();
      const showResultsSpy = vi.spyOn(view, "showResults");

      // Complete the game
      for (let i = 0; i < 5; i++) {
        (controller as any).handleChoice(0);
        (controller as any).handleNext();
      }

      // Get the menu callback and call it
      const callArgs = showResultsSpy.mock.calls[0];
      const menuCallback = callArgs[3] as () => void;
      menuCallback();

      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });

    it("should restart game when play again button is clicked", () => {
      const view = controller.getView();
      const showResultsSpy = vi.spyOn(view, "showResults");
      const startGameSpy = vi.spyOn(controller, "startGame");

      // Complete the game
      for (let i = 0; i < 5; i++) {
        (controller as any).handleChoice(0);
        (controller as any).handleNext();
      }

      // Get the play again callback and call it
      const callArgs = showResultsSpy.mock.calls[0];
      const playAgainCallback = callArgs[2] as () => void;
      playAgainCallback();

      expect(startGameSpy).toHaveBeenCalled();
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
