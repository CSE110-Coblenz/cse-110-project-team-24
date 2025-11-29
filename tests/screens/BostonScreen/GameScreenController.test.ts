import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/BostonScreen/GameScreenController.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";

// Mock the view
vi.mock("../../../src/screens/BostonScreen/GameScreenView.ts", () => {
  class MockGameScreenView {
    setScore = vi.fn();
    setQuestion = vi.fn();
    highlightChoices = vi.fn();
    showFeedback = vi.fn();
    showNextButton = vi.fn();
    showResults = vi.fn();
    show = vi.fn();
    hide = vi.fn();
    getGroup = vi.fn(() => ({ visible: false }));
    
    // Constructor accepts callbacks but we don't need to use them
    constructor(_onChoiceSelected?: any, _onNext?: any) {
      // Mock constructor - accepts parameters but doesn't need to do anything
    }
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
    vi.clearAllMocks();
    mockScreenSwitcher = {
      switchToScreen: vi.fn(),
    };
    controller = new GameScreenController(mockScreenSwitcher);
    mockView = controller.getView();
  });

  describe("startGame", () => {
    it("should initialize the game and display the first question", () => {
      controller.startGame();

      expect(mockView.setScore).toHaveBeenCalledWith(0);
      expect(mockView.setQuestion).toHaveBeenCalled();
      expect(mockView.show).toHaveBeenCalled();
    });
  });

  describe("handleChoice", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should increment score for correct answer", () => {
      // First question correct answer is at index 1 (1773)
      (controller as any).handleChoice(1);

      expect(mockView.setScore).toHaveBeenCalledWith(1);
    });

    it("should not increment score for incorrect answer", () => {
      vi.clearAllMocks();
      // First question correct answer is at index 1, so 0 is wrong
      (controller as any).handleChoice(0);

      // Score should remain 0 for incorrect answer
      expect(mockView.setScore).not.toHaveBeenCalled();
    });
  });

  describe("handleNext", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should advance to next question when available", () => {
      vi.clearAllMocks();

      // Answer first question and move to next
      (controller as any).handleChoice(1);
      (controller as any).handleNext();

      expect(mockView.setQuestion).toHaveBeenCalled();
    });

    it("should end game when on last question", () => {
      // Answer all 5 questions
      for (let i = 0; i < 5; i++) {
        (controller as any).handleChoice(0);
        (controller as any).handleNext();
      }

      expect(mockView.showResults).toHaveBeenCalled();
    });
  });

  describe("endGame", () => {
    beforeEach(() => {
      controller.startGame();
    });

    it("should navigate to home screen when menu button is clicked", () => {
      // Complete the game
      for (let i = 0; i < 5; i++) {
        (controller as any).handleChoice(0);
        (controller as any).handleNext();
      }

      // Get the menu callback and call it
      const callArgs = mockView.showResults.mock.calls[0];
      const menuCallback = callArgs[3] as () => void;
      menuCallback();

      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });

    it("should restart game when play again button is clicked", () => {
      const startGameSpy = vi.spyOn(controller, "startGame");

      // Complete the game
      for (let i = 0; i < 5; i++) {
        (controller as any).handleChoice(0);
        (controller as any).handleNext();
      }

      // Get the play again callback and call it
      const callArgs = mockView.showResults.mock.calls[0];
      const playAgainCallback = callArgs[2] as () => void;
      playAgainCallback();

      expect(startGameSpy).toHaveBeenCalled();
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
