import Konva from "konva";

const tile = 32;
const cols = 26;
const rows = 18;

const H = rows * tile;
const W = cols * tile;

export class createMaze {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  constructor(containerId: string) {
    this.stage = new Konva.Stage({
      container: containerId,
      width: W,
      height: H,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.drawGrid();
  }

  private drawGrid(): void {
    // grid = 1 => has wall, cannot move. grid = 0 => path, can move
    const g = Array.from({ length: rows }, (_, j) =>
      Array.from({ length: cols }, (_, i) =>
        j === 0 || j === rows - 1 || i === 0 || i === cols - 1 ? 1 : 0
      )
    );
    for (let i = 4; i < 20; i++) g[5][i] = 1;
    for (let i = 6; i < 20; i++) g[5][i] = 1;
    for (let i = 4; i < 20; i++) g[5][i] = 1;
    // add more wall
  }
}
