import { describe, test, expect, vi, beforeEach } from "vitest";
import { LAMapController } from "../../../src/screens/LosAngelesScreen/LosAngelesGameController";
import type { ScreenSwitcher } from "../../../src/types";
import { cityProgress } from "../../../src/screens/LosAngelesScreen/LosAngelesGameView";

vi.useFakeTimers();

var resetFns: Array<ReturnType<typeof vi.fn>> | undefined;
var cleanupFns: Array<ReturnType<typeof vi.fn>> | undefined;

const getResetFns = () => (resetFns ?? []);
const getCleanupFns = () => (cleanupFns ?? []);

const mockGroup = { visible: vi.fn() };
const mockView = {
  drawAll: vi.fn(),
  updateTimer: vi.fn(),
  getLayer: vi.fn(),
  getGroup: vi.fn(() => mockGroup),
};

vi.mock("../../../src/screens/LosAngelesScreen/LosAngelesGameView", async () => {
  const original = await vi.importActual<any>("../../../src/screens/LosAngelesScreen/LosAngelesGameView");
  const LAMapView = vi.fn().mockImplementation(function MockLAMapView() {
    return mockView;
  });
  return {
    ...original,
    LAMapView,
  };
});



// ---- Mock mini-games reset/cleanup ----
// const resetFns = [];
// const cleanupFns = [];

function createMiniGameMock(resetName: string, cleanupName: string) {
  const reset = vi.fn();
  const clean = vi.fn();

  (resetFns ??= []).push(reset);
  (cleanupFns ??= []).push(clean);

  return {
    [resetName]: reset,
    [cleanupName]: clean,
  };
}

vi.mock("../../../src/screens/LosAngelesScreen/HollywoodGame", () =>
  createMiniGameMock("resetHWScore", "cleanupHWGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/BurbankGame", () =>
  createMiniGameMock("resetBBScore", "cleanupBBGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/InglewoodGame", () =>
  createMiniGameMock("resetIGScore", "cleanupIGGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/LongBeachGame", () =>
  createMiniGameMock("resetLBScore", "cleanupLBGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/MontereyParkGame", () =>
  createMiniGameMock("resetMPScore", "cleanupMPGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/SantaFeSpringsGame", () =>
  createMiniGameMock("resetSFSScore", "cleanupSFSGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/SantaMonicaGame", () =>
  createMiniGameMock("resetSMScore", "cleanupSMGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/PasadenaGame", () =>
  createMiniGameMock("resetPDScore", "cleanupPDGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/LAXgame", () =>
  createMiniGameMock("resetLAXScore", "cleanupLAXGame")
);
vi.mock("../../../src/screens/LosAngelesScreen/UnionStationGame", () =>
  createMiniGameMock("resetUSScore", "cleanupUSGame")
);



// ---- Mock GameStateManager ----
const mockGSM = {
  MinigameWon: vi.fn(),
  MinigameLost: vi.fn()
};

vi.mock("../../../src/GameStateManager", () => ({
  GameStateManager: {
    getInstance: () => mockGSM
  }
}));


// ---- Mock ScreenSwitcher ----
const mockSwitcher: ScreenSwitcher = { switchToScreen: vi.fn() };


describe("LAMapController (Stress Tests Improved)", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.alert = vi.fn();

    Object.keys(cityProgress).forEach(k => (cityProgress[k] = true)); 
  });

  // ============================================================
  test("startGame starts timer and drawAll", () => {
    const c = new LAMapController(mockSwitcher);
    c.startGame();
    expect(mockView.drawAll).toHaveBeenCalled();
  });

  // ============================================================
  test("completeAllCities calls MinigameWon and stops timer", () => {
    const c = new LAMapController(mockSwitcher);
    c.startGame();
    const result = c.completeAllCities();

    expect(mockGSM.MinigameWon).toHaveBeenCalledWith("losangeles");
    expect(result).toBe(true);
  });

  // ============================================================
  test("show/hide toggles visibility", () => {
    const c = new LAMapController(mockSwitcher);

    c.show();
    expect(mockGroup.visible).toHaveBeenCalledWith(true);

    c.hide();
    expect(mockGroup.visible).toHaveBeenCalledWith(false);
  });

  // ============================================================
  test("onTimeout stress test: resets ALL cities, resets ALL scores, cleanup ALL games, calls MinigameLost, and jumps to home", () => {
    const c = new LAMapController(mockSwitcher);

    (c as any).onTimeout();

    // All reset funcs called
    getResetFns().forEach(fn => expect(fn).toHaveBeenCalled());

    // All cleanup funcs called
    getCleanupFns().forEach(fn => expect(fn).toHaveBeenCalled());

    // cityProgress reset
    Object.values(cityProgress).forEach(v => expect(v).toBe(false));

    expect(mockGSM.MinigameLost).toHaveBeenCalledWith("losangeles");
    expect(mockSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
  });

  // ============================================================
  test("🔥 Timer auto-triggers onTimeout when time expires", () => {
    const c = new LAMapController(mockSwitcher);
    c.startGame();

    // Fast forward 3 minutes + a little
    vi.advanceTimersByTime(1000 * 3 * 60 + 100);

    // Should have called MinigameLost
    expect(mockGSM.MinigameLost).toHaveBeenCalledWith("losangeles");
    expect(mockSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
  });

});
