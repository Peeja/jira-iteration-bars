import { resolve } from "path";
import { Configuration } from "webpack";
import PnpWebpackPlugin = require("pnp-webpack-plugin");
import WebpackUserscript = require("webpack-userscript");
import ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
import portByName from "./portByName";
import "webpack-dev-server";
import includeRegExp from "./includeRegExp";

const devServerPort = portByName("jira-sparkboard");

const config = (
  _env: Record<string, string>,
  { mode }: { mode: Configuration["mode"] },
): Configuration => ({
  entry: "./src/index.tsx",

  devtool: "inline-source-map",

  devServer: {
    server: "https",
    port: devServerPort,
    allowedHosts: "all",
    static: {
      directory: "dist",
      serveIndex: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hot: true,
    client: {
      logging: "verbose",
      webSocketURL: {
        hostname: "localhost",
        port: devServerPort,
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            env: {
              development: {
                plugins: ["react-refresh/babel"],
              },
            },
          },
        },
      },
    ],
  },

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [PnpWebpackPlugin],
  },

  plugins: [
    new ReactRefreshWebpackPlugin(),
    new WebpackUserscript({
      // NB: renameExt breaks HMR by renaming the hot-update output.
      renameExt: false,
      headers: {
        include: includeRegExp.toString(),
      },
    }),
  ],

  output: {
    filename: "bundle.user.js",
    path: resolve(__dirname, "dist"),
    publicPath:
      mode === "development" ? `https://localhost:${devServerPort}/` : "auto",
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
});

export default config;
