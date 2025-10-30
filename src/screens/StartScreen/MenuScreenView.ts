import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MenuScreenView implements View {
	private group: Konva.Group;

	constructor(onStartClick: () => void, onAboutClick: () => void) {
		this.group = new Konva.Group({ visible: true });

		// Background: render in a dedicated group at the bottom so it never covers UI
		const backgroundGroup = new Konva.Group({ listening: false, opacity: 0.2 });
		this.group.add(backgroundGroup);
		const bgRect = new Konva.Rect({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, fill: "#f3f4f6" });
		backgroundGroup.add(bgRect);
		backgroundGroup.moveToBottom();

		const bgImage = new Image();
		bgImage.onload = () => {
			const imgNode = new Konva.Image({ image: bgImage, x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, listening: false });
			backgroundGroup.add(imgNode);
			backgroundGroup.opacity(0.5);
			backgroundGroup.moveToBottom();
			this.group.getLayer()?.draw();
		};

		bgImage.src = "/assets/us-bg.jpg"; // put your image at public/assets/us-bg.jpg

		// Title text
		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT * 0.22,
			text: "GEOQUEST",
			fontSize: 78,
			fontFamily: "\"Luckiest Guy\", \"Comic Sans MS\", \"Arial Black\", Arial",
			fill: "#ffffff",
			stroke: "#1e3a8a",
			strokeWidth: 5,
			align: "center",
		});
		// Center the text using offsetX
		title.offsetX(title.width() / 2);
		this.group.add(title);

		// Subtitle
		const subtitle = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT * 0.34,
			text: "A U.S. Cities Adventure!",
			fontSize: 30,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#0f172a",
			align: "center",
		});
		subtitle.offsetX(subtitle.width() / 2);
		this.group.add(subtitle);

		// Buttons side by side
		const buttonsY = STAGE_HEIGHT * 0.48;
		const gap = 32;
		const buttonWidth = Math.min(320, Math.max(220, STAGE_WIDTH * 0.22));
		const buttonHeight = Math.min(88, Math.max(64, STAGE_HEIGHT * 0.09));

		const leftX = STAGE_WIDTH / 2 - buttonWidth - gap / 2;
		const rightX = STAGE_WIDTH / 2 + gap / 2;

		const startButtonGroup = new Konva.Group();
		const startButton = new Konva.Rect({
			x: leftX,
			y: buttonsY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#16a34a",
			cornerRadius: 14,
			stroke: "#14532d",
			strokeWidth: 4,
			shadowColor: "#064e3b",
			shadowBlur: 10,
			shadowOpacity: 0.3,
		});
		const startText = new Konva.Text({
			x: leftX + buttonWidth / 2,
			y: buttonsY + buttonHeight / 2 - 16,
			text: "START GAME",
			fontSize: 32,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#ffffff",
			align: "center",
		});
		startText.offsetX(startText.width() / 2);
		startButtonGroup.add(startButton);
		startButtonGroup.add(startText);
		startButtonGroup.on("click", onStartClick);
		this.group.add(startButtonGroup);

		const aboutButtonGroup = new Konva.Group();
		const aboutButton = new Konva.Rect({
			x: rightX,
			y: buttonsY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#2563eb",
			cornerRadius: 14,
			stroke: "#1e3a8a",
			strokeWidth: 4,
			shadowColor: "#1e3a8a",
			shadowBlur: 10,
			shadowOpacity: 0.25,
		});
		const aboutText = new Konva.Text({
			x: rightX + buttonWidth / 2,
			y: buttonsY + buttonHeight / 2 - 16,
			text: "ABOUT",
			fontSize: 30,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#ffffff",
			align: "center",
		});
		aboutText.offsetX(aboutText.width() / 2);
		aboutButtonGroup.add(aboutButton);
		aboutButtonGroup.add(aboutText);
		aboutButtonGroup.on("click", onAboutClick);
		this.group.add(aboutButtonGroup);
	}

	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}
