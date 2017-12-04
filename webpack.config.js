const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: 'file-loader'
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Evolutio'
    }),
    new ExtractTextPlugin('style.css'),
    new CopyWebpackPlugin([{ from: 'src/spritesheets', to: 'spritesheets' }]),
  ]
};
