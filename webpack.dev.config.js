const { webpack } = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const baseConfig = require("./webpack.config");
// import baseConfig from "./webpack.config.js";

baseConfig.mode = "development";
baseConfig.devServer = {
  static: "./build",
  port: 3030,
  historyApiFallback: true,
};

const compiler = webpack(baseConfig);
const server = new WebpackDevServer(compiler, {
  port: 3030,
  historyApiFallback: true,
  // contentBase: "/public/",
  // publicPath: "/",
  // stats: { colors: true },
});

baseConfig.runServer = async () => {
  console.log("Starting server...");
  await server.start();
};

module.exports = baseConfig;
