import Konva from "konva";
import type { ScreenSwitcher } from "../../types";

import { startBBGame } from "./BurbankGame";
import { startHWGame } from "./HollywoodGame";
import { startIGGame } from "./InglewoodGame";
import { startLAXGame } from "./LAXgame";
import { startLBGame } from "./LongBeachGame";
import { startMPGame } from "./MontereyParkGame";
import { startPDGame } from "./PasadenaGame";
import { startSFSGame } from "./SantaFeSpringsGame";
import { startSMGame } from "./SantaMonicaGame";
import { startUSGame } from "./UnionStationGame";

export class LAMapView {
  private group: Konva.Group;
  private layer: Konva.Layer;
  private screenSwitcher: ScreenSwitcher;

  constructor(screenSwitcher: ScreenSwitcher) {
    this.group = new Konva.Group({ visible: false });
    this.layer = new Konva.Layer();
    this.layer.add(this.group);
    this.screenSwitcher = screenSwitcher;
  }

  getGroup(): Konva.Group {
    return this.group;
  }

  drawAll(): void {
    this.drawBase();
    // this.printIntro();
    this.drawHighways();
    this.drawCities();
    this.drawRegions();
    this.drawDirection();
    this.writeStatus();
    this.drawFinishBtn();
    this.group.visible(true);
    this.group.getStage()?.draw();
  }

  private drawBase(): void {
    const sea = new Konva.Rect({
      x: 0,
      y: 0,
      width: 250,
      height: 700,
      fill: "#78BFEA",
    });
    sea.listening(false);
    this.group.add(sea);

    const sea2 = new Konva.Rect({
      x: 0,
      y: 0,
      width: 600,
      height: 4000,
      fill: "#78BFEA",
    });
    sea2.listening(false);
    this.group.add(sea2);

    const land = new Konva.Rect({
      x: 250,
      y: 0,
      width: 4000,
      height: 620,
      fill: "#E8D4A2",
    });
    land.listening(false);
    this.group.add(land);

    const land2 = new Konva.Rect({
      x: 600,
      y: 600,
      width: 4000,
      height: 4000,
      fill: "#E8D4A2",
    });
    land2.listening(false);
    this.group.add(land2);

    const mountains = new Konva.Shape({
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(0, 200);
        ctx.lineTo(200, 100);
        ctx.lineTo(400, 150);
        ctx.lineTo(600, 80);
        ctx.lineTo(900, 120);
        ctx.lineTo(1200, 80);
        ctx.lineTo(1500, 120);
        ctx.lineTo(1500, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStrokeShape(shape);
      },
      fill: "#9CCB7A",
    });
    mountains.listening(false);
    this.group.add(mountains);
    const dialog = new Konva.Rect({
      x: 900,
      y: 175,
      width: 400,
      height: 200,
      fill: "#f1efecff",
    });
    dialog.listening(false);
    dialog.moveToTop();
    this.group.add(dialog);
    const txt = new Konva.Text({
      x: 950,
      y: 200,
      text: "Game Rule: \nClick on each community \non the map. \n\nExplore the city by answering questions. \n\nWelcome to The City Of Angels!",
      fontSize: 16,
      fill: "#444",
      fontStyle: "bold",
    });
    txt.listening(false);
    txt.moveToTop();
    this.group.add(txt);
  }

  private drawHighways(): void {
    this.drawHighway([400, 50, 700, 700], "I-5", "#555");
    this.drawHighway([600, 300, 500, 620], "I-710", "#333");
    this.drawHighway([700, 300, 600, 650], "I-605", "#333");
    this.drawHighway([700, 300, 680, 190], "I-605", "#333");
    this.drawHighway([250, 300, 900, 300], "I-10", "#444");
    this.drawHighway([300, 300, 700, 700], "I-405", "#444");
    this.drawHighway([300, 300, 420, 100], "I-405", "#444");
    this.drawHighway([500, 190, 700, 190], "I-210", "#444");
    this.drawHighway([500, 190, 400, 50], "I-210", "#444");
    this.drawHighway([700, 190, 850, 300], "I-210", "#444");
  }

