import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel } from "../../../src/screens/NewYorkScreen/GameScreenModel.ts";

describe("GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel();
  });

  describe("reset()", () => {
    it("should reset score to 0", () => {
      model.incrementScore();
      model.incrementScore();
      expect(model.getScore()).toBe(2);

      model.reset();
      expect(model.getScore()).toBe(0);
    });
  });

  describe("incrementScore()", () => {
    it("should increase score correctly", () => {
      expect(model.getScore()).toBe(0);

      model.incrementScore();
      expect(model.getScore()).toBe(1);

      model.incrementScore();
      expect(model.getScore()).toBe(2);
    });
  });

  describe("getScore()", () => {
    it("should return current score", () => {
      expect(model.getScore()).toBe(0);

      model.incrementScore();
      expect(model.getScore()).toBe(1);
    });
  });
});
