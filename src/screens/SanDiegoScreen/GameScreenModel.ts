/**
 * GameScreenModel - Manages Wordle game state
 */

// San Diego themed 5-letter words
const WORD_BANK = [
  "BEACH",
  "OCEAN",
  "COAST",
  "WAVES",
  "PIERS",
  "BALBO", // Balboa Park
  "ZOO",
  "BAY",
];

export type LetterState = "correct" | "wrong-position" | "not-in-word" | "empty";

export interface GuessResult {
  letters: string[];
  states: LetterState[];
}

export class GameScreenModel {
  private targetWord: string = "";
  private currentGuess: string = "";
  private guesses: GuessResult[] = [];
  private maxGuesses: number = 6;
  private wordLength: number = 5;
  private gameWon: boolean = false;
  private gameOver: boolean = false;

  /**
   * Reset game state for a new game
   */
  reset(): void {
    // Pick a random word from the bank (only use 5-letter words)
    const fiveLetterWords = WORD_BANK.filter(word => word.length === 5);
    this.targetWord = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)].toUpperCase();
    this.currentGuess = "";
    this.guesses = [];
    this.gameWon = false;
    this.gameOver = false;
  }

  /**
   * Get the current target word (for debugging, can be removed)
   */
  getTargetWord(): string {
    return this.targetWord;
  }

  /**
   * Add a letter to the current guess
   */
  addLetter(letter: string): boolean {
    if (this.gameOver || this.currentGuess.length >= this.wordLength) {
      return false;
    }
    this.currentGuess += letter.toUpperCase();
    return true;
  }

  /**
   * Remove the last letter from the current guess
   */
  removeLetter(): void {
    if (this.currentGuess.length > 0) {
      this.currentGuess = this.currentGuess.slice(0, -1);
    }
  }

  /**
   * Get the current guess
   */
  getCurrentGuess(): string {
    return this.currentGuess;
  }

  /**
   * Submit the current guess
   * Accepts any 5-letter input (no word validation)
   */
  submitGuess(): boolean {
    if (this.currentGuess.length !== this.wordLength) {
      return false; // Guess not complete
    }

    if (this.gameOver) {
      return false;
    }

    // Calculate letter states (accept any 5-letter input)
    const states: LetterState[] = new Array(this.wordLength).fill("not-in-word");
    const targetLetters = this.targetWord.split("");
    const guessLetters = this.currentGuess.split("");
    const usedTargetIndices = new Set<number>();
    const usedGuessIndices = new Set<number>();

    // First pass: find correct positions (green)
    for (let i = 0; i < this.wordLength; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        states[i] = "correct";
        usedTargetIndices.add(i);
        usedGuessIndices.add(i);
      }
    }

    // Second pass: find wrong positions (yellow)
    for (let i = 0; i < this.wordLength; i++) {
      if (usedGuessIndices.has(i)) continue;
      
      for (let j = 0; j < this.wordLength; j++) {
        if (usedTargetIndices.has(j)) continue;
        if (guessLetters[i] === targetLetters[j]) {
          states[i] = "wrong-position";
          usedTargetIndices.add(j);
          usedGuessIndices.add(i);
          break;
        }
      }
    }

    // Add guess to history
    this.guesses.push({
      letters: guessLetters,
      states: states,
    });

    // Check if won
    if (this.currentGuess === this.targetWord) {
      this.gameWon = true;
      this.gameOver = true;
    } else if (this.guesses.length >= this.maxGuesses) {
      this.gameOver = true;
    }

    // Reset current guess for next round
    this.currentGuess = "";
    return true;
  }

  /**
   * Get all guesses
   */
  getGuesses(): GuessResult[] {
    return this.guesses;
  }

  /**
   * Check if game is won
   */
  isGameWon(): boolean {
    return this.gameWon;
  }

  /**
   * Check if game is over
   */
  isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * Get number of guesses made
   */
  getGuessCount(): number {
    return this.guesses.length;
  }

  /**
   * Get max guesses allowed
   */
  getMaxGuesses(): number {
    return this.maxGuesses;
  }
}
