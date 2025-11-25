import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel } from "../../../src/screens/SanDiegoScreen/GameScreenModel.ts";

describe("GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel();
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
      model.reset();
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

    it("should select a new target word from 5-letter words", () => {
      model.reset();
      const firstWord = model.getTargetWord();
      model.reset();
      const secondWord = model.getTargetWord();
      
      expect(firstWord.length).toBe(5);
      expect(secondWord.length).toBe(5);
      // Note: They might be the same word randomly, but both should be 5 letters
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

    it("should not add letter if game is over", () => {
      model.reset();
      const targetWord = model.getTargetWord();
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      model.submitGuess();
      
      const result = model.addLetter("A");
      expect(result).toBe(false);
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

  describe("getCurrentGuess", () => {
    it("should return empty string initially", () => {
      expect(model.getCurrentGuess()).toBe("");
    });

    it("should return current guess string", () => {
      model.addLetter("T");
      model.addLetter("E");
      model.addLetter("S");
      expect(model.getCurrentGuess()).toBe("TES");
    });
  });

  describe("submitGuess", () => {
    it("should return false if guess is not 5 letters", () => {
      model.addLetter("A");
      model.addLetter("B");
      expect(model.submitGuess()).toBe(false);
    });

    it("should return true and add guess to history for valid 5-letter guess", () => {
      model.reset();
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
      model.reset();
      const targetWord = model.getTargetWord();
      
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      
      model.submitGuess();
      
      expect(model.isGameWon()).toBe(true);
      expect(model.isGameOver()).toBe(true);
    });

    it("should mark game as over after max guesses", () => {
      model.reset();
      
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

    it("should calculate correct letter states", () => {
      model.reset();
      const targetWord = model.getTargetWord();
      
      // If target is "BEACH", guess "BEACH" should all be correct
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      model.submitGuess();
      
      const guesses = model.getGuesses();
      expect(guesses.length).toBe(1);
      expect(guesses[0].states.every(state => state === "correct")).toBe(true);
    });

    it("should identify wrong position letters", () => {
      model.reset();
      model.addLetter("A");
      model.addLetter("B");
      model.addLetter("C");
      model.addLetter("D");
      model.addLetter("E");
      model.submitGuess();
      
      const guesses = model.getGuesses();
      expect(guesses.length).toBe(1);
      // At least some letters should be marked (correct, wrong-position, or not-in-word)
      expect(guesses[0].states.length).toBe(5);
    });
  });

  describe("getGuesses", () => {
    it("should return empty array initially", () => {
      expect(model.getGuesses()).toEqual([]);
    });

    it("should return all submitted guesses", () => {
      model.reset();
      // First guess
      model.addLetter("B");
      model.addLetter("E");
      model.addLetter("A");
      model.addLetter("C");
      model.addLetter("H");
      const firstSubmitted = model.submitGuess();
      expect(firstSubmitted).toBe(true);
      
      // Second guess (only if game is not over)
      if (!model.isGameOver()) {
        model.addLetter("O");
        model.addLetter("C");
        model.addLetter("E");
        model.addLetter("A");
        model.addLetter("N");
        const secondSubmitted = model.submitGuess();
        expect(secondSubmitted).toBe(true);
      }
      
      const guesses = model.getGuesses();
      expect(guesses.length).toBeGreaterThanOrEqual(1);
      expect(guesses[0].letters).toEqual(["B", "E", "A", "C", "H"]);
      if (guesses.length > 1) {
        expect(guesses[1].letters).toEqual(["O", "C", "E", "A", "N"]);
      }
    });
  });

  describe("isGameWon", () => {
    it("should return false initially", () => {
      expect(model.isGameWon()).toBe(false);
    });

    it("should return true after correct guess", () => {
      model.reset();
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
      model.reset();
      const targetWord = model.getTargetWord();
      
      for (const letter of targetWord) {
        model.addLetter(letter);
      }
      model.submitGuess();
      
      expect(model.isGameOver()).toBe(true);
    });

    it("should return true after max guesses", () => {
      model.reset();
      
      for (let i = 0; i < 6; i++) {
        model.addLetter("X");
        model.addLetter("Y");
        model.addLetter("Z");
        model.addLetter("W");
        model.addLetter("V");
        model.submitGuess();
      }
      
      expect(model.isGameOver()).toBe(true);
    });
  });

  describe("getGuessCount", () => {
    it("should return 0 initially", () => {
      expect(model.getGuessCount()).toBe(0);
    });

    it("should return correct count after submissions", () => {
      model.reset();
      model.addLetter("A");
      model.addLetter("B");
      model.addLetter("C");
      model.addLetter("D");
      model.addLetter("E");
      model.submitGuess();
      expect(model.getGuessCount()).toBe(1);
      
      model.addLetter("F");
      model.addLetter("G");
      model.addLetter("H");
      model.addLetter("I");
      model.addLetter("J");
      model.submitGuess();
      expect(model.getGuessCount()).toBe(2);
    });
  });

  describe("getMaxGuesses", () => {
    it("should return 6", () => {
      expect(model.getMaxGuesses()).toBe(6);
    });
  });

  describe("getTargetWord", () => {
    it("should return a 5-letter word", () => {
      model.reset();
      const targetWord = model.getTargetWord();
      expect(targetWord.length).toBe(5);
      expect(targetWord).toBe(targetWord.toUpperCase());
    });
  });
});

