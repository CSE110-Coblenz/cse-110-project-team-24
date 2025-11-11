/**
 * GameScreenModel - Manages game state for the memory matching game
 * 
 * The Model is responsible for:
 * - Tracking which presidents and accomplishments have been matched
 * - Counting how many matches have been found
 * - Determining when the game is complete
 * 
 * The Model does NOT handle visual display - that's the View's job.
 * The Model does NOT handle game logic - that's the Controller's job.
 */
export class GameScreenModel {
	// Track how many matches have been found (0 to totalPairs)
	private matchesFound = 0;
	// Total number of pairs to match (8 pairs = 16 cards)
	private totalPairs: number;
	// Set of presidents that have been successfully matched
	// Using a Set for fast lookup (O(1) instead of O(n) for arrays)
	private matchedPresidents: Set<string> = new Set();
	// Set of accomplishments that have been successfully matched
	private matchedAccomplishments: Set<string> = new Set();

	/**
	 * Constructor - Initialize the model with the total number of pairs
	 * 
	 * @param totalPairs - Number of president-accomplishment pairs (default: 8)
	 */
	constructor(totalPairs: number = 8) {
		this.totalPairs = totalPairs;
	}

	/**
	 * Reset game state for a new game
	 * 
	 * Clears all matches and resets counters to start a fresh game
	 */
	reset(): void {
		// Reset match counter
		this.matchesFound = 0;
		// Clear all matched presidents
		this.matchedPresidents.clear();
		// Clear all matched accomplishments
		this.matchedAccomplishments.clear();
	}

	/**
	 * Record a successful match
	 * 
	 * Called by the Controller when a valid president-accomplishment pair is found.
	 * Updates the model state to track this match.
	 * 
	 * @param president - The president that was matched
	 * @param accomplishment - The accomplishment that was matched
	 */
	recordMatch(president: string, accomplishment: string): void {
		// Block 1: Prevent duplicate matches - only record if not already matched
		if (!this.isMatched(president, accomplishment)) {
			// Block 2: Increment the match counter
			this.matchesFound++;
			// Block 3: Add this president to the matched set
			this.matchedPresidents.add(president);
			// Block 4: Add this accomplishment to the matched set
			this.matchedAccomplishments.add(accomplishment);
		}
	}

	/**
	 * Check if a president has been matched
	 * 
	 * Used by the Controller to prevent clicking already-matched cards
	 * 
	 * @param president - The president name to check
	 * @returns true if this president has been matched, false otherwise
	 */
	isPresidentMatched(president: string): boolean {
		return this.matchedPresidents.has(president);
	}

	/**
	 * Check if an accomplishment has been matched
	 * 
	 * Used by the Controller to prevent clicking already-matched cards
	 * 
	 * @param accomplishment - The accomplishment text to check
	 * @returns true if this accomplishment has been matched, false otherwise
	 */
	isAccomplishmentMatched(accomplishment: string): boolean {
		return this.matchedAccomplishments.has(accomplishment);
	}

	/**
	 * Check if a specific president-accomplishment pair has been matched
	 * 
	 * Used internally to prevent duplicate match recording
	 * 
	 * @param president - The president name
	 * @param accomplishment - The accomplishment text
	 * @returns true if this specific pair has been matched, false otherwise
	 */
	isMatched(president: string, accomplishment: string): boolean {
		// Both the president AND accomplishment must be in their respective matched sets
		return (
			this.matchedPresidents.has(president) &&
			this.matchedAccomplishments.has(accomplishment)
		);
	}

	/**
	 * Get number of matches found
	 * 
	 * Used by the Controller to update the progress display
	 * 
	 * @returns The number of matches found (0 to totalPairs)
	 */
	getMatchesFound(): number {
		return this.matchesFound;
	}

	/**
	 * Get total number of pairs to match
	 * 
	 * Used by the Controller to display progress (e.g., "Matches: 3/8")
	 * 
	 * @returns The total number of pairs (8)
	 */
	getTotalPairs(): number {
		return this.totalPairs;
	}

	/**
	 * Check if all pairs have been matched (game complete)
	 * 
	 * Called by the Controller to determine when to end the game
	 * 
	 * @returns true if all pairs have been matched, false otherwise
	 */
	isGameComplete(): boolean {
		return this.matchesFound >= this.totalPairs;
	}
}