  private drawHighway(points: number[], label: string, color: string): void {
    const line = new Konva.Line({
      points,
      stroke: color,
      strokeWidth: 4,
      lineCap: "round",
      lineJoin: "round",
    });
    line.listening(false);
    this.group.add(line);

    const text = new Konva.Text({
      x: points[0],
      y: points[1] - 20,
      text: label,
      fontSize: 16,
      fontStyle: "bold",
      fill: color,
    });
    text.listening(false);
    this.group.add(text);
  }

  private drawCities(): void {
    const cities = [
      { name: "Santa Monica", id: "#SM", x: 250, y: 320 },
      { name: "Inglewood", id: "#IG", x: 330, y: 310 },
      { name: "Hollywood", id: "#HW", x: 450, y: 210 },
      { name: "Union Station", id: "#US", x: 510, y: 290 },
      { name: "Monterey Park", id: "#MP", x: 610, y: 320 },
      { name: "Santa Fe Springs", id: "#SFS", x: 640, y: 560 },
      { name: "Long Beach", id: "#LB", x: 500, y: 620 },
      { name: "LAX Airport", id: "#LAX", x: 300, y: 360 },
      { name: "Pasadena", id: "#PD", x: 620, y: 200 },
      { name: "Burbank", id: "#PD2", x: 420, y: 130 },
    ];

    for (const city of cities) {
      const circle = new Konva.Circle({
        id: city.id,
        x: city.x,
        y: city.y,
        radius: 6,
        fill: "#D9534F",
      });
      const text = new Konva.Text({
        x: city.x + 10,
        y: city.y - 8,
        text: city.name,
        fontSize: 14,
        fill: "#4412d9ff",
      });
      circle.listening(true);
      if (isCityCompleted(city.name)) {
        this.writeStatus();
        circle.fill("green");
      }
      circle.on("click", () => {
        handleCityClick(city.name, this.layer);
        if (isCityCompleted(city.name)) {
          this.writeStatus();
          circle.fill("green");
        }
      });

      this.group.add(circle);
      this.group.add(text);
    }
  }

  private drawDirection(): void {
    const direction = new Konva.Text({
      x: 820,
      y: 650,
      text: "North ↑",
      fontSize: 16,
      fill: "#333",
    });
    direction.listening(false);
    this.group.add(direction);
  }

