export const mockGroup = {
  visible: jest.fn(),
};

export const mockLAMapController = {
  startGame: jest.fn(),
  show: jest.fn(),
  hide: jest.fn(),
  completeAllCities: jest.fn(() => true),
  getView: jest.fn(() => ({
    drawAll: jest.fn(),
    updateTimer: jest.fn(),
    getLayer: jest.fn(),
    getGroup: jest.fn(() => mockGroup),
  })),
};
