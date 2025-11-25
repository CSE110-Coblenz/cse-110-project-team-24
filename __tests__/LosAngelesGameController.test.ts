import { LAMapController } from "../src/screens/LosAngelesScreen/LosAngelesGameController";
import type { ScreenSwitcher } from "../src/types";
import { cityProgress } from "../src/screens/LosAngelesScreen/LosAngelesGameView";

jest.useFakeTimers();

// ---- Mock group and view ----
const mockGroup = { visible: jest.fn() };

const mockView = {
  drawAll: jest.fn(),
  updateTimer: jest.fn(),
  getLayer: jest.fn(),
  getGroup: jest.fn(() => mockGroup),
};

jest.mock("../src/screens/LosAngelesScreen/LosAngelesGameView", () => {
  const original = jest.requireActual("../src/screens/LosAngelesScreen/LosAngelesGameView");
  return {
    ...original,  // keep cityProgress and anything else intact
    LAMapView: jest.fn().mockImplementation(() => mockView),
  };
});


// ---- Mock reset & cleanup for all games ----
jest.mock("../src/screens/LosAngelesScreen/HollywoodGame", () => ({ resetHWScore: jest.fn(), cleanupHWGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/BurbankGame", () => ({ resetBBScore: jest.fn(), cleanupBBGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/InglewoodGame", () => ({ resetIGScore: jest.fn(), cleanupIGGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/LongBeachGame", () => ({ resetLBScore: jest.fn(), cleanupLBGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/MontereyParkGame", () => ({ resetMPScore: jest.fn(), cleanupMPGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/SantaFeSpringsGame", () => ({ resetSFSScore: jest.fn(), cleanupSFSGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/SantaMonicaGame", () => ({ resetSMScore: jest.fn(), cleanupSMGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/PasadenaGame", () => ({ resetPDScore: jest.fn(), cleanupPDGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/LAXgame", () => ({ resetLAXScore: jest.fn(), cleanupLAXGame: jest.fn() }));
jest.mock("../src/screens/LosAngelesScreen/UnionStationGame", () => ({ resetUSScore: jest.fn(), cleanupUSGame: jest.fn() }));

// ---- Mock ScreenSwitcher ----
const mockSwitcher: ScreenSwitcher = { switchToScreen: jest.fn() };

jest.spyOn(global, "setInterval");

describe("LAMapController", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // reset progress
    cityProgress["Burbank"] = false;
    cityProgress["Hollywood"] = false;
    cityProgress["Santa Monica"] = false;
  });

  test("startGame() draws and starts timer", () => {
    const c = new LAMapController(mockSwitcher);
    c.startGame();

    expect(mockView.drawAll).toHaveBeenCalled();
    expect(setInterval).toHaveBeenCalled();
  });

  test("show() makes group visible", () => {
    const c = new LAMapController(mockSwitcher);
    c.show();
    expect(mockGroup.visible).toHaveBeenCalledWith(true);
  });

  test("hide() makes group invisible", () => {
    const c = new LAMapController(mockSwitcher);
    c.hide();
    expect(mockGroup.visible).toHaveBeenCalledWith(false);
  });

  test("completeAllCities stops timer and sets finished=true", () => {
    window.alert = jest.fn();
    const c = new LAMapController(mockSwitcher);

    const result = c.completeAllCities();

    expect(window.alert).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("onTimeout resets and switches to home", () => {
    window.alert = jest.fn();
    const c = new LAMapController(mockSwitcher);

    (c as any).onTimeout();

    expect(mockSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
  });
});
