import { PostcardScreenModel } from './../../../src/screens/PostcardScreen/PostcardScreenModel';
import { describe, it, expect, vi } from "vitest";

describe("PostcardScreenModel", () => {


    it("should get and set zoomed in state", () => {
        const model = new PostcardScreenModel();
        expect(model.getIsZoomedIn()).toBe(false);
        model.setIsZoomedIn(true);
        expect(model.getIsZoomedIn()).toBe(true);
    });

    it("should return active postcards", () => {
        const model = new PostcardScreenModel();
        const postcards = model.getActivePostcards();
        expect(postcards.length).toBeGreaterThan(0);
        expect(postcards[0]).toHaveProperty('title');
        expect(postcards[0]).toHaveProperty('cityID');
        expect(postcards[0]).toHaveProperty('postcardImageSrc');
        expect(postcards[0]).toHaveProperty('xPos');
        expect(postcards[0]).toHaveProperty('yPos');
    });



});