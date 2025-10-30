import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

export class AboutScreenView implements View {
	private group: Konva.Group;

	constructor(onBackClick: () => void) {
		this.group = new Konva.Group({ visible: false });

		// Background image behind content (non-interactive and dimmed)
		const backgroundGroup = new Konva.Group({ listening: false, opacity: 0.28 });
		this.group.add(backgroundGroup);
		const bgRect = new Konva.Rect({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, fill: "#f8fafc" });
		backgroundGroup.add(bgRect);
		backgroundGroup.moveToBottom();

		const img = new Image();
		const sources = ["/assets/us-bg.webp", "/assets/us-bg.jpg"];
		let sourceIndex = 0;
		img.onload = () => {
			const imgNode = new Konva.Image({ image: img, x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT, listening: false });
			backgroundGroup.add(imgNode);
			backgroundGroup.opacity(0.35);
			backgroundGroup.moveToBottom();
			this.group.getLayer()?.draw();
		};
		img.onerror = () => {
			sourceIndex += 1;
			if (sourceIndex < sources.length) {
				img.src = sources[sourceIndex];
			} else {
				// keep solid background if images not available
				backgroundGroup.opacity(0.18);
				this.group.getLayer()?.draw();
			}
		};
		img.src = sources[sourceIndex];

		const title = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT * 0.14,
			text: "About GeoQuest",
			fontSize: 56,
			fontFamily: "\"Luckiest Guy\", \"Comic Sans MS\", \"Arial Black\", Arial",
			fill: "#1e3a8a",
			shadowColor: "#0f172a",
			shadowBlur: 4,
			align: "center",
		});
		title.offsetX(title.width() / 2);
		this.group.add(title);

		// Panel background for readability
		const panelWidth = Math.min(800, STAGE_WIDTH * 0.8);
		const panelX = STAGE_WIDTH / 2 - panelWidth / 2;
		const panelY = STAGE_HEIGHT * 0.24;
		const panel = new Konva.Rect({
			x: panelX,
			y: panelY,
			width: panelWidth,
			height: STAGE_HEIGHT * 0.42,
			fill: "rgba(255,255,255,0.85)",
			cornerRadius: 16,
			stroke: "#1e3a8a",
			strokeWidth: 2,
		});
		this.group.add(panel);

		const body = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: panelY + 24,
			text:
				"Embark on a cross-country adventure! Travel from coast to coast, playing fun mini-games in each state to learn its unique history and culture. Complete challenges to earn collectible postcards that mark every stop on your journey. Explore some of the major Cities and States of the United States, test your knowledge, and see if you can collect every postcard to become the ultimate U.S. explorer!\n\n" +
				"How to play:\n" +
				"• Start in New York and visit cities on the map.\n" +
				"• Read a short fun fact, then play a city mini‑game.\n" +
				"• Win to collect a postcard. Lose a life if you miss.\n" +
				"• Collect all postcards to complete your road trip!",
			fontSize: 22,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "#0f172a",
			width: panelWidth - 40,
			align: "left",
		});
		body.offsetX(body.width() / 2);
		this.group.add(body);

		const backGroup = new Konva.Group();
		const backRect = new Konva.Rect({
			x: STAGE_WIDTH / 2 - 120,
			y: panelY + STAGE_HEIGHT * 0.42 + 24,
			width: 240,
			height: 64,
			fill: "#6b7280",
			cornerRadius: 12,
			stroke: "#374151",
			strokeWidth: 3,
			shadowColor: "#111827",
			shadowBlur: 8,
			shadowOpacity: 0.25,
		});
		const backText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: panelY + STAGE_HEIGHT * 0.42 + 24 + 64 / 2 - 16,
			text: "BACK",
			fontSize: 28,
			fontFamily: "\"Fredoka One\", \"Comic Sans MS\", Arial",
			fill: "white",
			align: "center",
		});
		backText.offsetX(backText.width() / 2);
		backGroup.add(backRect);
		backGroup.add(backText);
		backGroup.on("click", onBackClick);
		this.group.add(backGroup);
	}

	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}


