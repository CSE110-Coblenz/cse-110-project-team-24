import { describe, test, expect, vi, beforeEach, it } from "vitest";
import { GameStateManager } from "../../../src/GameStateManager.ts";

describe("GameStateManager", () => {

it("should be a singleton", () => {
    const newgsm = new GameStateManager();
    const instance1 = GameStateManager.getInstance();
    const instance2 = GameStateManager.getInstance();
    expect(instance1).toBe(instance2);
});

it("should track completed cities correctly", () => {
    const newgsm = new GameStateManager();
    const gsm = GameStateManager.getInstance();
    gsm.resetGameState();
    gsm.MinigameWon("newyork");
    expect(gsm.getCompletedCities().newyork).toBe(true);
    expect(gsm.getCompletedCities().boston).toBe(false);
});

it("should reset game state correctly", () => {
    const newgsm = new GameStateManager();
    const gsm = GameStateManager.getInstance();
    gsm.MinigameWon("newyork");
    gsm.resetGameState();
    const completedCities = gsm.getCompletedCities();
    for (const city in completedCities) {
        expect(completedCities[city]).toBe(false);
    }
});

it("should save and load game state correctly", () => {
    const newgsm = new GameStateManager();
    const gsm = GameStateManager.getInstance();
    gsm.resetGameState();
    gsm.MinigameWon("boston");
    gsm.saveGameState();

    const gsm2 = new GameStateManager();
    const loadedGsm = GameStateManager.getInstance();
    expect(loadedGsm.getCompletedCities().boston).toBe(true);
    expect(loadedGsm.getCompletedCities().newyork).toBe(false);
});

it("should handle MinigameLost without errors", () => {
    const newgsm = new GameStateManager();
    const gsm = GameStateManager.getInstance();
    expect(() => gsm.MinigameLost("dc")).not.toThrow();
});

it("should load game state correctly when no saved state exists", () => {
    const newgsm = new GameStateManager();
    const gsm = GameStateManager.getInstance();
    gsm.resetGameState();
    localStorage.removeItem("citiesComplete");
    expect(() => gsm.loadGameState()).not.toThrow();
});



});