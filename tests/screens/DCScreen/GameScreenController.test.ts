import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/DCScreen/GameScreenController.ts";
import { GameScreenModel } from "../../../src/screens/DCScreen/GameScreenModel.ts";
import { GameScreenView } from "../../../src/screens/DCScreen/GameScreenView.ts";
import { DC_PRESIDENT_PAIRS } from "../../../src/screens/DCScreen/DCPresidents.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";

// Mock the view
vi.mock("../../../src/screens/DCScreen/GameScreenView.ts", () => {
  class MockGameScreenView {
    initializeGame = vi.fn();
    updateMatches = vi.fn();
    show = vi.fn();
    hide = vi.fn();
    flipCard = vi.fn();
    flipCardBack = vi.fn();
    markCardsAsMatched = vi.fn();
    showCompletionPopup = vi.fn();
    isCardFlipped = vi.fn(() => false);
    isCardMatched = vi.fn(() => false);
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
    vi.useFakeTimers();
    mockScreenSwitcher = {
      switchToScreen: vi.fn(),
    };
    controller = new GameScreenController(mockScreenSwitcher);
    mockView = controller.getView();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("startGame()", () => {
    it("should reset model and initialize view", () => {
      controller.startGame();

      expect(mockView.initializeGame).toHaveBeenCalledWith(DC_PRESIDENT_PAIRS);
      expect(mockView.updateMatches).toHaveBeenCalledWith(0, 8);
      expect(mockView.show).toHaveBeenCalled();
    });

    it("should clear flipped cards and allow processing", () => {
      // Simulate some game state
      (controller as any).flippedCards = [{ type: "president", value: "George Washington", cardIndex: 0 }];
      (controller as any).isProcessingMatch = true;

      controller.startGame();

      expect((controller as any).flippedCards).toEqual([]);
      expect((controller as any).isProcessingMatch).toBe(false);
    });
  });

  describe("handleCardClick()", () => {
    beforeEach(() => {
      controller.startGame();
      vi.clearAllMocks();
    });

    it("should flip card and add to flippedCards array", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).handleCardClick(0, "president", "George Washington");

      expect(mockView.flipCard).toHaveBeenCalledWith(0);
      expect((controller as any).flippedCards).toHaveLength(1);
      expect((controller as any).flippedCards[0]).toEqual({
        type: "president",
        value: "George Washington",
        cardIndex: 0,
      });
    });

    it("should not flip card if already flipped", () => {
      mockView.isCardFlipped = vi.fn(() => true);

      (controller as any).handleCardClick(0, "president", "George Washington");

      expect(mockView.flipCard).not.toHaveBeenCalled();
    });

    it("should not flip card if already matched", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => true);

      (controller as any).handleCardClick(0, "president", "George Washington");

      expect(mockView.flipCard).not.toHaveBeenCalled();
    });

    it("should not flip card if processing match", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);
      (controller as any).isProcessingMatch = true;

      (controller as any).handleCardClick(0, "president", "George Washington");

      expect(mockView.flipCard).not.toHaveBeenCalled();
    });

    it("should not flip card if president already matched", () => {
      const model = (controller as any).model as GameScreenModel;
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).handleCardClick(0, "president", "George Washington");

      expect(mockView.flipCard).not.toHaveBeenCalled();
    });

    it("should not flip card if accomplishment already matched", () => {
      const model = (controller as any).model as GameScreenModel;
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).handleCardClick(1, "accomplishment", "Established Washington, D.C. as the capital");

      expect(mockView.flipCard).not.toHaveBeenCalled();
    });

    it("should trigger match check when two cards are flipped", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      // Flip first card
      (controller as any).handleCardClick(0, "president", "George Washington");
      expect((controller as any).flippedCards).toHaveLength(1);

      // Flip second card
      (controller as any).handleCardClick(1, "accomplishment", "Established Washington, D.C. as the capital");
      expect((controller as any).flippedCards).toHaveLength(2);
      expect((controller as any).isProcessingMatch).toBe(true);

      // Fast-forward timer to trigger checkMatch
      vi.advanceTimersByTime(1000);

      // Should have called checkMatch (verified by checking if match was processed)
      expect((controller as any).flippedCards).toHaveLength(0);
      expect((controller as any).isProcessingMatch).toBe(false);
    });
  });

  describe("checkMatch()", () => {
    beforeEach(() => {
      controller.startGame();
      vi.clearAllMocks();
    });

    it("should mark cards as matched for valid president-accomplishment pair", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      // Set up two flipped cards that match
      (controller as any).flippedCards = [
        { type: "president", value: "George Washington", cardIndex: 0 },
        { type: "accomplishment", value: "Established Washington, D.C. as the capital", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      const model = (controller as any).model as GameScreenModel;
      expect(model.isMatched("George Washington", "Established Washington, D.C. as the capital")).toBe(true);
      expect(mockView.markCardsAsMatched).toHaveBeenCalledWith(0, 1);
      expect(mockView.updateMatches).toHaveBeenCalled();
      expect((controller as any).flippedCards).toHaveLength(0);
      expect((controller as any).isProcessingMatch).toBe(false);
    });

    it("should flip cards back for invalid match", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      // Set up two flipped cards that don't match
      (controller as any).flippedCards = [
        { type: "president", value: "George Washington", cardIndex: 0 },
        { type: "accomplishment", value: "Issued the Emancipation Proclamation", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      expect(mockView.flipCardBack).toHaveBeenCalledWith(0);
      expect(mockView.flipCardBack).toHaveBeenCalledWith(1);
      expect(mockView.markCardsAsMatched).not.toHaveBeenCalled();
      expect((controller as any).flippedCards).toHaveLength(0);
      expect((controller as any).isProcessingMatch).toBe(false);
    });

    it("should flip cards back if both cards are same type (both presidents)", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).flippedCards = [
        { type: "president", value: "George Washington", cardIndex: 0 },
        { type: "president", value: "Abraham Lincoln", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      expect(mockView.flipCardBack).toHaveBeenCalledWith(0);
      expect(mockView.flipCardBack).toHaveBeenCalledWith(1);
      expect(mockView.markCardsAsMatched).not.toHaveBeenCalled();
    });

    it("should flip cards back if both cards are same type (both accomplishments)", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).flippedCards = [
        { type: "accomplishment", value: "Established Washington, D.C. as the capital", cardIndex: 0 },
        { type: "accomplishment", value: "Issued the Emancipation Proclamation", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      expect(mockView.flipCardBack).toHaveBeenCalledWith(0);
      expect(mockView.flipCardBack).toHaveBeenCalledWith(1);
      expect(mockView.markCardsAsMatched).not.toHaveBeenCalled();
    });

    it("should handle president first, accomplishment second", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).flippedCards = [
        { type: "president", value: "George Washington", cardIndex: 0 },
        { type: "accomplishment", value: "Established Washington, D.C. as the capital", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      expect(mockView.markCardsAsMatched).toHaveBeenCalledWith(0, 1);
    });

    it("should handle accomplishment first, president second", () => {
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);

      (controller as any).flippedCards = [
        { type: "accomplishment", value: "Established Washington, D.C. as the capital", cardIndex: 0 },
        { type: "president", value: "George Washington", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      expect(mockView.markCardsAsMatched).toHaveBeenCalledWith(1, 0);
    });

    it("should end game when all pairs matched", () => {
      const model = (controller as any).model as GameScreenModel;
      // Match 7 pairs first
      const pairs = [
        { president: "Abraham Lincoln", accomplishment: "Issued the Emancipation Proclamation" },
        { president: "Thomas Jefferson", accomplishment: "Author of the Declaration of Independence" },
        { president: "Franklin D. Roosevelt", accomplishment: "Led the nation through the Great Depression and WWII" },
        { president: "John F. Kennedy", accomplishment: "Initiated the Apollo space program" },
        { president: "Theodore Roosevelt", accomplishment: "Established many national parks and conservation programs" },
        { president: "Ronald Reagan", accomplishment: "Played key role in ending the Cold War" },
        { president: "Barack Obama", accomplishment: "First African American president" },
      ];

      pairs.forEach((pair) => {
        model.recordMatch(pair.president, pair.accomplishment);
      });

      // Now match the 8th pair
      mockView.isCardFlipped = vi.fn(() => false);
      mockView.isCardMatched = vi.fn(() => false);
      (controller as any).flippedCards = [
        { type: "president", value: "George Washington", cardIndex: 0 },
        { type: "accomplishment", value: "Established Washington, D.C. as the capital", cardIndex: 1 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      // Fast-forward timer to trigger endGame
      vi.advanceTimersByTime(2000);

      expect(mockView.showCompletionPopup).toHaveBeenCalled();
    });

    it("should return early if not exactly 2 flipped cards", () => {
      (controller as any).flippedCards = [
        { type: "president", value: "George Washington", cardIndex: 0 },
      ];
      (controller as any).isProcessingMatch = true;

      (controller as any).checkMatch();

      expect(mockView.markCardsAsMatched).not.toHaveBeenCalled();
      expect(mockView.flipCardBack).not.toHaveBeenCalled();
      expect((controller as any).isProcessingMatch).toBe(false);
    });
  });

  describe("returnToHome()", () => {
    it("should navigate to home screen", () => {
      (controller as any).returnToHome();

      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });
  });

  describe("getFinalScore()", () => {
    it("should return 0", () => {
      expect(controller.getFinalScore()).toBe(0);
    });
  });
});

