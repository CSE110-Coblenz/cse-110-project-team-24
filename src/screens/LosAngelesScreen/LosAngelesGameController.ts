import type { ScreenSwitcher } from "../../types";
import { LAMapView } from "./LosAngelesGameView";


export class LAMapController {
 private view: LAMapView;
 private screenSwitcher: ScreenSwitcher;


 constructor(screenSwitcher: ScreenSwitcher) {
   this.screenSwitcher = screenSwitcher;
   this.view = new LAMapView(this.screenSwitcher);
 }


 startGame(): void {
   document.title = "Los Angeles Game";
   this.view.drawAll();
 }


 getView() {
   return this.view;
 }


   hide(): void {
   this.view.getGroup().visible(false);
 }


 show(): void {
   this.view.getGroup().visible(true);
 }


}



