'use strict';

const webpack    = require('webpack');
const baseConfig = require('./webpack.config.js');
const path       = require('path');
const assign     = require('object-assign');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

//只有正式环境和pr上，采用production方式打包
const ENV = process.env.NODE_ENV = 'production';

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"'
    /*'process.env.NODE_ENV': JSON.stringify(ENV)*/
  }),
  // extract css into its own file
  new ExtractTextPlugin({
    filename: 'css/[name].[contenthash].css'
    /*name: 'cssfile',
    filename: 'css/[name].[contenthash].css'*/
    /*filename: path.posix.join( 'static', 'css/[name].[contenthash].css')*/
  }),
  /*new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }),*/
/*  new HtmlWebpackPlugin({
    filename: path.join(__dirname, '/build/index.html'),
    dev: false,
    template: path.join(__dirname, '/src/index.html'),
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
  }),*/
  new webpack.optimize.CommonsChunkPlugin({name: 'commons', filename: '[name].[hash].bundle.js'}),
]
if(ENV == 'production'){
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      minimize: true
    })
  )
}

const config = {
  devtool: false,
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/build/',
    filename: '[name].[hash].bundle.js'
  },
  plugins: plugins.concat(baseConfig.plugins),
}

module.exports = assign({}, baseConfig, config);