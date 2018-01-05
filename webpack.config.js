const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

const templates = fs.readdirSync('./src').filter(x => x !== 'lib')

module.exports = {
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false
  },
  entry: templates.reduce((acc, template) => ({
    ...acc,
    [template]: `./src/${template}/${template}.js`
  }), {}),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].entry.js'
  },
  module: {
    rules: [
      {
        test: /\.js(x)?$/,
        include: [
          path.join(__dirname, 'src')
        ],
        loaders: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              'react',
              ['env', {
                targets: {
                  chrome: '41'
                }
              }]
            ]
          }
        }]
      }
    ],
    noParse: [
      // WORKAROUND: For `hls.js >=0.6.x`.
      // Avoids the `This seems to be a pre-built javascript file.` warning.
      // See, https://github.com/dailymotion/hls.js/issues/265#issuecomment-233661596
      /\/node_modules\/hls\.js\/.+$/
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react'
    }),
    ...templates.map(template =>
      new HtmlWebpackPlugin({
        inlineSource: '.(js|css)$',
        filename: template + '.html',
        chunks: [template],
        template: 'index.html'
      })
    ),
    new HtmlWebpackInlineSourcePlugin()
  ],
  externals: {
    ws: 'WebSocket'
  }
}
