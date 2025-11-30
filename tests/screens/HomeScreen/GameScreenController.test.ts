import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameScreenController } from "../../../src/screens/HomeScreen/GameScreenController.ts";
import type { ScreenSwitcher } from "../../../src/types.ts";
import type { City } from "../../../src/screens/HomeScreen/GameScreenModel.ts";

// Mock the HomeScreen view to isolate controller behavior
vi.mock("../../../src/screens/HomeScreen/GameScreenView.ts", () => {
  class MockGameScreenView {
    public show = vi.fn();
    public hide = vi.fn();
    public getGroup = vi.fn(() => ({ visible: false }));

    private cityHandler: ((city: City) => void) | null = null;
    private postcardHandler: (() => void) | null = null;
    private backHandler: (() => void) | null = null;

    setCityClickHandler = (handler: (city: City) => void) => {
      this.cityHandler = handler;
    };
    setPostcardButtonHandler = (handler: () => void) => {
      this.postcardHandler = handler;
    };
    setBackButtonHandler = (handler: () => void) => {
      this.backHandler = handler;
    };

    // Test helpers
    triggerCityClick = (city: City | any) => {
      this.cityHandler?.(city);
    };
    triggerPostcardButtonClick = () => {
      this.postcardHandler?.();
    };
    triggerBackButtonClick = () => {
      this.backHandler?.();
    };
  }

  return { GameScreenView: MockGameScreenView };
});

describe("HomeScreen GameScreenController", () => {
  let controller: GameScreenController;
  let mockScreenSwitcher: ScreenSwitcher;
  let mockView: any;

  beforeEach(() => {
    mockScreenSwitcher = { switchToScreen: vi.fn() };
    controller = new GameScreenController(mockScreenSwitcher);
    mockView = controller.getView() as any;
  });

  it("start() should reset model, show view, and emit current location", () => {
    const onLoc = vi.fn();
    controller.onLocationChange(onLoc);

    controller.start();

    expect(mockView.show).toHaveBeenCalled();
    expect(onLoc).toHaveBeenCalledWith("Boston");
  });

  describe("city click routing", () => {
    it("navigates to New York city info", () => {
      mockView.triggerCityClick("New York");
      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
        type: "cityinfo",
        cityName: "newyork",
      });
    });

    it("navigates to Boston city info", () => {
      mockView.triggerCityClick("Boston");
      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
        type: "cityinfo",
        cityName: "boston",
      });
    });

    it("navigates to Chicago city info", () => {
      mockView.triggerCityClick("Chicago");
      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
        type: "cityinfo",
        cityName: "chicago",
      });
    });

    it("falls back to blank for unknown city", () => {
      mockView.triggerCityClick("Unknown" as any);
      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
        type: "blank",
      });
    });
  });

  describe("postcard and back buttons", () => {
    it("navigates to postcard screen when postcard button clicked", () => {
      mockView.triggerPostcardButtonClick();
      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
        type: "postcard",
      });
    });

    it("navigates to menu when back button clicked", () => {
      mockView.triggerBackButtonClick();
      expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({
        type: "menu",
      });
    });
  });

  describe("travel API", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      controller.start();
    });

    it("reports connected cities from current location", () => {
      expect(controller.getConnectedCities()).toEqual(["New York"]);
    });

    it("can travel along valid edge and notifies listeners", () => {
      const onLoc = vi.fn();
      controller.onLocationChange(onLoc);

      const moved = controller.travelTo("New York");
      expect(moved).toBe(true);
      expect(onLoc).toHaveBeenCalledWith("New York");
      expect(controller.getCurrentCity()).toBe("New York");
    });

    it("rejects invalid travel and does not notify listeners", () => {
      const onLoc = vi.fn();
      controller.onLocationChange(onLoc);

      // From Boston, cannot go directly to Los Angeles
      const moved = controller.travelTo("Los Angeles");
      expect(moved).toBe(false);
      expect(onLoc).not.toHaveBeenCalledWith("Los Angeles");
      expect(controller.getCurrentCity()).toBe("Boston");
    });
  });
});


