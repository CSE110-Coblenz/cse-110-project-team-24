import { describe, it, expect } from "vitest";
import {
  DC_PRESIDENT_PAIRS,
  isValidMatch,
  getAllPresidents,
  getAllAccomplishments,
  getAccomplishmentForPresident,
  getPresidentForAccomplishment,
  getFunFact,
} from "../../../src/screens/DCScreen/DCPresidents.ts";

describe("DCPresidents", () => {
  describe("isValidMatch()", () => {
    it("should return true for valid president-accomplishment pairs", () => {
      expect(isValidMatch("George Washington", "Established Washington, D.C. as the capital")).toBe(true);
      expect(isValidMatch("Abraham Lincoln", "Issued the Emancipation Proclamation")).toBe(true);
      expect(isValidMatch("Barack Obama", "First African American president")).toBe(true);
    });

    it("should return false for invalid pairs", () => {
      expect(isValidMatch("George Washington", "Issued the Emancipation Proclamation")).toBe(false);
      expect(isValidMatch("Abraham Lincoln", "Established Washington, D.C. as the capital")).toBe(false);
      expect(isValidMatch("Nonexistent President", "Some accomplishment")).toBe(false);
    });

    it("should return false for empty strings", () => {
      expect(isValidMatch("", "")).toBe(false);
      expect(isValidMatch("George Washington", "")).toBe(false);
      expect(isValidMatch("", "Established Washington, D.C. as the capital")).toBe(false);
    });
  });

  describe("getAllPresidents()", () => {
    it("should return all presidents from pairs", () => {
      const presidents = getAllPresidents();
      expect(presidents.length).toBe(DC_PRESIDENT_PAIRS.length);
      expect(presidents).toContain("George Washington");
      expect(presidents).toContain("Abraham Lincoln");
      expect(presidents).toContain("Barack Obama");
    });

    it("should return unique presidents", () => {
      const presidents = getAllPresidents();
      const uniquePresidents = new Set(presidents);
      expect(presidents.length).toBe(uniquePresidents.size);
    });
  });

  describe("getAllAccomplishments()", () => {
    it("should return all accomplishments from pairs", () => {
      const accomplishments = getAllAccomplishments();
      expect(accomplishments.length).toBe(DC_PRESIDENT_PAIRS.length);
      expect(accomplishments).toContain("Established Washington, D.C. as the capital");
      expect(accomplishments).toContain("Issued the Emancipation Proclamation");
      expect(accomplishments).toContain("First African American president");
    });

    it("should return unique accomplishments", () => {
      const accomplishments = getAllAccomplishments();
      const uniqueAccomplishments = new Set(accomplishments);
      expect(accomplishments.length).toBe(uniqueAccomplishments.size);
    });
  });

  describe("getAccomplishmentForPresident()", () => {
    it("should return correct accomplishment for valid president", () => {
      expect(getAccomplishmentForPresident("George Washington")).toBe("Established Washington, D.C. as the capital");
      expect(getAccomplishmentForPresident("Abraham Lincoln")).toBe("Issued the Emancipation Proclamation");
      expect(getAccomplishmentForPresident("Barack Obama")).toBe("First African American president");
    });

    it("should return undefined for invalid president", () => {
      expect(getAccomplishmentForPresident("Nonexistent President")).toBeUndefined();
      expect(getAccomplishmentForPresident("")).toBeUndefined();
    });
  });

  describe("getPresidentForAccomplishment()", () => {
    it("should return correct president for valid accomplishment", () => {
      expect(getPresidentForAccomplishment("Established Washington, D.C. as the capital")).toBe("George Washington");
      expect(getPresidentForAccomplishment("Issued the Emancipation Proclamation")).toBe("Abraham Lincoln");
      expect(getPresidentForAccomplishment("First African American president")).toBe("Barack Obama");
    });

    it("should return undefined for invalid accomplishment", () => {
      expect(getPresidentForAccomplishment("Nonexistent accomplishment")).toBeUndefined();
      expect(getPresidentForAccomplishment("")).toBeUndefined();
    });
  });

  describe("getFunFact()", () => {
    it("should return fun fact for valid pair", () => {
      const funFact = getFunFact("George Washington", "Established Washington, D.C. as the capital");
      expect(funFact).toBeDefined();
      expect(typeof funFact).toBe("string");
      expect(funFact?.length).toBeGreaterThan(0);
    });

    it("should return undefined for invalid pair", () => {
      expect(getFunFact("George Washington", "Issued the Emancipation Proclamation")).toBeUndefined();
      expect(getFunFact("Nonexistent President", "Some accomplishment")).toBeUndefined();
    });

    it("should return fun fact for all pairs that have one", () => {
      DC_PRESIDENT_PAIRS.forEach((pair) => {
        if (pair.funFact) {
          const funFact = getFunFact(pair.president, pair.accomplishment);
          expect(funFact).toBe(pair.funFact);
        }
      });
    });
  });

  describe("DC_PRESIDENT_PAIRS data integrity", () => {
    it("should have 8 pairs", () => {
      expect(DC_PRESIDENT_PAIRS.length).toBe(8);
    });

    it("should have unique presidents", () => {
      const presidents = DC_PRESIDENT_PAIRS.map((p) => p.president);
      const uniquePresidents = new Set(presidents);
      expect(presidents.length).toBe(uniquePresidents.size);
    });

    it("should have unique accomplishments", () => {
      const accomplishments = DC_PRESIDENT_PAIRS.map((p) => p.accomplishment);
      const uniqueAccomplishments = new Set(accomplishments);
      expect(accomplishments.length).toBe(uniqueAccomplishments.size);
    });

    it("should have non-empty president names", () => {
      DC_PRESIDENT_PAIRS.forEach((pair) => {
        expect(pair.president.length).toBeGreaterThan(0);
      });
    });

    it("should have non-empty accomplishments", () => {
      DC_PRESIDENT_PAIRS.forEach((pair) => {
        expect(pair.accomplishment.length).toBeGreaterThan(0);
      });
    });
  });
});

