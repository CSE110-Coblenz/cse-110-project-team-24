// cityInteraction.ts
import Konva from "konva";
import { startLAXGame } from "./LAXgame";
import { startSMGame } from "./SMgame";


export function handleCityClick(cityName: string, layer: Konva.Layer) {
  if (cityName === "LAX Airport") {
    startLAXGame(layer);
  } else if (cityName == "Santa Monica"){
    startSMGame(layer);
  }else {
    alert(`Only LAX game! ${cityName} is still under development!`);
  }
}
