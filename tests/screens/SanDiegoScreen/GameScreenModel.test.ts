import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel } from "../../../src/screens/SanDiegoScreen/GameScreenModel.ts";

describe("GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel();
    model.reset();
  });

  describe("reset", () => {
    it("should reset current guess to empty string", () => {
      model.addLetter("A");
      model.addLetter("B");
      expect(model.getCurrentGuess()).toBe("AB");
      
      model.reset();
      expect(model.getCurrentGuess()).toBe("");
    });

    it("should reset guesses array", () => {
      model.addLetter("B");
      model.addLetter("E");
      model.addLetter("A");
      model.addLetter("C");
      model.addLetter("H");
      model.submitGuess();
      expect(model.getGuesses().length).toBe(1);
      
      model.reset();
      expect(model.getGuesses().length).toBe(0);
    });

    it("should reset game won and game over flags", () => {
      // Set up a winning scenario
      const targetWord = model.getTargetWord();
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      model.submitGuess();
      expect(model.isGameWon()).toBe(true);
      expect(model.isGameOver()).toBe(true);
      
      model.reset();
      expect(model.isGameWon()).toBe(false);
      expect(model.isGameOver()).toBe(false);
    });

    it("should select a 5-letter target word", () => {
      const targetWord = model.getTargetWord();
      expect(targetWord.length).toBe(5);
    });
  });

  describe("addLetter", () => {
    it("should add a letter to current guess", () => {
      expect(model.getCurrentGuess()).toBe("");
      model.addLetter("A");
      expect(model.getCurrentGuess()).toBe("A");
      model.addLetter("B");
      expect(model.getCurrentGuess()).toBe("AB");
    });

    it("should convert letters to uppercase", () => {
      model.addLetter("a");
      model.addLetter("b");
      expect(model.getCurrentGuess()).toBe("AB");
    });

    it("should not add letter if guess is already 5 letters", () => {
      model.addLetter("A");
      model.addLetter("B");
      model.addLetter("C");
      model.addLetter("D");
      model.addLetter("E");
      expect(model.getCurrentGuess().length).toBe(5);
      
      const result = model.addLetter("F");
      expect(result).toBe(false);
      expect(model.getCurrentGuess().length).toBe(5);
    });
  });

  describe("removeLetter", () => {
    it("should remove the last letter from current guess", () => {
      model.addLetter("A");
      model.addLetter("B");
      model.addLetter("C");
      expect(model.getCurrentGuess()).toBe("ABC");
      
      model.removeLetter();
      expect(model.getCurrentGuess()).toBe("AB");
      
      model.removeLetter();
      expect(model.getCurrentGuess()).toBe("A");
    });

    it("should not remove letter if guess is empty", () => {
      expect(model.getCurrentGuess()).toBe("");
      model.removeLetter();
      expect(model.getCurrentGuess()).toBe("");
    });
  });

  describe("submitGuess", () => {
    it("should return false if guess is not 5 letters", () => {
      model.addLetter("A");
      model.addLetter("B");
      expect(model.submitGuess()).toBe(false);
    });

    it("should return true and add guess to history for valid 5-letter guess", () => {
      model.addLetter("B");
      model.addLetter("E");
      model.addLetter("A");
      model.addLetter("C");
      model.addLetter("H");
      
      expect(model.getGuesses().length).toBe(0);
      const result = model.submitGuess();
      
      expect(result).toBe(true);
      expect(model.getGuesses().length).toBe(1);
      expect(model.getCurrentGuess()).toBe(""); // Should reset after submission
    });

    it("should mark game as won when guess matches target word", () => {
      const targetWord = model.getTargetWord();
      
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      
      model.submitGuess();
      
      expect(model.isGameWon()).toBe(true);
      expect(model.isGameOver()).toBe(true);
    });

    it("should mark game as over after max guesses", () => {
      // Submit 6 wrong guesses
      for (let i = 0; i < 6; i++) {
        model.addLetter("W");
        model.addLetter("R");
        model.addLetter("O");
        model.addLetter("N");
        model.addLetter("G");
        model.submitGuess();
      }
      
      expect(model.isGameOver()).toBe(true);
      expect(model.getGuesses().length).toBe(6);
    });
  });

  describe("getGuesses", () => {
    it("should return empty array initially", () => {
      expect(model.getGuesses()).toEqual([]);
    });

    it("should return all submitted guesses", () => {
      model.addLetter("B");
      model.addLetter("E");
      model.addLetter("A");
      model.addLetter("C");
      model.addLetter("H");
      model.submitGuess();
      
      const guesses = model.getGuesses();
      expect(guesses.length).toBe(1);
      expect(guesses[0].letters).toEqual(["B", "E", "A", "C", "H"]);
    });
  });

  describe("isGameWon", () => {
    it("should return false initially", () => {
      expect(model.isGameWon()).toBe(false);
    });

    it("should return true after correct guess", () => {
      const targetWord = model.getTargetWord();
      
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      model.submitGuess();
      
      expect(model.isGameWon()).toBe(true);
    });
  });

  describe("isGameOver", () => {
    it("should return false initially", () => {
      expect(model.isGameOver()).toBe(false);
    });

    it("should return true after winning", () => {
      const targetWord = model.getTargetWord();
      
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      model.submitGuess();
      
      expect(model.isGameOver()).toBe(true);
    });
  });

  describe("getGuessCount", () => {
    it("should return 0 initially", () => {
      expect(model.getGuessCount()).toBe(0);
    });

    it("should return correct count after submissions", () => {
      model.addLetter("A");
      model.addLetter("B");
      model.addLetter("C");
      model.addLetter("D");
      model.addLetter("E");
      model.submitGuess();
      expect(model.getGuessCount()).toBe(1);
    });
  });

  describe("getMaxGuesses", () => {
    it("should return 6", () => {
      expect(model.getMaxGuesses()).toBe(6);
    });
  });
});
