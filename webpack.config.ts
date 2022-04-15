import { resolve } from "path";
import { Configuration } from "webpack";
import PnpWebpackPlugin = require("pnp-webpack-plugin");
import WebpackUserscript = require("webpack-userscript");
import "webpack-dev-server";

/**
 * Selects a port in the Ephemeral range by deterministically hashing a string
 * name. That is, for any given name, the returned port number is:
 *
 * 1. in the Ephemeral range,
 * 2. always returned for the given name, and
 * 3. unlikely in practice to be returned for any other name.
 *
 * @param name The name to use to select a port
 * @returns The selected port number
 */
const portByName = (name: string) => {
  const rangeOffset = 49151;
  const rangeEnd = 65535;
  const rangeLength = rangeEnd - rangeOffset;

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash + char) % rangeLength;
  }
  return hash + rangeOffset;
};

const devServerPort = portByName("jira-sparkboard");

const config = (
  _env: Record<string, string>,
  { mode }: { mode: Configuration["mode"] },
): Configuration => {
  return {
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
          use: require.resolve("ts-loader"),
          exclude: /node_modules/,
        },
      ],
    },

    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      plugins: [PnpWebpackPlugin],
    },

    plugins: [
      new WebpackUserscript({
        // NB: renameExt breaks HMR by renaming the hot-update output.
        renameExt: false,
        headers: { include: "https://example.com/" },
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
  };
};

export default config;
