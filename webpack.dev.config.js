const baseConfig = require("./webpack.config");
// import baseConfig from "./webpack.config.js";

baseConfig.mode = "development";
baseConfig.devServer = {
  static: "./build",
  port: 3030,
  historyApiFallback: true,
};

module.exports = baseConfig;
// export default baseConfig;
// const compiler = webpack(baseConfig);
// const app = new WebpackDevServer(compiler, {
//   contentBase: "/public/",
//   // proxy: { "/graphql": `http://localhost:${GRAPHQL_PORT}` },
//   publicPath: "/",
//   stats: { colors: true },
// });

// app.use("/", express.static(path.resolve(__dirname, "public")));
