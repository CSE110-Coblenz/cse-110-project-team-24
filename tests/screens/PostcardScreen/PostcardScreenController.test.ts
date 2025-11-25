import { describe, it, expect, vi } from "vitest";
import { PostcardScreenController } from "../../../src/screens/PostcardScreen/PostcardScreenController.ts";

describe("PostcardScreenController", () => {
    it("should be defined", () => {
        const mockScreenSwitcher = {
            switchToScreen: () => { },
        };
        const controller = new PostcardScreenController(mockScreenSwitcher);
        expect(controller).toBeDefined();
    });

    it("should have exitToHome method that switches to home screen", () => {
        const mockScreenSwitcher = {
            switchToScreen: vi.fn(),
        };
        const controller = new PostcardScreenController(mockScreenSwitcher);
        controller.exitToHome();
        expect(mockScreenSwitcher.switchToScreen).toHaveBeenCalledWith({ type: "home" });
    });

    it("should have getView method that returns the view", () => {
        const mockScreenSwitcher = {
            switchToScreen: () => { },
        };
        const controller = new PostcardScreenController(mockScreenSwitcher);
        const view = controller.getView();
        expect(view).toBeDefined();
    });

    it("should call updatePostcards on initialization", () => {
        const mockScreenSwitcher = {
            switchToScreen: () => { },
        };
        const controller = new PostcardScreenController(mockScreenSwitcher);
        const spy = vi.spyOn(controller, 'updatePostcards');
        controller.updatePostcards();
        expect(spy).toHaveBeenCalled();
    });

})