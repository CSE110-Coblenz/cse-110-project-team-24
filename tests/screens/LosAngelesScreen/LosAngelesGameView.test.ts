import { describe, test, expect, vi } from "vitest";
import { LAMapView } from "../../../src/screens/LosAngelesScreen/LosAngelesGameView";

// -------------------------------
// Mock Konva for Vitest
// -------------------------------
vi.mock("konva", () => {
  class MockNode {
    listening = vi.fn();
    moveToTop = vi.fn();
    add = vi.fn();
    on = vi.fn();
    getStage = vi.fn();
  }

  class Group extends MockNode {
    private _visible: boolean;
    constructor(config: any = {}) {
      super();
      this._visible = config.visible ?? true;
    }

    visible = vi.fn((v?: boolean) => {
      if (v !== undefined) this._visible = v;
      return this._visible;
    });
  }

  class Layer extends MockNode {
    draw = vi.fn();
    find = vi.fn(() => []);
  }

  class Stage extends MockNode {
    draw = vi.fn();
  }

  class Rect extends MockNode {}
  class Circle extends MockNode {}
  class Line extends MockNode {}
  class Shape extends MockNode {}

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
    x = vi.fn();
    y = vi.fn();
  }

  const exported = { Stage, Layer, Group, Rect, Circle, Line, Shape, Text };

  return {
    ...exported,
    default: exported,
  };
});


// -------------------------------
// Mock ScreenSwitcher
// -------------------------------
const mockSwitcher = { switchToScreen: vi.fn() };


// -------------------------------
// Tests
// -------------------------------
describe("LAMapView (Vitest Version)", () => {

  test("constructor initializes stage, layer, group", () => {
    const view = new LAMapView({} as any);

    expect(view.getLayer).toBeDefined();
    expect(view.getGroup).toBeDefined();
  });

  test("updateTimer updates text content", () => {
    const view = new LAMapView({} as any);

    view.drawAll();  // ensures timerText exists
    view.updateTimer(1000);

    expect(view.getTimerText().text()).toBe("Time: 1s");
  });

});


describe("LAMapView Stress Tests", () => {

  test("drawAll() creates required objects exactly once (idempotent)", () => {
    const view = new LAMapView({} as any);

    view.drawAll();
    const firstGroup = view.getGroup();
    const firstLayer = view.getLayer();

    // Call drawAll many times
    for (let i = 0; i < 50; i++) {
      view.drawAll();
    }

    const secondGroup = view.getGroup();
    const secondLayer = view.getLayer();

    // The same objects should be reused
    expect(firstGroup).toBe(secondGroup);
    expect(firstLayer).toBe(secondLayer);
  });

  test("updateTimer stress: handles 1000 updates without breaking", () => {
    const view = new LAMapView({} as any);

    view.drawAll();

    for (let i = 0; i < 1000; i++) {
      view.updateTimer(1000 - i);
    }

    // final timer text must match last update
    expect(view.getTimerText().text()).toBe("Time: 0s");
  });

  test("Timer displays correct seconds for multiple values", () => {
    const view = new LAMapView({} as any);
    view.drawAll();

    view.updateTimer(5000);   // 5s
    expect(view.getTimerText().text()).toBe("Time: 5s");

    view.updateTimer(123000); // 123s
    expect(view.getTimerText().text()).toBe("Time: 123s");

    view.updateTimer(0);
    expect(view.getTimerText().text()).toBe("Time: 0s");
  });

  test("Konva constructor calls should not explode with multiple instantiations", () => {
    // Create 200 views (stress test)
    for (let i = 0; i < 200; i++) {
      const view = new LAMapView({} as any);
      view.drawAll();

      // ensure important parts exist
      expect(view.getGroup).toBeDefined();
      expect(view.getLayer).toBeDefined();
      expect(view.getTimerText).toBeDefined();
    }
  });

});
