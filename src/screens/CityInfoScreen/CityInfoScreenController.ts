import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import {
	CityInfoModel,
	type CityInformationEntry,
} from "./CityInfoScreenModel.ts";
import { CityInfoView } from "./CityInfoScreenView.ts";

export class CityInfoController extends ScreenController {
    private model: CityInfoModel;
    private view: CityInfoView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.model = new CityInfoModel();
        this.view = new CityInfoView();
    }

    getView(): CityInfoView {
		return this.view;
	}

    displayCityInfo(cityName: string): void {
        console.log(`Displaying info for city: ${cityName}`);
        this.view.show();
    }

}