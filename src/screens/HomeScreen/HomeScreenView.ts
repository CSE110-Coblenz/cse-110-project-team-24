import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import type { City } from "./GameScreenModel.ts";

/**
 * GameScreenView - Renders the US map and interactive city nodes
 */
export class GameScreenView implements View {
  private group: Konva.Group;
  private mapLayer: Konva.Group;
  private nodesLayer: Konva.Group;
  private edgesLayer: Konva.Group;
  private onCityClick: ((city: City) => void) | null = null;

  private cityPositions: Record<City, { x: number; y: number }>; // pixel positions on 800x600 map
  private cityCircles: Partial<Record<City, Konva.Circle>> = {};
  private cityLabels: Partial<Record<City, Konva.Text>> = {};
  private hoverTooltip: Konva.Rect | null = null;

  constructor(_unused?: () => void) {
    this.group = new Konva.Group({ visible: false });
    this.mapLayer = new Konva.Group();
    this.edgesLayer = new Konva.Group();
    this.nodesLayer = new Konva.Group();
    this.group.add(this.mapLayer);
    this.group.add(this.edgesLayer);
    this.group.add(this.nodesLayer);

    // Load US map image as background (place USmap.png in /public and refer as /USmap.png)
    Konva.Image.fromURL("/USmap.png", (img) => {
      img.setAttrs({ x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT });
      this.mapLayer.add(img);
      this.group.getLayer()?.draw();
    });

    // Hardcoded positions (approximate) for a baseline 800x600 canvas
    this.cityPositions = {
      "Boston": { x: 700, y: 155 },
      "New York": { x: 672, y: 188 },
      "Washington, D.C.": { x: 645, y: 240 },
      "Chicago": { x: 505, y: 210 },
      "Los Angeles": { x: 125, y: 350 },
      "San Diego": { x: 135, y: 380 },
    };

    // Scale helpers from baseline (800x600) to current stage size
    const BASE_WIDTH = 800;
    const BASE_HEIGHT = 600;
    const scaleX = STAGE_WIDTH / BASE_WIDTH;
    const scaleY = STAGE_HEIGHT / BASE_HEIGHT;
    const scalePoint = (p: { x: number; y: number }) => ({ x: p.x * scaleX, y: p.y * scaleY });

    // Create a reusable hover tooltip (blank) shown above hovered city
    const tooltipWidth = 160;
    const tooltipHeight = 160;
    this.hoverTooltip = new Konva.Rect({
      x: -1000,
      y: -1000,
      width: tooltipWidth,
      height: tooltipHeight,
      fill: "#ffffff",
      stroke: "#999",
      strokeWidth: 1,
      cornerRadius: 6,
      visible: false,
      listening: false,
      shadowColor: "#000",
      shadowBlur: 10,
      shadowOpacity: 0.06,
    });
    this.nodesLayer.add(this.hoverTooltip);

    // Draw connections (must match controller/model graph)
    const edges: Array<[City, City]> = [
      ["Boston", "New York"],
      ["New York", "Washington, D.C."],
      ["New York", "Chicago"],
      ["Chicago", "Los Angeles"],
      ["Los Angeles", "San Diego"],
    ];
    for (const [a, b] of edges) {
      const pa = scalePoint(this.cityPositions[a]);
      const pb = scalePoint(this.cityPositions[b]);
      const line = new Konva.Line({
        points: [pa.x, pa.y, pb.x, pb.y],
        stroke: "#333",
        strokeWidth: 2,
        lineCap: "round",
        lineJoin: "round",
      });
      this.edgesLayer.add(line);
    }

    // Draw city nodes (open circles) and labels
    const nodeRadius = 8;
    const hoverScale = 1.25;
    const cities: City[] = [
      "Boston",
      "Washington, D.C.",
      "Chicago",
      "New York",
      "Los Angeles",
      "San Diego",
    ];
    for (const city of cities) {
      const pos = scalePoint(this.cityPositions[city]);
      const circle = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: nodeRadius,
        fill: "rgba(0,0,0,0)",
        stroke: "#1f6feb",
        strokeWidth: 3,
        listening: true,
      });
      circle.on("mouseenter", () => {
        circle.scale({ x: hoverScale, y: hoverScale });
        document.body.style.cursor = "pointer";
        if (this.hoverTooltip) {
          this.hoverTooltip.position({
            x: pos.x - tooltipWidth / 2,
            y: pos.y - (nodeRadius + 24) - tooltipHeight,
          });
          this.hoverTooltip.visible(true);
          this.hoverTooltip.moveToTop();
        }
        this.group.getLayer()?.draw();
      });
      circle.on("mouseleave", () => {
        circle.scale({ x: 1, y: 1 });
        document.body.style.cursor = "default";
        if (this.hoverTooltip) {
          this.hoverTooltip.visible(false);
        }
        this.group.getLayer()?.draw();
      });
      circle.on("click", () => {
        this.onCityClick?.(city);
      });
      this.nodesLayer.add(circle);
      this.cityCircles[city] = circle;

      const label = new Konva.Text({
        x: pos.x,
        y: pos.y - (nodeRadius + 18),
        text: city,
        fontSize: 16,
        fontFamily: "Arial",
        fill: "#111",
        align: "center",
      });
      // Center label horizontally over the circle
      label.offsetX(label.width() / 2);
      this.nodesLayer.add(label);
      this.cityLabels[city] = label;
    }
  }

  setCityClickHandler(handler: (city: City) => void): void {
    this.onCityClick = handler;
  }

  show(): void {
    this.group.visible(true);
    this.group.getLayer()?.draw();
  }

  hide(): void {
    this.group.visible(false);
    this.group.getLayer()?.draw();
  }

  getGroup(): Konva.Group {
    return this.group;
  }
}
