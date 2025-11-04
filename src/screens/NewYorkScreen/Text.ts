import Konva from "konva";

/**
 * Text utilities for creating speech bubble components
 */
export class Text {
  /**
   * Create a speech bubble with text content
   * @param text - Text to display in the bubble
   * @param width - Width of the bubble
   * @param height - Height of the bubble
   * @returns A Konva.Group containing the speech bubble
   */
  static createTextBubble(
    text: string,
    width: number = 100,
    height: number = 100
  ): Konva.Group {
    const textGroup = new Konva.Group({
      x: 0,
      y: 0,
    });

    // Create rounded rectangle for the bubble body
    const bubble = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: "white",
      stroke: "black",
      strokeWidth: 2,
      cornerRadius: 10,
    });
    textGroup.add(bubble);

    // Add text content centered in the bubble
    const textContent = new Konva.Text({
      x: 0,
      y: 0,
      width: width,
      height: height,
      text: text,
      fontSize: 24,
      fontFamily: "Arial",
      fill: "black",
      align: "center",
      verticalAlign: "middle",
    });
    textGroup.add(textContent);

    return textGroup;
  }
}
