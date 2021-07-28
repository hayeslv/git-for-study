const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name].js"
  },
  mode: "development", // development production none
  // 模块：支持更多类型的模块
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"]
      // },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader", 
          {
            loader: "css-loader",
            options: {
              modules: false
            }
          }, 
          "postcss-loader",
          "less-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // 模板匹配
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "css/index.css"
    })
  ]
}