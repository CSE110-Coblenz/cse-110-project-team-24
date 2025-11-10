import Konva from "konva";
import type { View } from "../../types.ts";
import type { CityInfoModel } from "./CityInfoScreenModel.ts";
import { STAGE_WIDTH } from "../../constants.ts";
import { STAGE_HEIGHT } from "../../constants.ts";

export class CityInfoView implements View {
	private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group({ visible: false });

    }


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