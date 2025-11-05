// cityInteraction.ts
import Konva from "konva";
import { startLAXGame } from "./LAXgame";
import { startSMGame } from "./SantaMonicaGame.ts";
import { startUSGame } from "./UnionStationGame";
import { startLBGame } from "./LongBeachGame.ts";
import { startMPGame } from "./MontereyParkGame.ts";
import { startSFSGame } from "./SantaFeSpringsGame.ts";
import { startIGGame } from "./InglewoordGame.ts";
import { startHWGame } from "./HollywoodGame.ts";
import { startPDGame } from "./PasadenaGame.ts";
import { startBBGame } from "./BurbankGame.ts";

interface CityProgress {
  [city: string]: boolean;
}

let cityProgress: CityProgress = {
  Hollywood: false,
  Inglewood: false,
  "Santa Fe Springs": false,
  "Monterey Park": false,
  "Union Station": false,
  "Long Beach": false,
  Pasadena: false,
  Burbank: false 
  // add more cities if necessary
};

export function isCityCompleted(cityName: string): boolean {
  return cityProgress[cityName] === true;
}

function markCityCompleted(cityName: string): void {
  if (!cityProgress[cityName]) {
    cityProgress[cityName] = true;
   /* if (typeof window === "undefined") return;
    window.localStorage.setItem("cityProgress", JSON.stringify(cityProgress));
    console.log(`${cityName} marked as completed.`);*/
  }
}

export function handleCityClick(cityName: string, layer: Konva.Layer) {
  if (typeof window === "undefined") return;
  if (isCityCompleted(cityName)){
    alert(`${cityName} has been explored. Try other cities!`)
  }
  else if (cityName === "LAX Airport") {
    startLAXGame(layer);
    markCityCompleted(cityName);
  } else if (cityName == "Santa Monica"){
    startSMGame(layer);
    markCityCompleted(cityName);
  } else if (cityName == "Union Station"){
    startUSGame(layer);
    markCityCompleted(cityName);
  } else if (cityName == "Long Beach"){
    startLBGame(layer);
    markCityCompleted(cityName);
  } else if (cityName == "Monterey Park"){
    startMPGame(layer);
    markCityCompleted(cityName);
  }
  else if (cityName == "Santa Fe Springs"){
    startSFSGame(layer);
    markCityCompleted(cityName);
  }
  else if (cityName == "Inglewood"){
    startIGGame(layer);
    markCityCompleted(cityName);
  }
  else if (cityName == "Hollywood"){
    startHWGame(layer);
    markCityCompleted(cityName);
  }
  else if (cityName == "Pasadena"){
    startPDGame(layer);
    markCityCompleted(cityName);
  }
  else if (cityName == "Burbank"){
    startBBGame(layer);
    markCityCompleted(cityName);
  }
  else {
    alert(`${cityName} is still under development!`);
  }
}
