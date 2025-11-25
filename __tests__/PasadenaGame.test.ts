/**
 * @jest-environment jsdom
 */

import {
  startPDGame,
  cleanupPDGame,
  resetPDScore,
} from "../src/screens/LosAngelesScreen/PasadenaGame";

// ----------- Mock Konva -----------------
jest.mock("konva", () => {
  const Group = jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    destroy: jest.fn(),
    destroyChildren: jest.fn(),
    moveToTop: jest.fn(),
    find: jest.fn(() => []),
  }));
  

 const Rect = jest.fn().mockImplementation((cfg = {}) => {
    const obj: any = {
      ...cfg,
      listening: jest.fn(() => obj),  
      on: jest.fn(),                  
      destroy: jest.fn(),
      moveToTop: jest.fn(),
      width: jest.fn(),
      height: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      strokeWidth: jest.fn(),
    };
    return obj;
  });

  const Text = jest.fn().mockImplementation((cfg = {}) => {
    let _text = cfg.text ?? "";
    return {
      text: jest.fn((t) => {
        if (t !== undefined) _text = t;
        return _text;
      }),
      getText: () => _text,
      destroy: jest.fn(),
      moveToTop: jest.fn(),
    };
  });

  const Layer = jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    draw: jest.fn(),
    destroyChildren: jest.fn(),
    find: jest.fn(() => []),
  }));

  return { Group, Rect, Text, Layer, default: { Group, Rect, Text, Layer } };
});

import Konva from "konva";




// ---------- helper: create mocked layer ----------
function createLayer() {
  return new Konva.Layer();
}

// -------------------------------------------------

describe("Pasadena Game", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetPDScore();
  });

  test("startPDGame creates popup and adds it to layer", () => {
    const layer = createLayer();

    startPDGame(layer);

    expect(layer.add).toHaveBeenCalled();
    expect(layer.draw).toHaveBeenCalled();
  });

  test("cleanupPDGame destroys children & redraws", () => {
    const layer = createLayer();

    cleanupPDGame(layer);

    expect(layer.destroyChildren).toHaveBeenCalled();
    expect(layer.draw).toHaveBeenCalled();
  });

  



});
