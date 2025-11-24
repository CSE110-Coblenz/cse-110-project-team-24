import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/ChicagoScreen/GameScreenController.ts";
import { GameScreenModel } from "../../../src/screens/ChicagoScreen/GameScreenModel.ts";
import { GameScreenView } from "../../../src/screens/ChicagoScreen/GameScreenView.ts";
import { CHICAGO_MUSEUM_FACTS } from "../../../src/screens/ChicagoScreen/ChicagoMuseums.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";

// Mock the view
vi.mock("../../../src/screens/ChicagoScreen/GameScreenView.ts", () => {
  class MockGameScreenView {
    setMuseums = vi.fn();
    setFact = vi.fn();
    markMuseumMatched = vi.fn();
    showDetail = vi.fn();
    showPrompt = vi.fn();
    showNextButton = vi.fn();
    hideNextButton = vi.fn();
    lockFactCard = vi.fn();
    unlockFactCard = vi.fn();
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

      expect(mockView.setMuseums).toHaveBeenCalled();
      expect(mockView.hideNextButton).toHaveBeenCalled();
      expect(mockView.show).toHaveBeenCalled();
      expect(mockView.showPrompt).toHaveBeenCalled();
      expect(mockView.setFact).toHaveBeenCalled();
      expect(mockView.unlockFactCard).toHaveBeenCalled();
    });
  });

  describe("handleFactDrop()", () => {
    beforeEach(() => {
      controller.startGame();
      vi.clearAllMocks();
    });

    it("should mark museum as matched and show detail for correct match", () => {
      const model = (controller as any).model as GameScreenModel;
      const currentFact = model.getCurrentFact();
      if (!currentFact) return;

      (controller as any).handleFactDrop(currentFact.museumId);

      expect(mockView.markMuseumMatched).toHaveBeenCalledWith(
        currentFact.museumId
      );
      expect(mockView.showDetail).toHaveBeenCalledWith(currentFact.detail);
      expect(mockView.lockFactCard).toHaveBeenCalled();
      expect(mockView.showNextButton).toHaveBeenCalled();
    });

    it("should show try again message for wrong match", () => {
      const model = (controller as any).model as GameScreenModel;
      const currentFact = model.getCurrentFact();
      if (!currentFact) return;

      // Find a different museum ID
      const wrongMuseumId = CHICAGO_MUSEUM_FACTS.find(
        (f) => f.museumId !== currentFact.museumId
      )?.museumId;

      if (wrongMuseumId) {
        (controller as any).handleFactDrop(wrongMuseumId);

        expect(mockView.showDetail).toHaveBeenCalledWith(
          expect.stringContaining("Not quite")
        );
        expect(mockView.markMuseumMatched).not.toHaveBeenCalled();
      }
    });

    it("should end game after 3 wrong guesses", () => {
      const model = (controller as any).model as GameScreenModel;
      const currentFact = model.getCurrentFact();
      if (!currentFact) return;

      const wrongMuseumId = CHICAGO_MUSEUM_FACTS.find(
        (f) => f.museumId !== currentFact.museumId
      )?.museumId;

      if (wrongMuseumId) {
        // Make 3 wrong guesses
        (controller as any).handleFactDrop(wrongMuseumId);
        (controller as any).handleFactDrop(wrongMuseumId);
        (controller as any).handleFactDrop(wrongMuseumId);

        expect(mockView.showDetail).toHaveBeenCalledWith(
          expect.stringContaining("three misses")
        );
        expect(mockView.lockFactCard).toHaveBeenCalled();
        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
          type: "result",
          score: expect.any(Number),
        });
      }
    });
  });

  describe("handleNextRequest()", () => {
    beforeEach(() => {
      controller.startGame();
      vi.clearAllMocks();
    });

    it("should advance to next fact when more facts exist", () => {
      const model = (controller as any).model as GameScreenModel;
      if (!model.hasNextFact()) return;

      // First match a fact to enable next button
      const currentFact = model.getCurrentFact();
      if (currentFact) {
        (controller as any).handleFactDrop(currentFact.museumId);
        vi.clearAllMocks();
      }

      (controller as any).handleNextRequest();

      expect(mockView.hideNextButton).toHaveBeenCalled();
      expect(mockView.showPrompt).toHaveBeenCalled();
      expect(mockView.setFact).toHaveBeenCalled();
      expect(mockView.unlockFactCard).toHaveBeenCalled();
    });

    it("should end game when no more facts", () => {
      const model = (controller as any).model as GameScreenModel;

      // Advance through all facts
      while (model.hasNextFact()) {
        const fact = model.getCurrentFact();
        if (fact) {
          (controller as any).handleFactDrop(fact.museumId);
          (controller as any).handleNextRequest();
        }
      }

      // Now try next on last fact
      const lastFact = model.getCurrentFact();
      if (lastFact) {
        (controller as any).handleFactDrop(lastFact.museumId);
        vi.clearAllMocks();
        (controller as any).handleNextRequest();

        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
          type: "result",
          score: expect.any(Number),
        });
      }
    });
  });
});
