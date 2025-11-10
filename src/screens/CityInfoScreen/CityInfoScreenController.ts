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

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.model = new CityInfoModel();
        this.view = new CityInfoView();
    }

    getView(): CityInfoView {
		return this.view;
	}

}