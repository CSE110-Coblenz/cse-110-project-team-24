const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: "jsdom",

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    ...tsJestTransformCfg,
  },

  moduleNameMapper: {
    "^konva$": "/Users/patrickdeng/Documents/ucsd course/CSE110/cse-110-project-team-24/test-mocks/konvaMock.ts"
  },

  moduleFileExtensions: ["ts", "js", "json"],
};
