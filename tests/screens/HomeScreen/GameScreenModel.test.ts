import { describe, it, expect, beforeEach } from "vitest";
import { GameScreenModel, type City } from "../../../src/screens/HomeScreen/GameScreenModel.ts";

describe("HomeScreen GameScreenModel", () => {
  let model: GameScreenModel;

  beforeEach(() => {
    model = new GameScreenModel();
  });

  it("reset() sets current city to Boston", () => {
    // Move somewhere else first
    model.travelTo("New York");
    expect(model.getCurrentCity()).toBe("New York");

    model.reset();
    expect(model.getCurrentCity()).toBe("Boston");
  });

  it("getConnectedCities() returns neighbors of current or given city", () => {
    // Default current is Boston
    expect(model.getConnectedCities()).toEqual(["New York"]);
    // Explicit city
    expect(model.getConnectedCities("Chicago")).toEqual(["New York", "Los Angeles"]);
  });

  it("canTravelTo() correctly validates adjacency", () => {
    // From Boston
    expect(model.canTravelTo("New York")).toBe(true);
    expect(model.canTravelTo("Chicago")).toBe(false);
  });

  it("travelTo() moves when valid and rejects invalid moves", () => {
    // Valid move
    expect(model.travelTo("New York")).toBe(true);
    expect(model.getCurrentCity()).toBe("New York");
    // Invalid move from New York to San Diego (not directly connected)
    expect(model.travelTo("San Diego")).toBe(false);
    expect(model.getCurrentCity()).toBe("New York");
  });

  it("getEdges() returns unduplicated edges with lexical ordering", () => {
    const edges = model.getEdges();
    // Should contain known connections
    expect(edges).toEqual(
      expect.arrayContaining([
        ["Boston", "New York"],
        ["Chicago", "New York"],
        ["New York", "Washington, D.C."],
        ["Chicago", "Los Angeles"],
        ["Los Angeles", "San Diego"],
      ])
    );
    // No duplicates (set size equals array length)
    const asStrings = edges.map((e) => e.join("->"));
    expect(new Set(asStrings).size).toBe(asStrings.length);
  });

  it("getGraph() exposes expected cities and adjacency", () => {
    const graph = model.getGraph();
    expect(graph.cities).toEqual([
      "Boston",
      "Washington, D.C.",
      "Chicago",
      "New York",
      "Los Angeles",
      "San Diego",
    ]);
    expect(graph.adjacency["Chicago"]).toEqual(["New York", "Los Angeles"]);
  });
});


