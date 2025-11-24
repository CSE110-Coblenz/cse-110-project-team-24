import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel } from "../../../src/screens/ChicagoScreen/GameScreenModel.ts";
import {
  CHICAGO_MUSEUMS,
  CHICAGO_MUSEUM_FACTS,
} from "../../../src/screens/ChicagoScreen/ChicagoMuseums.ts";

describe("GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel();
    model.reset(); // Initialize the model
  });

  describe("reset()", () => {
    it("should reset museums, facts, index, and matched set", () => {
      model.markCurrentFactMatched("museum1");
      model.advanceToNextFact();

      model.reset();

      expect(model.getMuseums().length).toBe(CHICAGO_MUSEUMS.length);
      expect(model.getCurrentFact()).not.toBeNull();
      expect(model.getMatchedCount()).toBe(0);
      expect(model.getCurrentFact()?.museumId).toBeDefined();
    });
  });

  describe("getMuseums()", () => {
    it("should return all museums", () => {
      const museums = model.getMuseums();
      expect(museums.length).toBe(CHICAGO_MUSEUMS.length);
      expect(museums).toEqual(expect.arrayContaining(CHICAGO_MUSEUMS));
    });
  });

  describe("getCurrentFact()", () => {
    it("should return current fact", () => {
      const fact = model.getCurrentFact();
      expect(fact).not.toBeNull();
      expect(fact?.fact).toBeDefined();
      expect(fact?.museumId).toBeDefined();
    });

    it("should return null when all facts processed", () => {
      model.reset();
      // Advance through all facts
      while (model.hasNextFact()) {
        model.advanceToNextFact();
      }
      model.advanceToNextFact(); // One more to complete
      expect(model.getCurrentFact()).toBeNull();
    });
  });

  describe("hasNextFact()", () => {
    it("should return true when more facts exist", () => {
      model.reset();
      expect(model.hasNextFact()).toBe(true);
    });

    it("should return false when on last fact", () => {
      model.reset();
      // Advance to second-to-last fact
      const totalFacts = model.getTotalFacts();
      for (let i = 0; i < totalFacts - 2; i++) {
        model.advanceToNextFact();
      }
      expect(model.hasNextFact()).toBe(true);

      model.advanceToNextFact();
      expect(model.hasNextFact()).toBe(false);
    });
  });

  describe("markCurrentFactMatched()", () => {
    it("should add museum to matched set", () => {
      const fact = model.getCurrentFact();
      if (!fact) return;

      model.markCurrentFactMatched(fact.museumId);

      expect(model.isMuseumMatched(fact.museumId)).toBe(true);
      expect(model.getMatchedCount()).toBe(1);
    });
  });

  describe("advanceToNextFact()", () => {
    it("should increment index and return next fact", () => {
      const firstFact = model.getCurrentFact();
      const nextFact = model.advanceToNextFact();

      expect(nextFact).not.toBeNull();
      if (firstFact && nextFact) {
        expect(nextFact.fact).not.toBe(firstFact.fact);
      }
    });

    it("should return null when no more facts", () => {
      model.reset();
      while (model.hasNextFact()) {
        model.advanceToNextFact();
      }
      const result = model.advanceToNextFact();
      expect(result).toBeNull();
    });
  });

  describe("getMatchedCount()", () => {
    it("should return number of matched museums", () => {
      expect(model.getMatchedCount()).toBe(0);

      const fact1 = model.getCurrentFact();
      if (fact1) {
        model.markCurrentFactMatched(fact1.museumId);
        expect(model.getMatchedCount()).toBe(1);
      }

      model.advanceToNextFact();
      const fact2 = model.getCurrentFact();
      if (fact2) {
        model.markCurrentFactMatched(fact2.museumId);
        expect(model.getMatchedCount()).toBe(2);
      }
    });
  });

  describe("isComplete()", () => {
    it("should return false initially", () => {
      expect(model.isComplete()).toBe(false);
    });

    it("should return true when all facts processed", () => {
      model.reset();
      while (model.hasNextFact()) {
        model.advanceToNextFact();
      }
      model.advanceToNextFact();
      expect(model.isComplete()).toBe(true);
    });
  });

  describe("isMuseumMatched()", () => {
    it("should return false for unmatched museum", () => {
      expect(model.isMuseumMatched("nonexistent")).toBe(false);
    });

    it("should return true for matched museum", () => {
      const fact = model.getCurrentFact();
      if (fact) {
        model.markCurrentFactMatched(fact.museumId);
        expect(model.isMuseumMatched(fact.museumId)).toBe(true);
      }
    });
  });

  describe("recordWrongGuess()", () => {
    it("should increment wrong guess count", () => {
      expect(model.getRemainingAttempts()).toBe(3);

      model.recordWrongGuess();
      expect(model.getRemainingAttempts()).toBe(2);

      model.recordWrongGuess();
      expect(model.getRemainingAttempts()).toBe(1);
    });

    it("should cap at max wrong guesses", () => {
      model.recordWrongGuess();
      model.recordWrongGuess();
      model.recordWrongGuess();
      model.recordWrongGuess(); // Should still be 3

      expect(model.getRemainingAttempts()).toBe(0);
      expect(model.hasAttemptsRemaining()).toBe(false);
    });
  });

  describe("getRemainingAttempts()", () => {
    it("should calculate remaining attempts correctly", () => {
      expect(model.getRemainingAttempts()).toBe(3);

      model.recordWrongGuess();
      expect(model.getRemainingAttempts()).toBe(2);

      model.recordWrongGuess();
      expect(model.getRemainingAttempts()).toBe(1);

      model.recordWrongGuess();
      expect(model.getRemainingAttempts()).toBe(0);
    });
  });

  describe("hasAttemptsRemaining()", () => {
    it("should return true when attempts remain", () => {
      expect(model.hasAttemptsRemaining()).toBe(true);

      model.recordWrongGuess();
      expect(model.hasAttemptsRemaining()).toBe(true);
    });

    it("should return false when max reached", () => {
      model.recordWrongGuess();
      model.recordWrongGuess();
      model.recordWrongGuess();

      expect(model.hasAttemptsRemaining()).toBe(false);
    });
  });
});
