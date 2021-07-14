const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    // index: './src/index.ts' // webpack纯ts编译
    index: './src/ReactHello.tsx' // 编译react
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'buidle.[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3020
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template.html')
    })
  ]
}