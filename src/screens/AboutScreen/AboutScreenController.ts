import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { AboutScreenView } from "./AboutScreenView.ts";

export class AboutScreenController extends ScreenController {
	private view: AboutScreenView;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.view = new AboutScreenView(() => this.handleBack());
	}

	private handleBack(): void {
		this.screenSwitcher.switchToScreen({ type: "menu" });
	}

	getView(): AboutScreenView {
		return this.view;
	}
}


