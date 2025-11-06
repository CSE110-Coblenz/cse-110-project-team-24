/**
 * Constants for New York Screen game configuration
 */

import { STAGE_WIDTH } from "../../constants.ts";

// Taxi configuration
export const TAXI_BASE_WIDTH = 500;
export const TAXI_BASE_HEIGHT = 150;
export const TAXI_SCALE = 0.8;
export const TAXI_WIDTH = TAXI_BASE_WIDTH * TAXI_SCALE; // 400
export const TAXI_HEIGHT = TAXI_BASE_HEIGHT * TAXI_SCALE; // 120

// Road configuration
export const ROAD_WIDTH = STAGE_WIDTH;
export const ROAD_HEIGHT_PERCENT = 0.4; // 35% of stage height for each road
export const ROAD_SPACING_PERCENT = 0.2; // 15% of stage height for spacing between roads

// Animation configuration
export const TAXI_SPEED = 7; // pixels per frame

// Text bubble configuration
export const TEXT_BUBBLE_X_OFFSET = -TAXI_WIDTH * 0; // Left offset from taxi center
export const TEXT_BUBBLE_Y_OFFSET = -TAXI_HEIGHT * 1.15; // Up offset from taxi center
