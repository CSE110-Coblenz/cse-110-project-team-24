/**
 * ResultsScreenModel - Stores final score for the session
 */
export class ResultsScreenModel {
  private finalScore = 0;

  /**
   * Set the final score
   */
  setFinalScore(score: number): void {
    this.finalScore = score;
  }

  /**
   * Get the final score
   */
  getFinalScore(): number {
    return this.finalScore;
  }
}