  private drawRegions(): void {
    const regionDefs = [
      {
        fill: "rgba(0,8,255,0.15)",
        points: [250, 150, 400, 150, 400, 250, 300, 250, 300, 400, 250, 400],
      },
      {
        fill: "rgba(42,221,39,0.15)",
        points: [300, 250, 400, 250, 400, 620, 250, 620, 250, 400, 300, 400],
      },
      {
        fill: "rgba(255,0,0,0.1)",
        points: [400, 150, 600, 150, 600, 400, 400, 400],
      },
      {
        fill: "rgba(255,174,0,0.1)",
        points: [600, 100, 900, 100, 900, 400, 600, 400],
      },
      {
        fill: "rgba(0,200,255,0.15)",
        points: [400, 400, 700, 400, 700, 620, 400, 620],
      },
      {
        fill: "rgba(95,69,20,0.19)",
        points: [250, 20, 500, 20, 500, 150, 250, 150],
      },
    ];

    regionDefs.forEach((r) => {
      const shape = new Konva.Shape({
        sceneFunc: (ctx, shape) => {
          ctx.beginPath();
          for (let i = 0; i < r.points.length; i += 2) {
            const x = r.points[i];
            const y = r.points[i + 1];
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fillStrokeShape(shape);
        },
        fill: r.fill,
      });
      shape.listening(false);
      this.group.add(shape);
    });

    const labels = [
      { text: "Westside", x: 280, y: 200 },
      { text: "Downtown LA", x: 433, y: 350 },
      { text: "San Gabriel Valley", x: 700, y: 350 },
      { text: "Gateway", x: 420, y: 580 },
      { text: "South Bay", x: 300, y: 410 },
      { text: "San Fernado Valley", x: 300, y: 50 },
    ];
    labels.forEach((r) => {
      this.group.add(
        new Konva.Text({
          x: r.x,
          y: r.y,
          text: r.text,
          fontSize: 16,
          fill: "#444",
          fontStyle: "bold",
        })
      );
    });
  }

  private writeStatus(): void {
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

    const offset = 260;
    const shift = 175;

    this.group.add(
      new Konva.Rect({
        x: 0,
        y: offset,
        width: 200,
        height: 440,
        fill: "#ffffff",
      })
    );

    this.group.add(
      new Konva.Text({
        x: 0,
        y: offset,
        text: "Cities",
        fontSize: 16,
        fill: "#444",
        fontStyle: "bold",
      })
    );
    this.group.add(
      new Konva.Text({
        x: shift - 50,
        y: offset,
        text: "Explored",
        fontSize: 16,
        fill: "#444",
        fontStyle: "bold",
      })
    );

    cities.forEach((c, i) => {
      const status = isCityCompleted(c);
      const result = status ? "✅" : "❌";
      this.group.add(
        new Konva.Text({
          x: 0,
          y: offset + 40 * (i + 1),
          text: c,
          fontSize: 16,
          fill: "#444",
        })
      );
      this.group.add(
        new Konva.Text({
          x: shift,
          y: offset + 40 * (i + 1),
          text: result,
          fontSize: 16,
          fill: "#444",
        })
      );
    });
  }

  private drawFinishBtn(): void {
    const btn = new Konva.Rect({
      x: 300,
      y: 630,
      width: 100,
      height: 50,
      fill: "#36ef0cff",
      cornerRadius: 8,
      shadowBlur: 4,
    });
    const text = new Konva.Text({
      x: 320,
      y: 640,
      text: "Finish",
      fontSize: 16,
      fill: "#444",
      fontStyle: "bold",
    });
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
    // let finish = true;
    btn.on("click", () => {
      let finish = true;
      for (let c of cities) {
        if (isCityCompleted(c) === false) {
          finish = false;
          alert(`City: ${c} not yet explored.`);
          break;
        }
      }
      if (finish) this.screenSwitcher.switchToScreen({ type: "home" });
      else {
        alert("Please explore all communities in LA before leaving! ");
      }
    });
    this.group.add(btn);
    this.group.add(text);
  }
}

let cityProgress: Record<string, boolean> = {
  Burbank: false,
  Hollywood: false,
  Inglewood: false,
  "LAX Airport": false,
  "Long Beach": false,
  "Monterey Park": false,
  Pasadena: false,
  "Santa Fe Springs": false,
  "Santa Monica": false,
  "Union Station": false,
};

function isCityCompleted(city: string): boolean {
  return cityProgress[city];
}

function handleCityClick(city: string, layer: Konva.Layer): void {
  const stage = Konva.stages[0];
  if (!layer.getStage() && stage) {
    console.warn("Layer not attached. Attaching to global stage...");
    stage.add(layer);
  }
  if (cityProgress[city] === false) {
    // group.visible(false);
    switch (city) {
      case "Burbank":
        startBBGame(layer);
        break;
      case "Hollywood":
        startHWGame(layer);
        break;
      case "Inglewood":
        startIGGame(layer);
        break;
      case "LAX Airport":
        startLAXGame(layer);
        break;
      case "Long Beach":
        startLBGame(layer);
        break;
      case "Monterey Park":
        startMPGame(layer);
        break;
      case "Pasadena":
        startPDGame(layer);
        break;
      case "Santa Fe Springs":
        startSFSGame(layer);
        break;
      case "Santa Monica":
        startSMGame(layer);
        break;
      case "Union Station":
        startUSGame(layer);
        break;
      default:
        alert(`No game found for ${city}`);
    }
  } else {
    alert(`${city} is already completed.`);
    // return;
  }
  cityProgress[city] = true;
}
