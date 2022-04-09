import userscript from "rollup-plugin-userscript";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import * as path from "path";
import * as pkg from "./package.json";

const DIST = "dist";
const FILENAME = "index";

/** @type {import("rollup").RollupOptions} */
const config = {
  input: "src/index.tsx",
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
    typescript(),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    }),
    userscript(path.resolve("src/meta.js"), (meta) =>
      meta
        .replace("process.env.VERSION", pkg.version)
        .replace("process.env.AUTHOR", pkg.author),
    ),
  ],
  output: {
    format: "iife",
    file: `${DIST}/${FILENAME}.user.js`,
    indent: false,
    externalLiveBindings: false,
  },
};

export default config;
