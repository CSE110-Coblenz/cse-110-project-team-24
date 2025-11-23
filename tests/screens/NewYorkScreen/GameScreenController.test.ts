import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/NewYorkScreen/GameScreenController.ts";
import { GameScreenModel } from "../../../src/screens/NewYorkScreen/GameScreenModel.ts";
import { GameScreenView } from "../../../src/screens/NewYorkScreen/GameScreenView.ts";
import {
  getFactPairByIndex,
  getCorrectFactIndex,
  NEW_YORK_FACT_PAIRS,
} from "../../../src/screens/NewYorkScreen/NewYorkFacts.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";

// Mock the view
vi.mock("../../../src/screens/NewYorkScreen/GameScreenView.ts", () => {
  class MockGameScreenView {
    getCurrentFactIndex = vi.fn(() => 0);
    isFact1OnTaxi1 = vi.fn(() => true);
    updateScore = vi.fn();
    highlightTaxiCorrect = vi.fn();
    highlightTaxiWrong = vi.fn();
    setTaxiInteractivity = vi.fn();
    stopAnimations = vi.fn();
    showRetryOverlay = vi.fn();
    hideRetryOverlay = vi.fn();
    resetGameState = vi.fn();
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

  describe("startGame()", () => {
    it("should reset model and initialize view", () => {
      controller.startGame();

      expect(mockView.resetGameState).toHaveBeenCalled();
      expect(mockView.hideRetryOverlay).toHaveBeenCalled();
      expect(mockView.setTaxiInteractivity).toHaveBeenCalledWith(true);
      expect(mockView.show).toHaveBeenCalled();
    });
  });

  describe("handleTaxiClick()", () => {
    beforeEach(() => {
      controller.startGame();
      vi.clearAllMocks();
    });

    it("should increment score when correct taxi is clicked first", () => {
      const factPair = getFactPairByIndex(0);
      const correctFactIndex = getCorrectFactIndex(factPair);
      const isFact1OnTaxi1 = true;
      const correctTaxi = correctFactIndex === 1 ? 1 : 2;

      mockView.getCurrentFactIndex = vi.fn(() => 0);
      mockView.isFact1OnTaxi1 = vi.fn(() => isFact1OnTaxi1);

      // Simulate clicking the correct taxi
      const initialScore = controller.getFinalScore();

      // Access private method via type assertion (for testing)
      (controller as any).handleTaxiClick(correctTaxi);

      expect(mockView.updateScore).toHaveBeenCalled();
      expect(controller.getFinalScore()).toBeGreaterThan(initialScore);
    });

    it("should not increment score when wrong taxi is clicked", () => {
      const factPair = getFactPairByIndex(0);
      const correctFactIndex = getCorrectFactIndex(factPair);
      const isFact1OnTaxi1 = true;
      const correctTaxi = correctFactIndex === 1 ? 1 : 2;
      const wrongTaxi = correctTaxi === 1 ? 2 : 1;

      mockView.getCurrentFactIndex = vi.fn(() => 0);
      mockView.isFact1OnTaxi1 = vi.fn(() => isFact1OnTaxi1);

      const initialScore = controller.getFinalScore();

      (controller as any).handleTaxiClick(wrongTaxi);

      expect(controller.getFinalScore()).toBe(initialScore);
      expect(mockView.highlightTaxiWrong).toHaveBeenCalledWith(wrongTaxi);
    });

    it("should lock round when wrong taxi is clicked first", () => {
      const factPair = getFactPairByIndex(0);
      const correctFactIndex = getCorrectFactIndex(factPair);
      const isFact1OnTaxi1 = true;
      const correctTaxi = correctFactIndex === 1 ? 1 : 2;
      const wrongTaxi = correctTaxi === 1 ? 2 : 1;

      mockView.getCurrentFactIndex = vi.fn(() => 0);
      mockView.isFact1OnTaxi1 = vi.fn(() => isFact1OnTaxi1);

      // Click wrong taxi first
      (controller as any).handleTaxiClick(wrongTaxi);
      const scoreAfterWrong = controller.getFinalScore();

      // Then click correct taxi
      (controller as any).handleTaxiClick(correctTaxi);

      // Score should not increase after correct click if round was locked
      expect(controller.getFinalScore()).toBe(scoreAfterWrong);
    });
  });

  describe("getFinalScore()", () => {
    it("should return current score from model", () => {
      expect(controller.getFinalScore()).toBe(0);
    });
  });
});
