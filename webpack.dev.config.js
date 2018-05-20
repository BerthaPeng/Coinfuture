'use strict';

const webpack    = require('webpack');
const baseConfig = require('./webpack.config.js');
const path       = require('path');
const assign     = require('object-assign');
const ip         = require('ip');
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: 'http://' + ip.address() + ':8004/',
    filename: '[name].bundle.js',
    chunkFilename: '[name].js'
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: {
      index: 'http://' + ip.address() + ':8004/' + 'index.html'
    },
  },
/*  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel?cacheDirectory=cache'], // 暂时觉得hot-loader效果有限
      exclude: /node_modules/,
      include: path.join(__dirname, 'src/js/redux')
    }]
  },*/
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.optimize.CommonsChunkPlugin({name:'commons', filename: '[name].bundle.js' }),
    new webpack.HotModuleReplacementPlugin(),
    //将生成的打包文件注入到html中
    /*new HtmlWebpackPlugin({
      dev: true,
      filename: 'index.html', //输出文件，filename的位置是相对于webpackConfig.output.path
      template: path.join(__dirname, '/src/index.html'),
      inject: true
    }),*/
    new ExtractTextPlugin('semantic-ui.styles.css')
    /*new ExtractTextPlugin({name: 'cssfile', filename: 'semantic-ui.styles.css'})*/
  ].concat(baseConfig.plugins),
};

module.exports = assign({}, baseConfig, config);