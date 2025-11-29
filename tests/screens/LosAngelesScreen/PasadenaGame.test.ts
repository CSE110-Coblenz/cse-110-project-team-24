import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  startPDGame,
  cleanupPDGame,
  resetPDScore,
} from "../../../src/screens/LosAngelesScreen/PasadenaGame";

// ---------------------------------------------------
// Konva Mock (Vitest)
// ---------------------------------------------------
vi.mock("konva", () => {
  class MockNode {
    add = vi.fn();
    destroy = vi.fn();
    destroyChildren = vi.fn();
    moveToTop = vi.fn();
    find = vi.fn(() => []);
    listening = vi.fn();
    on = vi.fn();
    draw = vi.fn();
  }

  class Group extends MockNode {
    private _visible: boolean;
    constructor(config: any = {}) {
      super();
      this._visible = config.visible ?? true;
    }
    visible = vi.fn((value?: boolean) => {
      if (value !== undefined) this._visible = value;
      return this._visible;
    });
  }

  class Rect extends MockNode {
    width = vi.fn();
    height = vi.fn();
    fill = vi.fn();
    stroke = vi.fn();
    strokeWidth = vi.fn();
  }

  class Text extends MockNode {
    private _text: string;
    constructor(config: any = {}) {
      super();
      this._text = config.text ?? "";
    }
    text = vi.fn((value?: string) => {
      if (value !== undefined) this._text = value;
      return this._text;
    });
  }

  class Layer extends MockNode {}

  const exported = { Group, Rect, Text, Layer };
  return { ...exported, default: exported };
});

import Konva from "konva";
const createLayer = () => new Konva.Layer();

// ---------------------------------------------------
// Pasadena Game Tests
// ---------------------------------------------------
describe("Pasadena Game (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetPDScore();
    vi.useFakeTimers();
  });

  test("startPDGame creates popup and draws layer", () => {
    const layer = createLayer();
    startPDGame(layer as unknown as Konva.Layer);

    expect(layer.add).toHaveBeenCalled();
    expect(layer.draw).toHaveBeenCalled();
  });

  test("cleanupPDGame removes children and redraws", () => {
    const layer = createLayer();
    cleanupPDGame(layer as unknown as Konva.Layer);

    expect(layer.destroyChildren).toHaveBeenCalled();
    expect(layer.draw).toHaveBeenCalled();
  });

  // ---------------------------------------------------
  //               STRESS TESTS
  // ---------------------------------------------------

  test(" Stress: repeatedly start game 100 times without error", () => {
    const layer = createLayer();

    for (let i = 0; i < 100; i++) {
      startPDGame(layer as unknown as Konva.Layer);
    }

    expect(layer.add).toHaveBeenCalled();
    expect(layer.draw).toHaveBeenCalled();
  });

  test(" Stress: repeatedly cleanup 100 times without error", () => {
    const layer = createLayer();

    for (let i = 0; i < 100; i++) {
      cleanupPDGame(layer as unknown as Konva.Layer);
    }

    expect(layer.destroyChildren).toHaveBeenCalled();
    expect(layer.draw).toHaveBeenCalled();
  });

  test(" Stress: alternating start → cleanup cycles 100 times", () => {
    const layer = createLayer();

    for (let i = 0; i < 100; i++) {
      startPDGame(layer as unknown as Konva.Layer);
      cleanupPDGame(layer as unknown as Konva.Layer);
    }

    expect(layer.add).toHaveBeenCalled();
    expect(layer.destroyChildren).toHaveBeenCalled();
  });

  test(" Stress: startPDGame adds a consistent number of nodes per run", () => {
    const layer = createLayer();

    startPDGame(layer as any);
    const initialAddCalls = layer.add.mock.calls.length;
    const repeats = 50;

    // repeat many times
    for (let i = 0; i < repeats; i++) {
      startPDGame(layer as any);
    }

    const laterAddCalls = layer.add.mock.calls.length;

    // Each invocation should add the same number of nodes
    expect(laterAddCalls).toBe(initialAddCalls * (repeats + 1));
  });

  test(" Stress: resetting score 200 times does not break", () => {
    for (let i = 0; i < 200; i++) {
      resetPDScore();
    }

    // no crash = success
    expect(true).toBe(true);
  });
});
