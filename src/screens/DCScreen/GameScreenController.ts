import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { GameScreenModel } from "./GameScreenModel.ts";
import { GameScreenView } from "./GameScreenView.ts";
import { DC_PRESIDENT_PAIRS, isValidMatch } from "./DCPresidents.ts";

/**
 * GameScreenController - Coordinates game logic for the memory matching game
 * 
 * The Controller acts as the coordinator between the Model (game state) and View (UI).
 * It handles user interactions (card clicks) and determines game flow.
 */
export class GameScreenController extends ScreenController {
	// Model: Manages game state (matches found, which cards are matched)
	private model: GameScreenModel;
	// View: Handles all visual rendering and user interface
	private view: GameScreenView;
	// ScreenSwitcher: Allows navigation to other screens (like results screen)
	private screenSwitcher: ScreenSwitcher;

	// Track currently flipped cards - stores up to 2 cards that are face-up
	// Each entry contains: card type (president/accomplishment), value (text), and index in grid
	private flippedCards: Array<{ type: "president" | "accomplishment"; value: string; cardIndex: number }> = [];
	// Prevent multiple card clicks while checking if two cards match
	private isProcessingMatch: boolean = false;
	// Timer interval ID for the countdown timer
	private timerInterval: number | null = null;
	// Callback function to notify the main app of game results
	private onGameResult: ((result: "win" | "loss") => void) | null = null;

	/**
	 * Constructor - Sets up the controller with model and view
	 * 
	 * @param screenSwitcher - Used to navigate to other screens when game ends
	 */
	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		// TODO: Connect onGameResult callback to game state handler
		// This will be called when game ends with "win" or "loss"
		// Example: this.onGameResult = (result) => gameStateHandler.handleDCResult(result);

		// Initialize model with the total number of president pairs (8 pairs = 16 cards)
		this.model = new GameScreenModel(DC_PRESIDENT_PAIRS.length);

