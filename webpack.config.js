/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const srcRoot = path.resolve(__dirname, 'src');
const appRoot = path.resolve(srcRoot, 'app');

module.exports = (env = {}) => {
  const isDev = env.enviroment === 'development';
  const devtool = isDev ? 'inline-source-map' : 'cheap-source-map';

  return {
    mode: env.enviroment,
    context: path.resolve(__dirname),
    entry: {
      main: ['@babel/polyfill', './src/index.js'],
      vendor: ['react', 'react-dom', 'jquery'],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: isDev ? 'js/[name].bundle.js' : 'js/[name].[chunkhash].bundle.js',
      sourceMapFilename: isDev ? 'js/[name].bundle.map' : 'js/[name].[chunkhash].bundle.map',
      chunkFilename: isDev ? 'js/[id].chunk.js' : 'js/[id].[chunkhash].chunk.js',
      publicPath: '',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader'],
          }),
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          loader: 'file-loader',
          query: {
            name: 'assets/img/[name].[ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: [appRoot, 'node_modules'],
      alias: {
        jquery: path.resolve(path.join(__dirname, 'node_modules', 'jquery')),
      },
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 2200,
      compress: true,
      disableHostCheck: true,
      historyApiFallback: true,
      stats: {
        colors: true,
        errors: true,
        errorDetails: false,
        warnings: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        publicPath: false,
      },
    },
    stats: 'minimal',
    performance: {
      hints: false,
    },
    devtool,
    optimization: !isDev
      ? {
          minimizer: [
            new UglifyJsPlugin({
              parallel: true,
              uglifyOptions: {
                keep_fnames: true,
                comments: false,
                compress: {
                  warnings: false,
                  drop_console: true,
                  dead_code: true,
                  drop_debugger: true,
                  inline: false,
                },
              },
            }),
          ],
          runtimeChunk: false,
          splitChunks: {
            cacheGroups: {
              default: false,
              commons: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor_app',
                chunks: 'all',
                minChunks: 2,
              },
            },
          },
        }
      : undefined,
    plugins: [
      new ExtractTextPlugin({ filename: 'assets/custom-style.css' }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new HtmlWebpackPlugin({
        template: path.resolve(srcRoot, 'index.html'),
        chunksSortMode: 'dependency',
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        jquery: 'jquery',
        axios: 'axios',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.enviroment),
        globals: JSON.stringify(process.env),
      }),
    ],
  };
};
