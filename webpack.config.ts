import { resolve } from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import PnpWebpackPlugin = require("pnp-webpack-plugin");
import WebpackUserscript = require("webpack-userscript");
import "webpack-dev-server";

const config = (
  _env: Record<string, string>,
  { mode }: { mode: Configuration["mode"] },
): Configuration => {
  return {
    entry: "./src/index.ts",

    devtool: "inline-source-map",

    devServer: {
      server: "https",
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
          port: 8080,
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
      new HotModuleReplacementPlugin(),
      new WebpackUserscript({
        // NB: renameExt breaks HMR by renaming the hot-update output.
        renameExt: false,
        headers: { include: "https://example.com/" },
      }),
    ],

    output: {
      filename: "bundle.user.js",
      path: resolve(__dirname, "dist"),
      publicPath: mode === "development" ? "https://localhost:8080/" : "auto",
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
  };
};

export default config;
