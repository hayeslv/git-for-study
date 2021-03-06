/*
 * @Author: Lvhz
 * @Date: 2021-07-30 08:35:49
 * @Description: Description
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "[name].js"
  },
  mode: "development", // development production none
  resolveLoader: {
    modules: ["node_modules", "./myLoaders"]
  },
  // 模块：支持更多类型的模块
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less$/,
        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      // {
      //   test: /\.(jpe?g|png|gif|webp)$/,
      //   use: {
      //     loader: "file-loader",
      //     options: {
      //       // 目录管理可以放在name中做：name: "images/[name].[ext]"，不过这样做不好
      //       name: "[name].[ext]",// [name]名称，[ext]后缀
      //       outputPath: "images", // 资源的存储位置
      //       publicPath: "../images", // 资源的使用位置：publicPath + name = css中图片的使用路径
      //     }
      //   }
      // }
      // ! 将file-loader替换成url-loader
      // {
      //   test: /\.(jpe?g|png|gif|webp)$/,
      //   use: {
      //     loader: "url-loader",
      //     options: {
      //       // 目录管理可以放在name中做：name: "images/[name].[ext]"，不过这样做不好
      //       name: "[name].[ext]",// [name]名称，[ext]后缀
      //       outputPath: "images", // 资源的存储位置
      //       publicPath: "../images", // 资源的使用位置：publicPath + name = css中图片的使用路径
      //       // 一般使用3~4kb
      //       limit: 4 * 1024, // 4kb，超过limit值的图片会已独立文件的形式输出，不超过的会已base64的形式输出
      //     }
      //   }
      // }
      // !image-webpack-loader
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              // 目录管理可以放在name中做：name: "images/[name].[ext]"，不过这样做不好
              name: "[name].[ext]",// [name]名称，[ext]后缀
              outputPath: "images", // 资源的存储位置
              publicPath: "../images", // 资源的使用位置：publicPath + name = css中图片的使用路径
              // 一般使用3~4kb
              limit: 4 * 1024, // 4kb，超过limit值的图片会已独立文件的形式输出，不超过的会已base64的形式输出
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              
            }
          }
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
    }),
    new CleanWebpackPlugin()
  ]
}