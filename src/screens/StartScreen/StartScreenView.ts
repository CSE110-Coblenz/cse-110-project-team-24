import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MenuScreenView implements View {
	private group: Konva.Group;

	/**
	 * Constructor - Initializes and renders the menu screen UI
	 * 
	 * Creates all visual elements including background, title, subtitle, and buttons.
	 * The background uses a semi-transparent U.S. map image to create a themed backdrop.
	 * Two buttons are positioned side-by-side: START GAME (green) and ABOUT (blue).
	 * 
	 * @param onStartClick - Callback function executed when the START GAME button is clicked
	 * @param onAboutClick - Callback function executed when the ABOUT button is clicked
	 */
	constructor(onStartClick: () => void, onAboutClick: () => void) {
		// Create the main group container for all menu screen elements
		this.group = new Konva.Group({ visible: true });

		// Background: render in a dedicated group at the bottom so it never covers UI
		// The background group is set to non-interactive (listening: false) so clicks pass through
		const backgroundGroup = new Konva.Group({ listening: false, opacity: 0.2 });
		this.group.add(backgroundGroup);
		// Create a solid color rectangle as the base background (fallback if image fails to load)
		const bgRect = new Konva.Rect({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, fill: "#f3f4f6" });
		backgroundGroup.add(bgRect);
		backgroundGroup.moveToBottom();

		// Load and display the U.S. background image
		// This creates a themed backdrop for the menu screen
		const bgImage = new Image();
		bgImage.onload = () => {
			// When image loads successfully, create a Konva Image node and add it to the background group
			const imgNode = new Konva.Image({ image: bgImage, x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, listening: false });
			backgroundGroup.add(imgNode);
			backgroundGroup.opacity(0.5); // Set opacity to make it semi-transparent
			backgroundGroup.moveToBottom(); // Ensure it stays behind all other elements
			this.group.getLayer()?.draw(); // Redraw the layer to show the loaded image
		};

		// Set the image source - the image should be placed at public/assets/us-bg.jpg
		bgImage.src = "/assets/us-bg.jpg";

		// Title text - "GEOQUEST" in large, bold letters
		// Positioned at 20% down the screen, centered horizontally
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT * 0.20,
			text: "GEOQUEST",
			fontSize: 100,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#ffffff", // White fill color
			stroke: "#1e3a8a", // Blue stroke for contrast
			strokeWidth: 5,
			align: "center",
		});
		// Center the text using offsetX - shifts the text so its center aligns with x position
		title.offsetX(title.width() / 2);
		this.group.add(title);

		// Subtitle - Describes the game theme
		// Positioned below the title at 38% down the screen
		const subtitle = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT * 0.38,
			text: "A U.S. Cities Adventure!",
			fontSize: 35,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#0f172a", // Dark slate color
			align: "center",
		});
		subtitle.offsetX(subtitle.width() / 2);
		this.group.add(subtitle);

		// Buttons side by side - Calculate positions for two buttons with a gap between them
		// Buttons are positioned at 54% down the screen, centered horizontally with spacing
		const buttonsY = STAGE_HEIGHT * 0.54;
		const gap = 32; // Space between the two buttons
		// Responsive button sizing: width is 22% of stage width, clamped between 220-320px
		const buttonWidth = Math.min(320, Math.max(220, STAGE_WIDTH * 0.22));
		// Responsive button sizing: height is 9% of stage height, clamped between 64-88px
		const buttonHeight = Math.min(88, Math.max(64, STAGE_HEIGHT * 0.09));

		// Calculate x positions for left (START GAME) and right (ABOUT) buttons
		// Left button is positioned to the left of center, right button to the right of center
		const leftX = STAGE_WIDTH / 2 - buttonWidth - gap / 2;
		const rightX = STAGE_WIDTH / 2 + gap / 2;

		// START GAME button - Green button on the left side
		// Group contains both the rectangle background and text label
		const startButtonGroup = new Konva.Group();
		const startButton = new Konva.Rect({
			x: leftX,
			y: buttonsY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#16a34a", // Green color for the start action
			cornerRadius: 14, // Rounded corners for modern appearance
			stroke: "#14532d", // Dark green border
			strokeWidth: 4,
			shadowColor: "#064e3b", // Shadow for depth
			shadowBlur: 10,
			shadowOpacity: 0.3,
		});
		const startText = new Konva.Text({
			x: leftX + buttonWidth / 2,
			y: buttonsY + buttonHeight / 2 - 16,
			text: "START GAME",
			fontSize: 32,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#ffffff", // White text for contrast
			align: "center",
		});
		startText.offsetX(startText.width() / 2);
		startButtonGroup.add(startButton);
		startButtonGroup.add(startText);
		// Attach click handler to the entire button group
		startButtonGroup.on("click", onStartClick);
		this.group.add(startButtonGroup);

		// ABOUT button - Blue button on the right side
		// Group contains both the rectangle background and text label
		const aboutButtonGroup = new Konva.Group();
		const aboutButton = new Konva.Rect({
			x: rightX,
			y: buttonsY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#2563eb", // Blue color for the about action
			cornerRadius: 14, // Rounded corners matching the start button
			stroke: "#1e3a8a", // Dark blue border
			strokeWidth: 4,
			shadowColor: "#1e3a8a", // Shadow for depth
			shadowBlur: 10,
			shadowOpacity: 0.25,
		});
		const aboutText = new Konva.Text({
			x: rightX + buttonWidth / 2,
			y: buttonsY + buttonHeight / 2 - 16,
			text: "ABOUT",
			fontSize: 30,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#ffffff", // White text for contrast
			align: "center",
		});
		aboutText.offsetX(aboutText.width() / 2);
		aboutButtonGroup.add(aboutButton);
		aboutButtonGroup.add(aboutText);
		// Attach click handler to the entire button group
		aboutButtonGroup.on("click", onAboutClick);
		this.group.add(aboutButtonGroup);
	}

	/**
	 * Show the screen - Makes the menu screen visible
	 * 
	 * Sets the group's visibility to true and redraws the layer to update the display.
	 * Called when navigating to the menu screen from another screen.
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen - Makes the menu screen invisible
	 * 
	 * Sets the group's visibility to false and redraws the layer to update the display.
	 * Called when navigating away from the menu screen to another screen.
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	/**
	 * Get the Konva group containing all menu screen elements
	 * 
	 * @returns The main Konva.Group that contains all UI elements for this screen
	 */
	getGroup(): Konva.Group {
		return this.group;
	}
}
