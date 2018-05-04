const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          oprions: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Evolutio',
    }),
    new ExtractTextPlugin('style.css'),
    new CopyWebpackPlugin([{from: 'src/spritesheets', to: 'spritesheets'}]),
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};
