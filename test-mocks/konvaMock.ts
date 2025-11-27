// Minimal Konva mock to prevent Jest from crashing
module.exports = {
  Stage: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    destroy: jest.fn(),
  })),
  Layer: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    destroy: jest.fn(),
  })),
  Group: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    visible: jest.fn(),
  })),
  Rect: jest.fn(),
  Text: jest.fn(),
  Image: jest.fn(),
};
