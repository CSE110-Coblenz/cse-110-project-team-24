import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel } from "../../../src/screens/BostonScreen/GameScreenModel.ts";

describe("GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel();
  });

  describe("reset", () => {
    it("should reset score to 0", () => {
      model.incrementScore();
      expect(model.getScore()).toBe(1);
      
      model.reset();
      expect(model.getScore()).toBe(0);
    });

    it("should reset question index to 0", () => {
      model.goToNextQuestion();
      expect(model.getQuestionIndex()).toBe(1);
      
      model.reset();
      expect(model.getQuestionIndex()).toBe(0);
    });
  });

  describe("getCurrentQuestion", () => {
    it("should return the first question initially", () => {
      const question = model.getCurrentQuestion();
      expect(question.prompt).toContain("Boston Tea Party");
      expect(question.choices).toHaveLength(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
    });

    it("should return the correct question after advancing", () => {
      model.goToNextQuestion();
      const question = model.getCurrentQuestion();
      expect(question.prompt).toContain("famous trail");
    });
  });

  describe("getScore", () => {
    it("should return 0 initially", () => {
      expect(model.getScore()).toBe(0);
    });

    it("should return correct score after incrementing", () => {
      model.incrementScore();
      expect(model.getScore()).toBe(1);
      
      model.incrementScore();
      expect(model.getScore()).toBe(2);
    });
  });

  describe("getQuestionIndex", () => {
    it("should return 0 initially", () => {
      expect(model.getQuestionIndex()).toBe(0);
    });

    it("should return correct index after advancing", () => {
      model.goToNextQuestion();
      expect(model.getQuestionIndex()).toBe(1);
    });
  });

  describe("getTotalQuestions", () => {
    it("should return 5", () => {
      expect(model.getTotalQuestions()).toBe(5);
    });
  });

  describe("incrementScore", () => {
    it("should increment score by 1", () => {
      expect(model.getScore()).toBe(0);
      model.incrementScore();
      expect(model.getScore()).toBe(1);
    });
  });

  describe("hasNextQuestion", () => {
    it("should return true initially", () => {
      expect(model.hasNextQuestion()).toBe(true);
    });

    it("should return false on the last question", () => {
      // Advance to last question (4 moves from index 0 to 4)
      for (let i = 0; i < 4; i++) {
        model.goToNextQuestion();
      }
      expect(model.hasNextQuestion()).toBe(false);
    });
  });

  describe("goToNextQuestion", () => {
    it("should advance to the next question", () => {
      expect(model.getQuestionIndex()).toBe(0);
      model.goToNextQuestion();
      expect(model.getQuestionIndex()).toBe(1);
    });

    it("should not advance beyond the last question", () => {
      // Advance to last question
      for (let i = 0; i < 4; i++) {
        model.goToNextQuestion();
      }
      const lastIndex = model.getQuestionIndex();
      
      model.goToNextQuestion();
      expect(model.getQuestionIndex()).toBe(lastIndex);
    });
  });
});
