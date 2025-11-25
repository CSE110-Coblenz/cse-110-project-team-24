jest.mock("konva", () => {
  // --- helper factory ---
  const make = (extra = {}) => ({
    listening: jest.fn(),
    moveToTop: jest.fn(),
    add: jest.fn(),
    on: jest.fn(),
    getStage: jest.fn(),
    ...extra,
  });

  // --- Group ---
  const Group = jest.fn().mockImplementation((config = {}) => {
    let _visible = config.visible ?? true;
    return make({
      visible: jest.fn((v) => {
        if (v !== undefined) _visible = v;
        return _visible;
      }),
    });
  });

  // --- Layer ---
  const Layer = jest.fn().mockImplementation(() =>
    make({
      draw: jest.fn(),
    })
  );

  // --- Stage ---
  const Stage = jest.fn().mockImplementation(() =>
    make({
      draw: jest.fn(),
    })
  );

  // --- Text ---
  const Text = jest.fn().mockImplementation((config = {}) => {
  let _text = config.text ?? "";

  const fn = (t?: string) => {
    if (t !== undefined) _text = t;
    return _text;
  };

  return {
    text: jest.fn(fn), 
    x: jest.fn(),
    y: jest.fn(),
    listening: jest.fn(),
    moveToTop: jest.fn(),
  };
});



  // --- Rect / Circle / Line / Shape ---
  const Rect = jest.fn().mockImplementation(() => make());
  const Circle = jest.fn().mockImplementation(() => make());
  const Line = jest.fn().mockImplementation(() => make());
  const Shape = jest.fn().mockImplementation(() => make());

  return {
    Stage,
    Layer,
    Group,
    Rect,
    Circle,
    Line,
    Shape,
    Text,
    default: {
      Stage,
      Layer,
      Group,
      Rect,
      Circle,
      Line,
      Shape,
      Text,
    },
  };
});







// import Konva from "konva";
import { LAMapView } from "../src/screens/LosAngelesScreen/LosAngelesGameView";

// Mock screen switcher
const mockSwitcher = { switchToScreen: jest.fn() };

describe("LAMapView", () => {

  test("constructor initializes stage, layer, group", () => {
    const view = new LAMapView(mockSwitcher, {} as any);

    expect(view.getLayer).toBeDefined();
    expect(view.getGroup).toBeDefined();
  });

test("updateTimer updates text content", () => {
  const view = new LAMapView(mockSwitcher, {} as any);

  view.drawAll();    
  view.updateTimer(1000);

  expect(view.getTimerText().text()).toBe("Time: 1s");
});
});
