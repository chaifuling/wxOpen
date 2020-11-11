const path = require("path"); // nodejs自带的path模块
module.exports = {
  mode: "development", // 模式，可选 development 或 production
  entry: path.join(__dirname, "src", "index.js"), // 入口文件，当前目录下的src目录的index.js
  output: {
    // 出口
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 检测以.js结尾的文件
        use: [
          {
            loader: "babel-loader",
          },
        ], // 使用 babel-loader
        include: path.join(__dirname, "src"), // 检测路径为src
        exclude: /node_modules/, // 忽略node_modules路径
      },
    ],
  },
};
