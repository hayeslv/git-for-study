/*
 * @Author: Lvhz
 * @Date: 2021-08-17 08:54:40
 * @Description: Description
 */
const path = require('path')
module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: ''
      }
    ]
  }
}