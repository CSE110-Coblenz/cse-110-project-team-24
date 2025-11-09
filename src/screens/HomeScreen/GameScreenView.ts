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
  private onPostcardButtonClick: (() => void) | null = null;

  private cityPositions: Record<City, { x: number; y: number }>; // pixel positions on 800x600 map
  private cityCircles: Partial<Record<City, Konva.Circle>> = {};
  private cityLabels: Partial<Record<City, Konva.Text>> = {};
  private hoverTooltip: Konva.Group | null = null;
  private hoverTooltipRect: Konva.Rect | null = null;
  private hoverTooltipImage: Konva.Image | null = null;
  private hoverTooltipText: Konva.Text | null = null;
  private postcardButton: Konva.Group | null = null;
  
  // City image and description mappings
  private cityImages: Record<City, string> = {
    "Boston": "/popupImages/boston cse110.jpg",
    "New York": "/popupImages/new york cse110.jpg",
    "Washington, D.C.": "/popupImages/washington dc cse110.jpg",
    "Chicago": "/popupImages/chicago cse 110.jpg",
    "Los Angeles": "/popupImages/los angeles cse 110.jpg",
    "San Diego": "/popupImages/san diego cse 110.jpg",
  };
  
  private cityDescriptions: Record<City, string> = {
    "Boston": "Historic city known for its revolutionary past and prestigious universities",
    "New York": "The Big Apple, a vibrant metropolis of culture, finance, and entertainment",
    "Washington, D.C.": "The nation's capital, home to iconic monuments and government",
    "Chicago": "The Windy City, famous for architecture, deep-dish pizza, and Lake Michigan",
    "Los Angeles": "City of Angels, hub of entertainment, beaches, and diverse neighborhoods",
    "San Diego": "America's Finest City, known for perfect weather and beautiful beaches",
  };

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

    // Create a reusable hover tooltip group shown above hovered city
    // Tooltip dimensions - calculated to fit image (180) + padding (20) + spacing (5) + text (40) + padding (20) = 265
    const tooltipWidth = 220;
    const tooltipHeight = 245;
    
    // Create tooltip group
    this.hoverTooltip = new Konva.Group({
      x: -1000,
      y: -1000,
      visible: false,
      listening: false,
    });
    
    // Tooltip background rectangle
    this.hoverTooltipRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: tooltipWidth,
      height: tooltipHeight,
      fill: "#ffffff",
      stroke: "#999",
      strokeWidth: 1,
      cornerRadius: 6,
      shadowColor: "#000",
      shadowBlur: 10,
      shadowOpacity: 0.2,
    });
    this.hoverTooltip.add(this.hoverTooltipRect);
    
    // Tooltip image and text will be created dynamically when showing tooltip
    this.hoverTooltipImage = null;
    this.hoverTooltipText = null;
    
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
          // Update tooltip content for this city
          const imagePath = this.cityImages[city];
          const description = this.cityDescriptions[city];
          const tooltipWidth = 220;
          const tooltipHeight = 245;
          const imageSize = 180;
          const padding = 10;
          const textHeight = 40;
          
          // Remove old image and text if they exist
          if (this.hoverTooltipImage) {
            this.hoverTooltipImage.destroy();
            this.hoverTooltipImage = null;
          }
          if (this.hoverTooltipText) {
            this.hoverTooltipText.destroy();
            this.hoverTooltipText = null;
          }
          
          // Load and create the city image
          Konva.Image.fromURL(imagePath, (imgNode) => {
            if (!this.hoverTooltip) return;
            
            // Create image node
            this.hoverTooltipImage = new Konva.Image({
              x: padding,
              y: padding,
              width: imageSize,
              height: imageSize,
              image: imgNode.image(),
              cornerRadius: 4,
            });
            this.hoverTooltip.add(this.hoverTooltipImage);
            
            // Create description text
            this.hoverTooltipText = new Konva.Text({
              x: padding,
              y: padding + imageSize + 5,
              width: imageSize,
              height: textHeight,
              fontSize: 12,
              fontFamily: "Arial",
              fill: "#333",
              align: "center",
              verticalAlign: "top",
              wrap: "word",
              text: description,
            });
            this.hoverTooltip.add(this.hoverTooltipText);
            
            // Position tooltip above the city node
            this.hoverTooltip.position({
              x: pos.x - tooltipWidth / 2,
              y: pos.y - (nodeRadius + 24) - tooltipHeight,
            });
            this.hoverTooltip.visible(true);
            this.hoverTooltip.moveToTop();
            this.group.getLayer()?.draw();
          });
          
          // Position tooltip immediately (before image loads)
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
          // Clean up image and text when hiding
          if (this.hoverTooltipImage) {
            this.hoverTooltipImage.destroy();
            this.hoverTooltipImage = null;
          }
          if (this.hoverTooltipText) {
            this.hoverTooltipText.destroy();
            this.hoverTooltipText = null;
          }
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

    // Create postcard button in bottom right corner
    this.createPostcardButton();
  }

  /**
   * Create the postcard button in the bottom right corner
   */
  private createPostcardButton(): void {
    const buttonWidth = 140;
    const buttonHeight = 50;
    const padding = 20;
    const buttonX = STAGE_WIDTH - buttonWidth - padding;
    const buttonY = STAGE_HEIGHT - buttonHeight - padding;

    // Create button group
    this.postcardButton = new Konva.Group({
      x: buttonX,
      y: buttonY,
    });

    // Button background
    const buttonRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: buttonWidth,
      height: buttonHeight,
      fill: "#4CAF50",
      stroke: "#45a049",
      strokeWidth: 2,
      cornerRadius: 8,
      shadowColor: "#000",
      shadowBlur: 5,
      shadowOpacity: 0.3,
    });
    this.postcardButton.add(buttonRect);

    // Button text
    const buttonText = new Konva.Text({
      x: buttonWidth / 2,
      y: buttonHeight / 2,
      text: "Postcards",
      fontSize: 18,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "#ffffff",
      align: "center",
      verticalAlign: "middle",
    });
    buttonText.offsetX(buttonText.width() / 2);
    buttonText.offsetY(buttonText.height() / 2);
    this.postcardButton.add(buttonText);

    // Hover effects
    this.postcardButton.on("mouseenter", () => {
      buttonRect.fill("#45a049");
      document.body.style.cursor = "pointer";
      this.group.getLayer()?.draw();
    });

    this.postcardButton.on("mouseleave", () => {
      buttonRect.fill("#4CAF50");
      document.body.style.cursor = "default";
      this.group.getLayer()?.draw();
    });

    // Click handler
    this.postcardButton.on("click", () => {
      this.onPostcardButtonClick?.();
    });

    // Add button to nodes layer
    this.nodesLayer.add(this.postcardButton);
  }

  setCityClickHandler(handler: (city: City) => void): void {
    this.onCityClick = handler;
  }

  setPostcardButtonHandler(handler: () => void): void {
    this.onPostcardButtonClick = handler;
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