		// Create view and pass callback functions:
		// 1. Card click handler - called when a card is clicked
		// 2. Home button handler - called when user clicks "Return to Home" in completion popup
		this.view = new GameScreenView(
			(cardIndex, cardType, value) => this.handleCardClick(cardIndex, cardType, value),
			() => this.returnToHome()
		);
	}

	/**
	 * Start the game - Called when navigating to the DC screen
	 * 
	 * Resets all game state and displays the shuffled card grid
	 */
	startGame(): void {
		// Stop any existing timer
		this.stopTimer();

		// Reset model state: clear all matches and matched cards
		this.model.reset();
		// Clear any flipped cards from previous game
		this.flippedCards = [];
		// Allow card clicks again
		this.isProcessingMatch = false;

		// Initialize the view: create and shuffle the card grid
		this.view.initializeGame(DC_PRESIDENT_PAIRS);
		// Update the matches display (shows "Matches: 0/8")
		this.view.updateMatches(this.model.getMatchesFound(), this.model.getTotalPairs());
		// Update the timer display (shows "Time: 90s")
		this.view.updateTimer(this.model.getTimeRemaining());
		// Make the game screen visible
		this.view.show();

		// Start the countdown timer
		this.startTimer();
	}

	/**
	 * Handle card click event - Called when user clicks a card in the view
	 * 
	 * This method:
	 * 1. Validates that the card can be clicked (not already flipped/matched)
	 * 2. Flips the card to show its face
	 * 3. If two cards are now flipped, checks if they match
	 * 
	 * @param cardIndex - Index of the card in the grid (0-15)
	 * @param cardType - Type of card ("president" or "accomplishment")
	 * @param value - The president name or accomplishment text
	 */
	private handleCardClick(cardIndex: number, cardType: "president" | "accomplishment", value: string): void {
		// Block 0: Don't allow clicks if game has ended
		if (this.model.hasGameEnded()) {
			return;
		}

		// Block 1: Validation - Don't process if:
		// - Already checking a match (prevents rapid clicking)
		// - Card is already face-up
		// - Card is already matched (shouldn't be clickable)
		if (this.isProcessingMatch || this.view.isCardFlipped(cardIndex) || this.view.isCardMatched(cardIndex)) {
			return;
		}

		// Block 2: Check if this card was already matched in a previous turn
		// If the president or accomplishment was already matched, ignore the click
		if (
			(cardType === "president" && this.model.isPresidentMatched(value)) ||
			(cardType === "accomplishment" && this.model.isAccomplishmentMatched(value))
		) {
			return;
		}

		// Block 3: Flip the card - Tell the view to show the card's face
		this.view.flipCard(cardIndex);
		// Store this card in our flipped cards array
		this.flippedCards.push({ type: cardType, value, cardIndex });

		// Block 4: Check for match - If we now have 2 cards flipped, check if they match
		if (this.flippedCards.length === 2) {
			// Prevent more clicks while we're checking
			this.isProcessingMatch = true;
			// Wait 1 second so player can see both cards, then check if they match
			setTimeout(() => this.checkMatch(), 1000);
		}
	}

	/**
	 * Check if the two flipped cards form a valid match
	 * 
	 * This method:
	 * 1. Validates we have one president and one accomplishment
	 * 2. Checks if they form a valid pair (e.g., "George Washington" matches "Established Washington, D.C.")
	 * 3. If match: marks cards as matched, updates progress
	 * 4. If no match: flips cards back face-down
	 */
	private checkMatch(): void {
		// Block 1: Safety check - ensure we have exactly 2 flipped cards
		if (this.flippedCards.length !== 2) {
			this.isProcessingMatch = false;
			return;
		}

		const [card1, card2] = this.flippedCards;

		// Block 2: Validate card types - Must have one president and one accomplishment
		// If both are the same type (both presidents or both accomplishments), they can't match
		if (card1.type === card2.type) {
			// Not a valid pair - flip both cards back face-down
			this.view.flipCardBack(card1.cardIndex);
			this.view.flipCardBack(card2.cardIndex);
			this.flippedCards = [];
			this.isProcessingMatch = false;
			return;
		}

		// Block 3: Identify which card is the president and which is the accomplishment
		const presidentCard = card1.type === "president" ? card1 : card2;
		const accomplishmentCard = card1.type === "accomplishment" ? card1 : card2;

		// Block 4: Check if they form a valid match using the data file
		// isValidMatch() checks if this president-accomplishment pair exists in our data
		if (isValidMatch(presidentCard.value, accomplishmentCard.value)) {
			// Block 4a: Valid match found!
			// Update the model to record this match
			this.model.recordMatch(presidentCard.value, accomplishmentCard.value);
			// Tell the view to mark these cards as matched (they stay face-up and turn green)
			this.view.markCardsAsMatched(presidentCard.cardIndex, accomplishmentCard.cardIndex);
			// Update the matches counter display (e.g., "Matches: 3/8")
			this.view.updateMatches(this.model.getMatchesFound(), this.model.getTotalPairs());

			// Block 4b: Check if all pairs have been matched (game complete)
			if (this.model.isGameComplete()) {
				// Stop the timer
				this.stopTimer();
				// Mark game as ended
				this.model.setGameEnded();
				// Wait 2 seconds so player can see the final match, then end the game
				setTimeout(() => this.endGame("win"), 2000);
			}
		} else {
			// Block 5: Not a match - flip both cards back face-down
			this.view.flipCardBack(presidentCard.cardIndex);
			this.view.flipCardBack(accomplishmentCard.cardIndex);
		}

		// Block 6: Clean up - clear the flipped cards array and allow clicks again
		this.flippedCards = [];
		this.isProcessingMatch = false;
	}

	/**
	 * Start the countdown timer
	 * 
	 * Updates the timer every second and checks for time expiration
	 */
	private startTimer(): void {
		// Clear any existing timer
		this.stopTimer();

		// Update timer every second
		this.timerInterval = window.setInterval(() => {
			// Don't update if game has ended
			if (this.model.hasGameEnded()) {
				return;
			}

			// Decrement timer
			const timeRemaining = this.model.decrementTimer();
			// Update the timer display
			this.view.updateTimer(timeRemaining);

			// Check if time has run out
			if (this.model.isTimeUp()) {
				// Stop the timer
				this.stopTimer();
				// Mark game as ended
				this.model.setGameEnded();
				// End the game with a loss
				this.endGame("loss");
			}
		}, 1000);
	}

	/**
	 * Stop the countdown timer
	 */
	private stopTimer(): void {
		if (this.timerInterval !== null) {
			clearInterval(this.timerInterval);
			this.timerInterval = null;
		}
	}

	/**
	 * End the game - Called when game is complete (win or lose)
	 * 
	 * Shows a completion popup in the view and notifies the game state handler of the result
	 * 
	 * @param result - "win" if all pairs matched, "loss" if time ran out
	 */
	private endGame(result: "win" | "loss"): void {
		// Show the completion popup in the view with the appropriate message
		this.view.showCompletionPopup(result);

		// Notify the game state handler of the game result
		// TODO: Connect this to your game state handler
		// When implemented, this will:
		// - On win: Award postcard for Washington DC
		// - On loss: Deduct a life
		if (this.onGameResult) {
			this.onGameResult(result);
		}
	}

	/**
	 * Return to home screen - Called when user clicks "Return to Home" button
	 * 
	 * Navigates back to the home screen (map view)
	 */
	private returnToHome(): void {
		this.screenSwitcher.switchToScreen({ type: "home" });
	}

	/**
	 * Get final score - Required by interface but returns 0 since scoring is removed
	 */
	getFinalScore(): number {
		return 0;
	}

	/**
	 * Get the view - Required by ScreenController interface
	 * 
	 * @returns The GameScreenView instance
	 */
	getView(): GameScreenView {
		return this.view;
	}

	/**
	 * Hide the game screen - Override to stop timer when hiding
	 */
	hide(): void {
		// Stop the timer when hiding the screen
		this.stopTimer();
		super.hide();
	}
}
