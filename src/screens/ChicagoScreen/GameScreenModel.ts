import type { Museum, MuseumFact } from "./Museum.ts";
import { CHICAGO_MUSEUMS, CHICAGO_MUSEUM_FACTS } from "./ChicagoMuseums.ts";

/**
 * GameScreenModel - Manages museum fact matching game state
 */
export class GameScreenModel {
  private museums: Museum[] = [];
  private facts: MuseumFact[] = [];
  private currentIndex = 0;
  private matchedMuseumIds: Set<string> = new Set();

  /**
   * Prepare data for a new game session
   */
  reset(): void {
    this.museums = [...CHICAGO_MUSEUMS];
    this.facts = this.shuffle([...CHICAGO_MUSEUM_FACTS]);
    this.currentIndex = 0;
    this.matchedMuseumIds.clear();
  }

  /**
   * Retrieve museums to display around the circle
   */
  getMuseums(): Museum[] {
    return this.museums;
  }

  /**
   * Get the fact active in the center card
   */
  getCurrentFact(): MuseumFact | null {
    return this.facts[this.currentIndex] ?? null;
  }

  hasNextFact(): boolean {
    return this.currentIndex + 1 < this.facts.length;
  }

  markCurrentFactMatched(museumId: string): void {
    this.matchedMuseumIds.add(museumId);
  }

  advanceToNextFact(): MuseumFact | null {
    if (!this.hasNextFact()) {
      this.currentIndex = this.facts.length;
      return null;
    }
    this.currentIndex++;
    return this.getCurrentFact();
  }

  getMatchedCount(): number {
    return this.matchedMuseumIds.size;
  }

  getTotalFacts(): number {
    return this.facts.length;
  }

  /**
   * Has this museum already been matched?
   */
  isMuseumMatched(museumId: string): boolean {
    return this.matchedMuseumIds.has(museumId);
  }

  /**
   * Is the game complete?
   */
  isComplete(): boolean {
    return this.currentIndex >= this.facts.length;
  }

  /**
   * Shuffle facts so each game feels fresh
   */
  private shuffle<T>(items: T[]): T[] {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
}
