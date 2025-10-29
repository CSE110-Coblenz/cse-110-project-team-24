import Konva from "konva";

/**
 * Taxi utilities for creating taxi groups
 */
export class Taxi {
  /**
   * Create a taxi group with rectangle and text
   * @param x - X position of the taxi
   * @param y - Y position of the taxi
   * @param text - Text to display on the taxi
   * @returns A Konva.Group containing the taxi rectangle and text
   */
  static createTaxi(x: number, y: number, text: string): Konva.Group {
    const taxiGroup = new Konva.Group({
      x: x,
      y: y,
      width: width,
      height: height,
    });

    const taxi = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: "#FFD700", // Yellow
    });
    taxiGroup.add(taxi);

    const taxiText = new Konva.Text({
      x: 0,
      y: 0,
      width: 100,
      text: text,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
      verticalAlign: "middle",
    });
    taxiGroup.add(taxiText);

    return taxiGroup;
  }
}
