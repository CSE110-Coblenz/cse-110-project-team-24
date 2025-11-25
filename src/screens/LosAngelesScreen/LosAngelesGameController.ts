import type { ScreenSwitcher } from "../../types";
import { LAMapView, cityProgress } from "./LosAngelesGameView";

import { resetHWScore, cleanupHWGame } from "./HollywoodGame";
import { resetBBScore, cleanupBBGame } from "./BurbankGame";
import { resetIGScore, cleanupIGGame } from "./InglewoodGame";
import { resetLBScore, cleanupLBGame } from "./LongBeachGame";
import { resetMPScore, cleanupMPGame } from "./MontereyParkGame";
import { resetSFSScore, cleanupSFSGame } from "./SantaFeSpringsGame";
import { resetSMScore, cleanupSMGame } from "./SantaMonicaGame";
import { resetPDScore, cleanupPDGame } from "./PasadenaGame";
import { resetLAXScore, cleanupLAXGame } from "./LAXgame";
import { resetUSScore, cleanupUSGame } from "./UnionStationGame";


export class LAMapController {
 private view: LAMapView;
 private screenSwitcher: ScreenSwitcher;

  private timerId: number | null = null;
  private startTime = 0;
  private TIME_LIMIT = 1000 * 3 * 60 ; // 3 minutes
  private finished = false;
  // private controller: LAMapController;

 constructor(screenSwitcher: ScreenSwitcher) {
   this.screenSwitcher = screenSwitcher;
   this.view = new LAMapView(this.screenSwitcher, this);
   
 }


 startGame(): void {
   document.title = "Los Angeles Game";
   this.view.drawAll();
    if (this.finished === false){
    this.startTimer();
    }
 }

  private startTimer() {
    this.startTime = Date.now();
    this.stopTimer();  // avoid double timers
      this.timerId = window.setInterval(() => {
        const elapsed = Date.now() - this.startTime;

        this.view.updateTimer(this.TIME_LIMIT - elapsed);

        if (elapsed >= this.TIME_LIMIT) {
          this.onTimeout();
        }
      }, 1000);
  }

  private stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  completeAllCities() {
    this.stopTimer();
    alert("🎉 You finished the game in 3 minutes");
    this.finished = true;
    return true;
  }

  private onTimeout() {
    this.stopTimer();

    // window.location.reload(); 
    resetBBScore();
    resetHWScore();
    resetIGScore();
    resetLAXScore();
    resetLBScore();
    resetMPScore();
    resetPDScore();
    resetSFSScore();
    resetSMScore();
    resetUSScore();

    cleanupHWGame(this.view.getLayer());
    cleanupBBGame(this.view.getLayer());
    cleanupIGGame(this.view.getLayer());
    cleanupLBGame(this.view.getLayer());
    cleanupSMGame(this.view.getLayer());
    cleanupPDGame(this.view.getLayer());
    cleanupLAXGame(this.view.getLayer());
    cleanupUSGame(this.view.getLayer());
    cleanupSFSGame(this.view.getLayer());
    cleanupMPGame(this.view.getLayer());


    const cities = [
      "Burbank",
      "Hollywood",
      "Inglewood",
      "LAX Airport",
      "Long Beach",
      "Monterey Park",
      "Pasadena",
      "Santa Fe Springs",
      "Santa Monica",
      "Union Station",
    ];
    for (let c of cities){
      cityProgress[c] = false;
    }

    this.finished = false;
    alert("❌ You failed the challenges. Please restart the game. ");
    this.screenSwitcher.switchToScreen({ type: "home" });

    return false;
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





