import Konva from "konva";
import { Text } from "./Text.ts";
import {
  TEXT_BUBBLE_X_OFFSET,
  TEXT_BUBBLE_Y_OFFSET,
  TAXI_WIDTH,
  TAXI_HEIGHT,
} from "./constants.ts";

/**
 * Taxi utilities for creating taxi groups
 */
export class Taxi {
  /**
   * Create a taxi group with rectangle and text
   * @param x - X position of the taxi
   * @param y - Y position of the taxi
   * @param text - Text to display on the taxi
   * @param width - Width of the taxi
   * @param height - Height of the taxi
   * @param flipHorizontal - Flip the image horizontally (default: false)
   * @returns A Konva.Group containing the taxi rectangle and text
   */
  static createTaxi(
    x: number,
    y: number,
    text: string,
    width: number = 100,
    height: number = 100,
    flipHorizontal: boolean = false
  ): Konva.Group {
    const taxiGroup = new Konva.Group({
      x: x,
      y: y,
    });

    // Load taxi image (or fallback to yellow rectangle if image fails)
    // Replace "/taxi.png" with your actual taxi image path
    Konva.Image.fromURL(
      "/taxi.png",
      (img) => {
        img.width(width);
        img.height(height);
        img.x(0);
        img.y(0);
        // Flip image horizontally if requested
        if (flipHorizontal) {
          img.scaleX(-1);
          img.x(width); // Adjust x position when flipped
        }
        // Remove any existing rectangle placeholder
        const existingRect = taxiGroup.children.find(
          (child) => child instanceof Konva.Rect
        );
        if (existingRect) {
          existingRect.destroy();
        }
        // Insert image at index 0 (before text)
        taxiGroup.add(img);
        img.moveToBottom(); // Put image behind text
        taxiGroup.getLayer()?.draw();
      },
      (_error) => {
        // Fallback: use yellow rectangle if image fails to load
        const taxi = new Konva.Rect({
          x: 0,
          y: 0,
          width: width,
          height: height,
          fill: "#FFD700", // Yellow
        });
        taxiGroup.add(taxi);
        taxi.moveToBottom();
      }
    );

    // Add temporary rectangle as placeholder while image loads
    const placeholder = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: "#FFD700", // Yellow
    });
    taxiGroup.add(placeholder);

    // Create text bubble centered on the taxi image
    const textBubble = Text.createTextBubble(text, width, height);
    // Position bubble using constants
    // Scale offsets based on actual width/height vs default TAXI dimensions
    const scaleX = width / TAXI_WIDTH;
    const scaleY = height / TAXI_HEIGHT;
    textBubble.x(TEXT_BUBBLE_X_OFFSET * scaleX);
    textBubble.y(TEXT_BUBBLE_Y_OFFSET * scaleY);
    taxiGroup.add(textBubble);

    return taxiGroup;
  }
}
