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
    it("should reset the model and show the view", () => {
      const view = controller.getView();
      const showSpy = vi.spyOn(view, "show");
      const setScoreSpy = vi.spyOn(view, "setScore");
      const setQuestionSpy = vi.spyOn(view, "setQuestion");

      controller.startGame();

      expect(setScoreSpy).toHaveBeenCalledWith(0);
      expect(setQuestionSpy).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalled();
    });

    it("should display the first question", () => {
      const view = controller.getView();
      const setQuestionSpy = vi.spyOn(view, "setQuestion");

      controller.startGame();

      expect(setQuestionSpy).toHaveBeenCalledWith(
        expect.stringContaining("Boston Tea Party"),
        expect.arrayContaining(["1763", "1773", "1783", "1793"]),
        1,
        5
      );
    });
  });

  describe("handleChoice", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should increment score for correct answer", () => {
      const view = controller.getView();
      const setScoreSpy = vi.spyOn(view, "setScore");
      const highlightSpy = vi.spyOn(view, "highlightChoices");
      const showFeedbackSpy = vi.spyOn(view, "showFeedback");
      const showNextButtonSpy = vi.spyOn(view, "showNextButton");

      // First question correct answer is at index 1
      controller["handleChoice"](1);

      expect(setScoreSpy).toHaveBeenCalledWith(1);
      expect(highlightSpy).toHaveBeenCalledWith(1, 1);
      expect(showFeedbackSpy).toHaveBeenCalledWith(true, "1773");
      expect(showNextButtonSpy).toHaveBeenCalled();
    });

    it("should not increment score for incorrect answer", () => {
      const view = controller.getView();
      const setScoreSpy = vi.spyOn(view, "setScore");
      const highlightSpy = vi.spyOn(view, "highlightChoices");
      const showFeedbackSpy = vi.spyOn(view, "showFeedback");

      // First question correct answer is at index 1, so 0 is wrong
      controller["handleChoice"](0);

      // setScore is only called when score changes (i.e., on correct answer)
      // For incorrect answers, score stays the same so setScore is not called
      expect(setScoreSpy).not.toHaveBeenCalled();
      expect(highlightSpy).toHaveBeenCalledWith(0, 1);
      expect(showFeedbackSpy).toHaveBeenCalledWith(false, "1773");
    });
  });

  describe("handleNext", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should advance to next question when available", () => {
      const view = controller.getView();
      const setQuestionSpy = vi.spyOn(view, "setQuestion");

      // Answer first question
      controller["handleChoice"](1);
      // Move to next question
      controller["handleNext"]();

      expect(setQuestionSpy).toHaveBeenCalledWith(
        expect.stringContaining("famous trail"),
        expect.any(Array),
        2,
        5
      );
    });

    it("should end game when on last question", () => {
      const view = controller.getView();
      const showResultsSpy = vi.spyOn(view, "showResults");

      // Answer all questions
      for (let i = 0; i < 5; i++) {
        controller["handleChoice"](0);
        controller["handleNext"]();
      }

      expect(showResultsSpy).toHaveBeenCalled();
    });

    it("should call showResults with correct parameters on game end", () => {
      const view = controller.getView();
      const showResultsSpy = vi.spyOn(view, "showResults");

      // Answer all questions correctly
      for (let i = 0; i < 5; i++) {
        const question = controller["model"].getCurrentQuestion();
        controller["handleChoice"](question.correctIndex);
        controller["handleNext"](); // Call handleNext after each answer, including the last one
      }

      expect(showResultsSpy).toHaveBeenCalledWith(
        5,
        5,
        expect.any(Function),
        expect.any(Function),
        true // isPerfect
      );
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
        controller["handleChoice"](0);
        controller["handleNext"](); // Call handleNext after each answer, including the last one
      }

      expect(showResultsSpy).toHaveBeenCalled();
      
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
        controller["handleChoice"](0);
        controller["handleNext"](); // Call handleNext after each answer, including the last one
      }

      expect(showResultsSpy).toHaveBeenCalled();
      
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

