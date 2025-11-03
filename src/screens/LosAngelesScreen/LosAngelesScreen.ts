import Konva from "konva";
import { handleCityClick } from "./LACityGamesHandlers";
export class createLAMap {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  constructor(containerId: string) {
    this.stage = new Konva.Stage({
      container: containerId,
      width: 900,
      height: 700,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.drawBase();
    this.drawHighways();
    this.drawCities();
    this.drawDirection();
    this.drawRegions();

  }


  private drawBase(): void {
    const sea = new Konva.Rect({
      x: 0,
      y: 0,
      width: 250,
      height: 700,
      fill: "#78BFEA",
    });
    this.layer.add(sea);

    const sea2 = new Konva.Rect({
      x: 0,
      y: 0,
      width: 600,
      height: 700,
      fill: "#78BFEA",
    });
    this.layer.add(sea2);


    const land = new Konva.Rect({
      x: 250,
      y: 0,
      width: 650,
      height: 620,
      fill: "#E8D4A2",
    });
    this.layer.add(land);
    const land2 = new Konva.Rect({
      x: 600,
      y: 600,
      width: 650,
      height: 620,
      fill: "#E8D4A2",
    });
    this.layer.add(land2);


    const mountains = new Konva.Shape({
      sceneFunc: (context, shape) => {
        context.beginPath();
        context.moveTo(0, 200);
        context.lineTo(200, 100);
        context.lineTo(400, 150);
        context.lineTo(600, 80);
        context.lineTo(900, 120);
        context.lineTo(900, 0);
        context.lineTo(0, 0);
        context.closePath();
        context.fillStrokeShape(shape);
      },
      fill: "#9CCB7A",
    });
    this.layer.add(mountains);
  }


  private drawHighways(): void {
    this.drawHighway([400, 50, 700, 700], "I-5", "#555");
    this.drawHighway([600, 300, 500, 620], "I-710", "#333");
    this.drawHighway([700, 300, 600, 650], "I-605", "#333");
    this.drawHighway([250, 300, 900, 300], "I-10", "#444");
    this.drawHighway([300, 300, 700, 700], "I-405", "#444");
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
    this.layer.add(line);

    const text = new Konva.Text({
      x: points[0],
      y: points[1] - 20,
      text: label,
      fontSize: 16,
      fontStyle: "bold",
      fill: color,
    });
    text.listening(false);
    this.layer.add(text);
  }

  private drawCities(): void {
    const cities = [
      { name: "Santa Monica", id: "#SM", x: 250, y: 320 },
      { name: "Inglewood", id: "#IW", x: 330, y: 310 },
      { name: "Hollywood", id: "#HW", x: 450, y: 210 },
      { name: "Union Station", id: "#US", x: 510, y: 290 },
      { name: "Monterey Park", id: "#MP", x: 610, y: 320 },
      { name: "Santa Fe Springs", id: "#SFS", x: 640, y: 560 },
      { name: "Long Beach", id: "#LB", x: 500, y: 620 },
      { name: "LAX Airport", id: "#LAX", x: 300, y: 360 },
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
        fill: "#222",
      });
        circle.moveToTop();
        circle.on("click", () => {
    handleCityClick(city.name, this.layer);
        });
      this.layer.add(circle);
      this.layer.add(text);
    }
    
    this.layer.draw();
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
    this.layer.add(direction);
  }

 private drawRegions(): void {
  const west = new Konva.Shape({
    sceneFunc: (ctx, shape) => {
      ctx.beginPath();
      ctx.moveTo(250, 150);
      ctx.lineTo(500, 150);
      ctx.lineTo(500, 250);
      ctx.lineTo(300, 250);
      ctx.lineTo(300, 500);
      ctx.lineTo(250, 500);
      ctx.closePath();
      ctx.fillStrokeShape(shape);
    },
    fill: "rgba(0, 8, 255, 0.15)",
  });
  west.listening(false);
  this.layer.add(west);

  const south = new Konva.Shape({
    sceneFunc: (ctx, shape) => {
      ctx.beginPath();
    ctx.moveTo(300, 250);  
    ctx.lineTo(400, 250);  
    ctx.lineTo(400, 500);
    ctx.lineTo(300, 500);
      ctx.closePath();
      ctx.fillStrokeShape(shape);
    },
    fill: "rgba(42, 221, 39, 0.15)",
  });
  south.listening(false);
  this.layer.add(south);

  const central = new Konva.Shape({
    sceneFunc: (ctx, shape) => {
      ctx.beginPath();
      ctx.moveTo(400, 250);
      ctx.lineTo(600, 250);
      ctx.lineTo(600, 500);
      ctx.lineTo(400, 500);
      ctx.closePath();
      ctx.fillStrokeShape(shape);
    },
    fill: "rgba(255, 0, 0, 0.1)", 
  });
  central.listening(false);
  this.layer.add(central);

  const east = new Konva.Shape({
    sceneFunc: (ctx, shape) => {
      ctx.beginPath();
      ctx.moveTo(600, 250);
      ctx.lineTo(900, 250);
      ctx.lineTo(900, 500);
      ctx.lineTo(600, 500);
      ctx.closePath();
      ctx.fillStrokeShape(shape);
    },
    fill: "rgba(255, 174, 0, 0.1)", 
  });
  east.listening(false);
  this.layer.add(east);


  const port = new Konva.Shape({
    sceneFunc: (ctx, shape) => {
      ctx.beginPath();
      ctx.moveTo(250, 500);
      ctx.lineTo(700, 500);
      ctx.lineTo(700, 700);
      ctx.lineTo(300, 700);
      ctx.lineTo(250, 700);
      ctx.closePath();
      ctx.fillStrokeShape(shape);
    },
    fill: "rgba(0, 200, 255, 0.15)", 
  });
  port.listening(false);
  this.layer.add(port);



  const labels = [
    { text: "Westside", x: 280, y: 200 },
    { text: "Downtown LA", x: 450, y: 400 },
    { text: "San Gabriel Valley", x: 700, y: 350 },
    { text: "Port Of LA", x: 420, y: 580 },
    { text: "South Central", x: 300, y: 410 },
  ];

  labels.forEach((r) => {
    this.layer.add(
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


}
