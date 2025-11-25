import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel } from "../../../src/screens/DCScreen/GameScreenModel.ts";

describe("GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel(8); // 8 pairs for DC game
  });

  describe("constructor", () => {
    it("should initialize with default totalPairs", () => {
      const defaultModel = new GameScreenModel();
      expect(defaultModel.getTotalPairs()).toBe(8);
      expect(defaultModel.getMatchesFound()).toBe(0);
      expect(defaultModel.isGameComplete()).toBe(false);
    });

    it("should initialize with custom totalPairs", () => {
      const customModel = new GameScreenModel(10);
      expect(customModel.getTotalPairs()).toBe(10);
      expect(customModel.getMatchesFound()).toBe(0);
    });
  });

  describe("reset()", () => {
    it("should reset matches, matched sets, and counters", () => {
      // Record some matches first
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      model.recordMatch("Abraham Lincoln", "Issued the Emancipation Proclamation");
      expect(model.getMatchesFound()).toBe(2);

      model.reset();

      expect(model.getMatchesFound()).toBe(0);
      expect(model.isPresidentMatched("George Washington")).toBe(false);
      expect(model.isAccomplishmentMatched("Established Washington, D.C. as the capital")).toBe(false);
      expect(model.isGameComplete()).toBe(false);
    });
  });

  describe("recordMatch()", () => {
    it("should increment matches and add to matched sets", () => {
      expect(model.getMatchesFound()).toBe(0);

      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");

      expect(model.getMatchesFound()).toBe(1);
      expect(model.isPresidentMatched("George Washington")).toBe(true);
      expect(model.isAccomplishmentMatched("Established Washington, D.C. as the capital")).toBe(true);
    });

    it("should prevent duplicate matches", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      expect(model.getMatchesFound()).toBe(1);

      // Try to record the same match again
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");

      expect(model.getMatchesFound()).toBe(1); // Should still be 1
    });

    it("should allow different matches", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      model.recordMatch("Abraham Lincoln", "Issued the Emancipation Proclamation");

      expect(model.getMatchesFound()).toBe(2);
      expect(model.isPresidentMatched("George Washington")).toBe(true);
      expect(model.isPresidentMatched("Abraham Lincoln")).toBe(true);
    });
  });

  describe("isPresidentMatched()", () => {
    it("should return false for unmatched president", () => {
      expect(model.isPresidentMatched("George Washington")).toBe(false);
    });

    it("should return true for matched president", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      expect(model.isPresidentMatched("George Washington")).toBe(true);
    });
  });

  describe("isAccomplishmentMatched()", () => {
    it("should return false for unmatched accomplishment", () => {
      expect(model.isAccomplishmentMatched("Established Washington, D.C. as the capital")).toBe(false);
    });

    it("should return true for matched accomplishment", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      expect(model.isAccomplishmentMatched("Established Washington, D.C. as the capital")).toBe(true);
    });
  });

  describe("isMatched()", () => {
    it("should return false for unmatched pair", () => {
      expect(model.isMatched("George Washington", "Established Washington, D.C. as the capital")).toBe(false);
    });

    it("should return true for matched pair", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      expect(model.isMatched("George Washington", "Established Washington, D.C. as the capital")).toBe(true);
    });

    it("should return false if only president is matched", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      // Check with different accomplishment
      expect(model.isMatched("George Washington", "Issued the Emancipation Proclamation")).toBe(false);
    });

    it("should return false if only accomplishment is matched", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      // Check with different president
      expect(model.isMatched("Abraham Lincoln", "Established Washington, D.C. as the capital")).toBe(false);
    });
  });

  describe("getMatchesFound()", () => {
    it("should return 0 initially", () => {
      expect(model.getMatchesFound()).toBe(0);
    });

    it("should return correct count after matches", () => {
      model.recordMatch("George Washington", "Established Washington, D.C. as the capital");
      expect(model.getMatchesFound()).toBe(1);

      model.recordMatch("Abraham Lincoln", "Issued the Emancipation Proclamation");
      expect(model.getMatchesFound()).toBe(2);
    });
  });

  describe("getTotalPairs()", () => {
    it("should return the total number of pairs", () => {
      expect(model.getTotalPairs()).toBe(8);
    });
  });

  describe("isGameComplete()", () => {
    it("should return false initially", () => {
      expect(model.isGameComplete()).toBe(false);
    });

    it("should return false when not all pairs matched", () => {
      // Match 7 out of 8 pairs
      const presidents = [
        "George Washington",
        "Abraham Lincoln",
        "Thomas Jefferson",
        "Franklin D. Roosevelt",
        "John F. Kennedy",
        "Theodore Roosevelt",
        "Ronald Reagan",
      ];
      const accomplishments = [
        "Established Washington, D.C. as the capital",
        "Issued the Emancipation Proclamation",
        "Author of the Declaration of Independence",
        "Led the nation through the Great Depression and WWII",
        "Initiated the Apollo space program",
        "Established many national parks and conservation programs",
        "Played key role in ending the Cold War",
      ];

      for (let i = 0; i < 7; i++) {
        model.recordMatch(presidents[i], accomplishments[i]);
      }

      expect(model.isGameComplete()).toBe(false);
    });

    it("should return true when all pairs matched", () => {
      // Match all 8 pairs
      const pairs = [
        { president: "George Washington", accomplishment: "Established Washington, D.C. as the capital" },
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

      expect(model.isGameComplete()).toBe(true);
      expect(model.getMatchesFound()).toBe(8);
    });
  });
});

