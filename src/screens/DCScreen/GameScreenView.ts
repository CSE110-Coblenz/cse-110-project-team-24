import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { PresidentPair } from "./DCPresidents.ts";

/**
 * Card data structure for the view
 * 
 * Stores all information about a single card in the game:
 * - Type (president or accomplishment)
 * - Value (the text displayed on the card)
 * - State (flipped, matched)
 * - Konva visual elements (rectangles, text, groups)
 */
interface CardData {
	type: "president" | "accomplishment";
	value: string;
	cardIndex: number;
	isFlipped: boolean;
	isMatched: boolean;
	cardGroup: Konva.Group;
	backRect: Konva.Rect;
	frontRect: Konva.Rect;
	frontText: Konva.Text;
	typeLabel: Konva.Text;
}

/**
 * GameScreenView - Renders the memory matching card game UI using Konva
 * 
 * The View is responsible for:
 * - Displaying the card grid (4x4 = 16 cards)
 * - Handling card flip animations (showing/hiding card faces)
 * - Showing match progress (e.g., "Matches: 3/8")
 * - Calling the controller callback when cards are clicked
 * 
 * The View does NOT handle game logic - that's the Controller's job.
 * The View does NOT manage game state - that's the Model's job.
 */
export class GameScreenView implements View {
	// Main Konva group containing all visual elements
	private group: Konva.Group;
	// Callback function called when a card is clicked
	// Passed from the Controller to handle user interactions
	private cardClickHandler: (cardIndex: number, cardType: "president" | "accomplishment", value: string) => void;
	// Callback function called when user clicks "Return to Home" button
	// Passed from the Controller to handle navigation
	private homeButtonHandler: () => void;

	// Card grid properties
	private cards: CardData[] = []; // Array of all 16 cards
	private cardWidth = 180; // Width of each card in pixels
	private cardHeight = 120; // Height of each card in pixels
	private cardSpacing = 20; // Space between cards in pixels
	private gridCols = 4; // Number of columns in the grid (4x4 = 16 cards)

	// UI elements
	private matchesText: Konva.Text; // Displays "Matches: X/8"
	private completionPopup: Konva.Group | null = null; // Completion popup (shown when game is complete)

	// Game state
	private shuffledCards: Array<{ type: "president" | "accomplishment"; value: string }> = [];

