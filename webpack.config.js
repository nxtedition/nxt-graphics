const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  performance: {
    hints: false
  },
  devtool: !isProduction && 'cheap-eval-source-map',
  entry: `./src/index.js`,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    publicPath: '' // relative to HTML page (same directory)
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?|webm)(\?[a-z0-9=&.]+)?$/,
        use: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.js(x)?$/,
        exclude: path.join(__dirname, 'node_modules'),
        loaders: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              'react',
              ['env', {
                targets: {
                  chrome: '33'
                }
              }]
            ],
            plugins: [
              'transform-runtime',
              'transform-decorators-legacy',
              'transform-object-rest-spread',
              'transform-export-extensions',
              'transform-function-bind',
              'transform-class-properties',
              'transform-react-jsx-source'
            ]
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([ path.join(__dirname, 'dist') ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    ...(
      isProduction ? [
        new webpack.optimize.UglifyJsPlugin()
      ] : []
    )
  ],
  externals: {
    ws: 'WebSocket'
  }
}
