import Konva from "konva";
import type { Museum } from "./Museum.ts";
import { MuseumNode } from "./MuseumNode.ts";

export interface LayoutConfig {
  center: { x: number; y: number };
  radius: number;
}

export class MuseumCollection {
  private readonly group: Konva.Group;
  private readonly nodes: Map<string, MuseumNode> = new Map();
  private museums: Museum[] = [];

  constructor(group: Konva.Group) {
    this.group = group;
  }

  setMuseums(museums: Museum[]): void {
    this.museums = [...museums];
    const incomingIds = new Set(this.museums.map((museum) => museum.id));

    for (const [id, node] of this.nodes.entries()) {
      if (!incomingIds.has(id)) {
        node.getGroup().destroy();
        this.nodes.delete(id);
      }
    }

    for (const museum of this.museums) {
      if (!this.nodes.has(museum.id)) {
        const node = new MuseumNode(museum, { x: 0, y: 0 });
        this.group.add(node.getGroup());
        this.nodes.set(museum.id, node);
      }
    }
  }

  layout({ center, radius }: LayoutConfig): void {
    if (this.museums.length === 0) return;

    this.museums.forEach((museum, index) => {
      const angle = (index / this.museums.length) * Math.PI * 2 - Math.PI / 2;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);

      const node = this.nodes.get(museum.id);
      node?.setPosition({ x, y });
    });
  }

  markMatched(museumId: string): void {
    this.nodes.get(museumId)?.markMatched();
  }

  hitTest(point: { x: number; y: number }): string | null {
    for (const [museumId, node] of this.nodes.entries()) {
      if (node.isHit(point)) {
        return museumId;
      }
    }
    return null;
  }
}
