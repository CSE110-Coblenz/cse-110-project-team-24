import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * AboutScreenView - Renders the about screen
 * 
 * This view displays game information including a description of the game,
 * how to play instructions, and a back button to return to the menu.
 * The screen uses a semi-transparent panel over a background image for readability.
 */
export class AboutScreenView implements View {
	// The main Konva group containing all about screen elements
	private group: Konva.Group;

	/**
	 * Constructor - Initializes and renders the about screen UI
	 * 
	 * Creates all visual elements including background, title, information panel
	 * with game description and instructions, and a back button.
	 * The background uses a semi-transparent U.S. map image similar to the menu screen.
	 * 
	 * @param onBackClick - Callback function executed when the BACK button is clicked
	 */
	constructor(onBackClick: () => void) {
		// Create the main group container for all about screen elements
		// Initially set to invisible (will be shown when navigating to this screen)
		this.group = new Konva.Group({ visible: false });

		// Background image behind content (non-interactive and dimmed)
		// The background group is set to non-interactive (listening: false) so clicks pass through
		const backgroundGroup = new Konva.Group({ listening: false, opacity: 0.28 });
		this.group.add(backgroundGroup);
		// Create a solid color rectangle as the base background (fallback if images fail to load)
		const bgRect = new Konva.Rect({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, fill: "#f8fafc" });
		backgroundGroup.add(bgRect);
		backgroundGroup.moveToBottom();

		// Load and display the U.S. background image with fallback support
		// Tries to load .webp first (more efficient), then falls back to .jpg
		const img = new Image();
		const sources = ["/assets/us-bg.webp", "/assets/us-bg.jpg"];
		let sourceIndex = 0;
		img.onload = () => {
			// When image loads successfully, create a Konva Image node and add it to the background group
			const imgNode = new Konva.Image({ image: img, x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, listening: false });
			backgroundGroup.add(imgNode);
			backgroundGroup.opacity(0.35); // Set opacity to make it semi-transparent
			backgroundGroup.moveToBottom(); // Ensure it stays behind all other elements
			this.group.getLayer()?.draw(); // Redraw the layer to show the loaded image
		};
		img.onerror = () => {
			// If current image fails to load, try the next source in the array
			sourceIndex += 1;
			if (sourceIndex < sources.length) {
				img.src = sources[sourceIndex];
			} else {
				// If all image sources fail, keep the solid background color
				// Reduce opacity slightly to maintain visual consistency
				backgroundGroup.opacity(0.18);
				this.group.getLayer()?.draw();
			}
		};
		img.src = sources[sourceIndex];

		// Title text - "About GeoQuest" at the top of the screen
		// Positioned at 14% down the screen, centered horizontally
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT * 0.14,
			text: "About GeoQuest",
			fontSize: 56,
			fontFamily: "\"Luckiest Guy\", \"Comic Sans MS\", \"Arial Black\", Arial",
			fill: "#1e3a8a", // Blue color matching the game theme
			shadowColor: "#0f172a", // Dark shadow for depth
			shadowBlur: 4,
			align: "center",
		});
		title.offsetX(title.width() / 2); // Center the text
		this.group.add(title);

		// Panel background for readability - Semi-transparent white panel
		// This panel sits over the background image to make text easier to read
		const panelWidth = Math.min(800, STAGE_WIDTH * 0.8); // Responsive width: 80% of stage, max 800px
		const panelX = STAGE_WIDTH / 2 - panelWidth / 2; // Center the panel horizontally
		const panelY = STAGE_HEIGHT * 0.24; // Position at 24% down the screen
		const panel = new Konva.Rect({
			x: panelX,
			y: panelY,
			width: panelWidth,
			height: STAGE_HEIGHT * 0.42, // Panel height is 42% of screen height
			fill: "rgba(255,255,255,0.85)", // Semi-transparent white background
			cornerRadius: 16, // Rounded corners for modern appearance
			stroke: "#1e3a8a", // Blue border matching the title
			strokeWidth: 2,
		});
		this.group.add(panel);

		// Body text - Game description and instructions
		// Contains information about the game and how to play
		const body = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: panelY + 24, // Position inside the panel with padding
			text:
				"Embark on a cross-country adventure! Travel from coast to coast, playing fun mini-games in each state to learn its unique history and culture. Complete challenges to earn collectible postcards that mark every stop on your journey. Explore some of the major Cities and States of the United States, test your knowledge, and see if you can collect every postcard to become the ultimate U.S. explorer!\n\n" +
				"How to play:\n" +
				"• Start in New York and visit cities on the map.\n" +
				"• Read a short fun fact, then play a city mini‑game.\n" +
				"• Win to collect a postcard. Lose a life if you miss.\n" +
				"• Collect all postcards to complete your road trip!",
			fontSize: 22,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#0f172a", // Dark text color for readability
			width: panelWidth - 40, // Text width with padding on both sides
			align: "left",
		});
		body.offsetX(body.width() / 2); // Center the text block
		this.group.add(body);

		// BACK button - Returns user to the menu screen
		// Group contains both the rectangle background and text label
		const backGroup = new Konva.Group();
		const backRect = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 120, // Center the button (240px wide, so 120px offset from center)
			y: panelY + STAGE_HEIGHT * 0.42 + 24, // Position below the panel with spacing
			width: 240,
			height: 64,
			fill: "#6b7280", // Gray color for the back action
			cornerRadius: 12, // Rounded corners
			stroke: "#374151", // Dark gray border
			strokeWidth: 3,
			shadowColor: "#111827", // Shadow for depth
			shadowBlur: 8,
			shadowOpacity: 0.25,
		});
		const backText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: panelY + STAGE_HEIGHT * 0.42 + 24 + 64 / 2 - 16, // Center vertically in button
			text: "BACK",
			fontSize: 28,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "white", // White text for contrast
			align: "center",
		});
		backText.offsetX(backText.width() / 2); // Center the text
		backGroup.add(backRect);
		backGroup.add(backText);
		// Attach click handler to the entire button group
		backGroup.on("click", onBackClick);
		this.group.add(backGroup);
	}

	/**
	 * Show the screen - Makes the about screen visible
	 * 
	 * Sets the group's visibility to true and redraws the layer to update the display.
	 * Called when navigating to the about screen from the menu screen.
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen - Makes the about screen invisible
	 * 
	 * Sets the group's visibility to false and redraws the layer to update the display.
	 * Called when navigating away from the about screen to another screen.
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	/**
	 * Get the Konva group containing all about screen elements
	 * 
	 * @returns The main Konva.Group that contains all UI elements for this screen
	 */
	getGroup(): Konva.Group {
		return this.group;
	}
}