	/**
	 * Constructor - Sets up the view with callback handlers
	 * 
	 * @param onCardClick - Callback function called when user clicks a card
	 * @param onHomeClick - Callback function called when user clicks "Return to Home" button
	 */
	constructor(
		onCardClick: (cardIndex: number, cardType: "president" | "accomplishment", value: string) => void,
		onHomeClick: () => void
	) {
		// Block 1: Initialize main group (initially hidden)
		this.group = new Konva.Group({ visible: false });
		this.cardClickHandler = onCardClick;
		this.homeButtonHandler = onHomeClick;

		// Block 2: Create background - DC-themed light blue
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#e8f4f8", // Light blue background
		});
		this.group.add(bg);

		// Block 3: Create matches display (top-right corner)
		// Shows progress like "Matches: 3/8"
		this.matchesText = new Konva.Text({
			x: STAGE_WIDTH - 200,
			y: 20,
			text: "Matches: 0/8",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "#1a1a1a",
			fontStyle: "bold",
		});
		this.group.add(this.matchesText);
	}

	/**
	 * Initialize the game with president pairs
	 * 
	 * This method:
	 * 1. Creates card data from president pairs (8 presidents + 8 accomplishments = 16 cards)
	 * 2. Shuffles the cards randomly
	 * 3. Calculates grid positions
	 * 4. Creates and displays all cards in a 4x4 grid
	 * 
	 * @param presidentPairs - Array of president-accomplishment pairs from the data file
	 */
	initializeGame(presidentPairs: PresidentPair[]): void {
		// Block 1: Clean up - Remove any existing cards from previous game
		this.cards.forEach((card) => card.cardGroup.destroy());
		this.cards = [];

		// Block 1a: Remove completion popup if it exists from previous game
		if (this.completionPopup) {
			this.completionPopup.destroy();
			this.completionPopup = null;
		}

		// Block 2: Create card data - Convert pairs into individual cards
		// Each pair becomes 2 cards: one president card and one accomplishment card
		this.shuffledCards = [];
		presidentPairs.forEach((pair) => {
			// Add president card
			this.shuffledCards.push({ type: "president", value: pair.president });
			// Add accomplishment card
			this.shuffledCards.push({ type: "accomplishment", value: pair.accomplishment });
		});

		// Block 3: Shuffle the cards randomly so they're in different positions each game
		this.shuffleArray(this.shuffledCards);

		// Block 4: Calculate grid layout
		// Calculate total width needed for all cards and spacing
		const totalWidth = this.gridCols * this.cardWidth + (this.gridCols - 1) * this.cardSpacing;
		// Center the grid horizontally on the screen
		const startX = (STAGE_WIDTH - totalWidth) / 2;
		// Start below the matches text at the top
		const startY = 100;

		// Block 5: Create cards in grid positions
		// Loop through all 16 cards and place them in a 4x4 grid
		for (let i = 0; i < this.shuffledCards.length; i++) {
			// Calculate which row this card is in (0-3)
			const row = Math.floor(i / this.gridCols);
			// Calculate which column this card is in (0-3)
			const col = i % this.gridCols;
			// Calculate x position: start position + (column * (card width + spacing))
			const x = startX + col * (this.cardWidth + this.cardSpacing);
			// Calculate y position: start position + (row * (card height + spacing))
			const y = startY + row * (this.cardHeight + this.cardSpacing);

			// Get the card data (type and value)
			const cardData = this.shuffledCards[i];
			// Create the visual card at this position
			const card = this.createCard(x, y, i, cardData.type, cardData.value);
			// Store the card in our array
			this.cards.push(card);
			// Add the card's visual group to the main group
			this.group.add(card.cardGroup);
		}

		// Block 6: Draw everything to the screen
		this.group.getLayer()?.draw();
	}

	/**
	 * Create a single card with visual elements
	 * 
	 * Each card has:
	 * - A back (face-down): Dark blue with flag emoji
	 * - A front (face-up): Yellow for presidents, blue for accomplishments, with text
	 * - Click handlers to flip the card
	 * - Hover effects for better UX
	 * 
	 * @param x - X position on screen
	 * @param y - Y position on screen
	 * @param cardIndex - Index in the cards array (0-15)
	 * @param cardType - "president" or "accomplishment"
	 * @param value - The text to display (president name or accomplishment)
	 * @returns CardData object containing all card information
	 */
	private createCard(
		x: number,
		y: number,
		cardIndex: number,
		cardType: "president" | "accomplishment",
		value: string
	): CardData {
		// Block 1: Create a Konva group to hold all card elements
		const cardGroup = new Konva.Group({ x, y });

		// Block 2: Create card back (face-down) - shown initially
		// Dark blue rectangle with flag emoji
		const backRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: this.cardWidth,
			height: this.cardHeight,
			fill: "#1e3a8a", // Dark blue
			cornerRadius: 10, // Rounded corners
			stroke: "#0f172a", // Dark border
			strokeWidth: 3,
			shadowColor: "black",
			shadowBlur: 5,
			shadowOpacity: 0.3,
		});

		// Block 3: Add flag emoji to card back
		const backIcon = new Konva.Text({
			x: this.cardWidth / 2,
			y: this.cardHeight / 2,
			text: "🇺🇸",
			fontSize: 40,
			align: "center",
			offsetX: 20, // Center horizontally
			offsetY: 20, // Center vertically
		});

		// Block 4: Create card front (face-up) - hidden initially
		// Different colors for presidents (yellow) vs accomplishments (blue)
		const frontRect = new Konva.Rect({
			x: 0,
			y: 0,
			width: this.cardWidth,
			height: this.cardHeight,
			fill: cardType === "president" ? "#fef3c7" : "#dbeafe", // Yellow or blue
			cornerRadius: 10,
			stroke: cardType === "president" ? "#f59e0b" : "#3b82f6", // Orange or blue border
			strokeWidth: 3,
			shadowColor: "black",
			shadowBlur: 5,
			shadowOpacity: 0.3,
			visible: false, // Hidden until card is flipped
		});

		// Block 5: Create text on card front - shows president name or accomplishment
		const frontText = new Konva.Text({
			x: this.cardWidth / 2,
			y: this.cardHeight / 2,
			text: value, // The president name or accomplishment text
			fontSize: cardType === "president" ? 18 : 14, // Larger text for presidents
			fontFamily: "Arial",
			fill: "#1a1a1a",
			align: "center",
			width: this.cardWidth - 20, // Allow text wrapping
			wrap: "word",
			offsetX: (this.cardWidth - 20) / 2, // Center horizontally
			offsetY: 30, // Center vertically
			visible: false, // Hidden until card is flipped
		});

		// Block 6: Create type label - shows "PRESIDENT" or "ACCOMPLISHMENT"
		const typeLabel = new Konva.Text({
			x: 10,
			y: 10,
			text: cardType === "president" ? "PRESIDENT" : "ACCOMPLISHMENT",
			fontSize: 10,
			fontFamily: "Arial",
			fill: cardType === "president" ? "#92400e" : "#1e40af",
			fontStyle: "bold",
			visible: false, // Hidden until card is flipped
		});

		// Block 7: Add all elements to the card group
		cardGroup.add(backRect);
		cardGroup.add(backIcon);
		cardGroup.add(frontRect);
		cardGroup.add(frontText);
		cardGroup.add(typeLabel);

		// Block 8: Create card data object to track card state
		const cardData: CardData = {
			type: cardType,
			value,
			cardIndex,
			isFlipped: false, // Card starts face-down
			isMatched: false, // Card starts unmatched
			cardGroup,
			backRect,
			frontRect,
			frontText,
			typeLabel,
		};

		// Block 9: Add click handler - calls controller when card is clicked
		cardGroup.on("click", () => {
			// Only allow clicks on face-down, unmatched cards
			if (!cardData.isFlipped && !cardData.isMatched) {
				// Call the controller's callback with card information
				this.cardClickHandler(cardIndex, cardType, value);
			}
		});

		// Block 10: Add hover effects for better user experience
		// When mouse enters card, highlight it with a blue border
		cardGroup.on("mouseenter", () => {
			if (!cardData.isFlipped && !cardData.isMatched) {
				backRect.strokeWidth(4); // Thicker border
				backRect.stroke("#3b82f6"); // Blue color
				this.group.getLayer()?.draw();
			}
		});

		// When mouse leaves card, restore normal border
		cardGroup.on("mouseleave", () => {
			if (!cardData.isFlipped && !cardData.isMatched) {
				backRect.strokeWidth(3); // Normal border
				backRect.stroke("#0f172a"); // Dark color
				this.group.getLayer()?.draw();
			}
		});

		return cardData;
	}

	/**
	 * Flip a card to show its face
	 * 
	 * Called by the Controller when user clicks a card.
	 * Hides the back and shows the front with text.
	 * 
	 * @param cardIndex - Index of the card to flip
	 */
	flipCard(cardIndex: number): void {
		const card = this.cards[cardIndex];
		// Safety check: ensure card exists and isn't already flipped/matched
		if (!card || card.isFlipped || card.isMatched) return;

		// Block 1: Update card state
		card.isFlipped = true;
		// Block 2: Hide card back (face-down side)
		card.backRect.visible(false);
		// Block 3: Show card front (face-up side)
		card.frontRect.visible(true);
		card.frontText.visible(true);
		card.typeLabel.visible(true);

		// Block 4: Redraw the screen to show changes
		this.group.getLayer()?.draw();
	}

	/**
	 * Flip a card back to face down
	 * 
	 * Called by the Controller when two cards don't match.
	 * Hides the front and shows the back again.
	 * 
	 * @param cardIndex - Index of the card to flip back
	 */
	flipCardBack(cardIndex: number): void {
		const card = this.cards[cardIndex];
		// Safety check: ensure card exists, is flipped, and not matched
		if (!card || !card.isFlipped || card.isMatched) return;

		// Block 1: Update card state
		card.isFlipped = false;
		// Block 2: Show card back again
		card.backRect.visible(true);
		// Block 3: Hide card front
		card.frontRect.visible(false);
		card.frontText.visible(false);
		card.typeLabel.visible(false);

		// Block 4: Redraw the screen to show changes
		this.group.getLayer()?.draw();
	}

	/**
	 * Mark cards as matched (they stay face up and turn green)
	 * 
	 * Called by the Controller when a valid match is found.
	 * Cards turn green and become unclickable.
	 * 
	 * @param cardIndex1 - Index of first matched card
	 * @param cardIndex2 - Index of second matched card
	 */
	markCardsAsMatched(cardIndex1: number, cardIndex2: number): void {
		const card1 = this.cards[cardIndex1];
		const card2 = this.cards[cardIndex2];

		// Block 1: Mark first card as matched
		if (card1) {
			card1.isMatched = true;
			// Change color to green to indicate match
			card1.frontRect.fill("#86efac"); // Light green
			card1.frontRect.stroke("#22c55e"); // Dark green border
			// Remove hover effects since card is no longer clickable
			card1.cardGroup.off("mouseenter mouseleave");
		}

		// Block 2: Mark second card as matched
		if (card2) {
			card2.isMatched = true;
			// Change color to green to indicate match
			card2.frontRect.fill("#86efac"); // Light green
			card2.frontRect.stroke("#22c55e"); // Dark green border
			// Remove hover effects since card is no longer clickable
			card2.cardGroup.off("mouseenter mouseleave");
		}

		// Block 3: Redraw the screen to show green matched cards
		this.group.getLayer()?.draw();
	}

	/**
	 * Check if a card is currently flipped (face-up)
	 * 
	 * Used by the Controller to prevent clicking already-flipped cards
	 * 
	 * @param cardIndex - Index of the card to check
	 * @returns true if card is flipped, false otherwise
	 */
	isCardFlipped(cardIndex: number): boolean {
		return this.cards[cardIndex]?.isFlipped ?? false;
	}

	/**
	 * Check if a card is matched
	 * 
	 * Used by the Controller to prevent clicking already-matched cards
	 * 
	 * @param cardIndex - Index of the card to check
	 * @returns true if card is matched, false otherwise
	 */
	isCardMatched(cardIndex: number): boolean {
		return this.cards[cardIndex]?.isMatched ?? false;
	}

	/**
	 * Update matches display
	 * 
	 * Called by the Controller to update progress (e.g., "Matches: 3/8")
	 * 
	 * @param matchesFound - Number of matches found so far
	 * @param totalPairs - Total number of pairs to match
	 */
	updateMatches(matchesFound: number, totalPairs: number): void {
		// Update the text to show current progress
		this.matchesText.text(`Matches: ${matchesFound}/${totalPairs}`);
		// Redraw the screen to show updated text
		this.group.getLayer()?.draw();
	}

	/**
	 * Shuffle array using Fisher-Yates algorithm
	 * 
	 * Randomly reorders the array in-place to shuffle the cards.
	 * This ensures cards are in different positions each game.
	 * 
	 * @param array - Array to shuffle (presidents and accomplishments)
	 */
	private shuffleArray<T>(array: T[]): void {
		// Loop backwards through the array
		for (let i = array.length - 1; i > 0; i--) {
			// Pick a random index from 0 to i
			const j = Math.floor(Math.random() * (i + 1));
			// Swap elements at positions i and j
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	/**
	 * Show the screen - Makes the game visible
	 * 
	 * Called by the Controller when starting the game
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen - Makes the game invisible
	 * 
	 * Called by the Controller when navigating away
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	/**
	 * Show completion popup - Called when all pairs have been matched
	 * 
	 * Displays a popup with:
	 * - "Game Complete" message
	 * - "You have completed Washington DC" message
	 * - "Return to Home" button
	 */
	showCompletionPopup(): void {
		// Block 1: Remove existing popup if it exists
		if (this.completionPopup) {
			this.completionPopup.destroy();
		}

		// Block 2: Create popup group centered on screen
		this.completionPopup = new Konva.Group({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
		});

		// Block 3: Create popup background panel
		const panelWidth = 500;
		const panelHeight = 300;
		const panel = new Konva.Rect({
			x: -panelWidth / 2,
			y: -panelHeight / 2,
			width: panelWidth,
			height: panelHeight,
			fill: "rgba(255, 255, 255, 0.98)", // White background with slight transparency
			cornerRadius: 20,
			stroke: "#22c55e", // Green border to match matched cards
			strokeWidth: 4,
			shadowColor: "black",
			shadowBlur: 15,
			shadowOpacity: 0.5,
		});

		// Block 4: Create "Game Complete!" title text
		const titleText = new Konva.Text({
			x: 0,
			y: -100,
			text: "Game Complete!",
			fontSize: 48,
			fontFamily: "Arial",
			fill: "#22c55e", // Green color
			fontStyle: "bold",
			align: "center",
		});
		// Center the text using offsetX (shift text so its center aligns with x position)
		titleText.offsetX(titleText.width() / 2);

		// Block 5: Create completion message
		const messageText = new Konva.Text({
			x: 0,
			y: -30,
			text: "You have completed Washington DC!",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "#1a1a1a",
			align: "center",
			width: panelWidth - 40, // Allow text to wrap if needed
		});
		// Center the text using offsetX
		messageText.offsetX(messageText.width() / 2);

		// Block 6: Create "Return to Home" button
		const buttonWidth = 240;
		const buttonHeight = 60;
		const buttonGroup = new Konva.Group({
			x: 0,
			y: 60,
			listening: true, // Enable click events
		});

		// Button background
		const buttonRect = new Konva.Rect({
			x: -buttonWidth / 2,
			y: -buttonHeight / 2,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#3b82f6", // Blue color
			cornerRadius: 12,
			stroke: "#1e40af",
			strokeWidth: 3,
			shadowColor: "black",
			shadowBlur: 8,
			shadowOpacity: 0.3,
		});

		// Button text
		const buttonText = new Konva.Text({
			x: 0,
			y: 0,
			text: "Return to Home",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
			fontStyle: "bold",
			align: "center",
		});
		// Center the text both horizontally and vertically
		buttonText.offsetX(buttonText.width() / 2);
		buttonText.offsetY(buttonText.height() / 2);

		// Block 7: Add hover effects to button
		buttonGroup.on("mouseenter", () => {
			buttonRect.fill("#2563eb"); // Lighter blue on hover
			buttonRect.strokeWidth(4);
			document.body.style.cursor = "pointer";
			this.group.getLayer()?.draw();
		});

		buttonGroup.on("mouseleave", () => {
			buttonRect.fill("#3b82f6"); // Original blue
			buttonRect.strokeWidth(3);
			document.body.style.cursor = "default";
			this.group.getLayer()?.draw();
		});

		// Block 8: Add click handler to button
		buttonGroup.on("click", () => {
			this.homeButtonHandler();
		});

		// Block 9: Add all elements to button group
		buttonGroup.add(buttonRect);
		buttonGroup.add(buttonText);

		// Block 10: Add all elements to popup group
		this.completionPopup.add(panel);
		this.completionPopup.add(titleText);
		this.completionPopup.add(messageText);
		this.completionPopup.add(buttonGroup);

		// Block 11: Add popup to main group and bring to front
		this.group.add(this.completionPopup);
		this.completionPopup.moveToTop();

		// Block 12: Redraw the screen to show the popup
		this.group.getLayer()?.draw();
	}

	/**
	 * Get the Konva group - Required by View interface
	 * 
	 * @returns The main Konva group containing all visual elements
	 */
	getGroup(): Konva.Group {
		return this.group;
	}
}
