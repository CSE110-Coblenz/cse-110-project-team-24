import Konva from "konva";
import type { View } from "../../types.ts";
import type { CityInformationEntry } from "./CityInfoScreenModel.ts";
import { STAGE_WIDTH } from "../../constants.ts";
import { STAGE_HEIGHT } from "../../constants.ts";

export class CityInfoView implements View {
	private group: Konva.Group;
    private infoGroup: Konva.Group;

    constructor() {
        this.group = new Konva.Group({ visible: false });
        this.infoGroup = new Konva.Group();


        console.log("CityInfoView initialized");

        //Add a background rectangle
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: 'lightblue',
        });
        this.group.add(background);

    }


    displayCityInfo(cityInfo: CityInformationEntry): void {

        // Clear previous info
        this.infoGroup.destroyChildren();
        const title = new Konva.Text({
            x: 50,
            y: 50,
            text: cityInfo.cityName,
            fontSize: 30,
            fontFamily: 'Arial',
            fill: 'black',
        });
        this.infoGroup.add(title);


    }


	show(): void {
		this.group.visible(true);
        this.infoGroup.visible(true);
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