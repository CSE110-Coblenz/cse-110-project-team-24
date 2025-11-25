import { PostcardScreenModel } from './../../../src/screens/PostcardScreen/PostcardScreenModel';
import { describe, it, expect, vi } from "vitest";

describe("PostcardScreenModel", () => {
    it("should return active postcards", () => {
        const model = new PostcardScreenModel();
        const postcards = model.getActivePostcards();
        expect(postcards).toBeDefined();
        expect(Array.isArray(postcards)).toBe(true);
    });

    it("should get and set zoomed in state", () => {
        const model = new PostcardScreenModel();
        expect(model.getIsZoomedIn()).toBe(false);
        model.setIsZoomedIn(true);
        expect(model.getIsZoomedIn()).toBe(true);
    });


});