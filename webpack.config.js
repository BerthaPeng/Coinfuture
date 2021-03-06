'use strict';
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const I18nPlugin  = require("i18n-webpack-plugin");


module.exports = {
  context: path.join(__dirname),
  /*devtool: debug ? "inline-sourcemap" : null,*/
  /*entry: './src/js/redux/root.js',*/
  entry: {
    commons: [
      'react',
      // 'react-dom',
      // 'react-redux',
      // 'react-addons-linked-state-mixin',
      // 'redux',
      // 'redux-thunk',
      // 'history_instance',
      // 'superagent',
      // 'redux-simple-router'
    ],
    index: ['./src/js/redux/root.js']
  },  //按需构建成不同的文件
  resolve: {
    alias: {
      'utils'            : path.join(__dirname, './src/js/redux/utils'),
      'mixins'           : path.join(__dirname, './src/js/redux/mixins'),
      'reducers'         : path.join(__dirname, './src/js/redux/reducers'),
      'common'           : path.join(__dirname, './src/js/redux/components/common'),
      'actions'          : path.join(__dirname, './src/js/redux/actions'),
      'config'           : path.join(__dirname, './src/js/redux/config'),
      'stores'           : path.join(__dirname, './src/js/redux/stores'),
      'history_instance' : path.join(__dirname, './src/js/redux/history.js'),
      'locales'          : path.join(__dirname, './src/locales'),
      'lib'              : path.join(__dirname, './src/lib'),
      'plugins'              : path.join(__dirname, './src/plugins'),
      'images'              : path.join(__dirname, './src/js/redux/images'),
      'components'              : path.join(__dirname, './src/js/redux/components'),

    }
  },
  module: {
    loaders: [
      { 
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        /*query: {
          presets: ['es2015', 'react'],
          plugins: ['react-html-attrs'], //添加组件的插件配置
        },*/
        include: path.join(__dirname, 'src'),
      },
/*      {
        test: /\.jsx?$/,
        loader: 'babel-loader?cacheDirectory=cache',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/js/redux'),
      },*/
      //下面是使用 ant-design 的配置文件
      /*{ test: /\.css$/, loader: 'style-loader!css-loader' },*/
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        /*query: {
          name: '[name].[ext]?[hash]'
        }*/
      },
    ]
  },
  resolve: {
    alias: {
      'utils'             : path.join(__dirname, './src/js/redux/utils'),
      'config'            : path.join(__dirname, './src/js/redux/config'),
      'history_instance'  : path.join(__dirname, './src/js/redux/history'),
      'images'            : path.join(__dirname, './src/images'),
      'actions'           : path.join(__dirname, './src/js/redux/actions'),
      'json'              : path.join(__dirname, './src/componentJSON'),
      'locales'           : path.join(__dirname, './src/locales'),
    }
  },
  /*module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel?cacheDirectory=cache',
      exclude: /node_modules/,
      include: path.join(__dirname, 'src/js/redux')
    }]
  }*/
  /*devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
  },*/
/*  output: {
    path: __dirname + '/build/',
    publicPath: '/assets/',
    filename: "bundle.js"
  },*/
  /*plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(), 
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new webpack.optimize.CommonsChunkPlugin('commons', 'common.bundle.js'),
  ],*/
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(), //分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new AssetsPlugin({
      path: path.join(__dirname, 'build'),
      filename: 'webpack.assets.js',
      // processOutput: assets => 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets)
    })
  ],

};
