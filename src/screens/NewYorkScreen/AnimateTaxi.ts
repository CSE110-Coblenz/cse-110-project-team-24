import Konva from "konva";
import { STAGE_WIDTH } from "../../constants.ts";

/**
 * Interface for taxi animation control
 */
export interface TaxiAnimation {
  /**
   * Start the animation
   */
  start(): void;

  /**
   * Stop the animation
   */
  stop(): void;
}

/**
 * Create animation for a taxi moving left to right
 * @param taxi - The taxi group to animate
 * @param layer - The Konva layer the animation runs on
 * @param taxiWidth - Width of the taxi (for reset positioning)
 * @param speed - Movement speed in pixels per frame (default: 2)
 * @param onReset - Optional callback called when taxi resets position
 * @returns TaxiAnimation interface for controlling the animation
 */
export function createLeftToRightAnimation(
  taxi: Konva.Group,
  layer: Konva.Layer,
  taxiWidth: number,
  speed: number = 2,
  onReset?: () => void
): TaxiAnimation {
  const animation = new Konva.Animation((frame) => {
    if (!frame) return;

    // Move taxi from left to right
    taxi.x(taxi.x() + speed);

    // Reset position when it goes off-screen right
    if (taxi.x() > STAGE_WIDTH) {
      taxi.x(-taxiWidth);
      // Call callback to update fact if provided
      onReset?.();
    }
  }, layer);

  return {
    start: () => animation.start(),
    stop: () => animation.stop(),
  };
}

/**
 * Create animation for a taxi moving right to left
 * @param taxi - The taxi group to animate
 * @param layer - The Konva layer the animation runs on
 * @param taxiWidth - Width of the taxi (for reset positioning)
 * @param speed - Movement speed in pixels per frame (default: 2)
 * @param onReset - Optional callback called when taxi resets position
 * @returns TaxiAnimation interface for controlling the animation
 */
export function createRightToLeftAnimation(
  taxi: Konva.Group,
  layer: Konva.Layer,
  taxiWidth: number,
  speed: number = 2,
  onReset?: () => void
): TaxiAnimation {
  const animation = new Konva.Animation((frame) => {
    if (!frame) return;

    // Move taxi from right to left
    taxi.x(taxi.x() - speed);

    // Reset position when it goes off-screen left
    if (taxi.x() < -taxiWidth) {
      taxi.x(STAGE_WIDTH);
      // Call callback to update fact if provided
      onReset?.();
    }
  }, layer);

  return {
    start: () => animation.start(),
    stop: () => animation.stop(),
  };
}
