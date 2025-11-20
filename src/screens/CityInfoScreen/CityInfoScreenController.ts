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
        this.view = new CityInfoView(() => this.exitToHome());
    }

    exitToHome(): void {
        this.screenSwitcher.switchToScreen({ type: "home" });
      }

    getView(): CityInfoView {
		return this.view;
	}

    displayCityInfo(cityName: string): void {
        console.log(`Displaying info for city: ${cityName}`);
        this.view.displayCityInfo(this.model.getCityInfo(cityName) as CityInformationEntry, (city) => this.startMinigame(city));
        this.view.show();
    }

    startMinigame(cityName: string): void {
        console.log(`Starting minigame for city: ${cityName}`);
        if (cityName === "newyork") {
            this.screenSwitcher.switchToScreen({ type: "newyork" });
        } else if (cityName === "boston") {
            this.screenSwitcher.switchToScreen({ type: "boston" });
        } else if (cityName === "dc") {
            this.screenSwitcher.switchToScreen({ type: "dc" });
        } else if (cityName === "losangeles") {
            this.screenSwitcher.switchToScreen({ type: "losangeles" });
        } else if (cityName === "sandiego") {
            this.screenSwitcher.switchToScreen({ type: "sandiego" });
        } else if (cityName === "chicago") {
            this.screenSwitcher.switchToScreen({ type: "chicago" });
        } else {
            console.warn(`No minigame available for city: ${cityName}`);
        }
    }

}