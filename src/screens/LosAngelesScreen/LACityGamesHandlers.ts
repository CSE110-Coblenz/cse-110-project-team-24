// cityInteraction.ts
import Konva from "konva";
import { startLAXGame } from "./LAXgame";
import { startSMGame } from "./SMgame";
import { startUSGame } from "./UnionStationGame";
import { startLBGame } from "./LongBeachGame.ts";


export function handleCityClick(cityName: string, layer: Konva.Layer) {
  if (cityName === "LAX Airport") {
    startLAXGame(layer);
  } else if (cityName == "Santa Monica"){
    startSMGame(layer);
  } else if (cityName == "Union Station"){
    startUSGame(layer);
  } else if (cityName == "Long Beach"){
    startLBGame(layer);
  }else {
    alert(`Only LAX game! ${cityName} is still under development!`);
  }
}
