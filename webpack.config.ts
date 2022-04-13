import { resolve } from "path";
import { Configuration } from "webpack";
import PnpWebpackPlugin = require("pnp-webpack-plugin");
import WebpackUserscript = require("webpack-userscript");
import "webpack-dev-server";

const config: Configuration = {
  entry: "./src/index.ts",

  devtool: "inline-source-map",

  devServer: {
    static: "./dist",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: require.resolve("ts-loader"),
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },

  plugins: [new WebpackUserscript()],

  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "dist"),
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
};

export default config;
