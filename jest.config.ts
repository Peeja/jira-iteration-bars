import { InitialOptionsTsJest } from "ts-jest/dist/types";

const config: InitialOptionsTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./matchers/toBeShadowed.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "src/tsconfig.json",
    },
  },
};

export default config;
