const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const WebpackDeleteAfterEmit = require('webpack-delete-after-emit')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

// TODO use config to copy
function setupConfig () {
  const raw = fs.existsSync(path.join(__dirname, 'config.json'))
    ? require('./config.json')
    : {}

  return {
    postBuild: {
      copyTo: (raw.postBuild && raw.postBuild.copyTo) || []
    }
  }
}

const config = setupConfig()

const templates = fs
  .readdirSync('./src')
  .filter(x => x !== 'lib' && !x.includes('.') && fs
    .readdirSync(path.join('./src', x))
    .some(y => y === 'index.js')
  )

module.exports = {
  performance: {
    hints: false
  },
  entry: templates.reduce((acc, template) => ({
    ...acc,
    [template]: `./src/${template}/index.js`
  }), {}),
  output: {
    path: path.join(__dirname, 'templates'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      // TODO no inline
      {
        test: /\.(jpe?g|png|ttf|eot|svg|woff(2)?|webm)(\?[a-z0-9=&.]+)?$/,
        use: 'base64-inline-loader?name=[name].[ext]'
      },
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
        inlineSource: '.(js|css)$', // TODO no inline
        filename: template + '.html', // TODO .wt once supported
        chunks: [template],
        template: 'index.html'
      })
    ),
    new HtmlWebpackInlineSourcePlugin(),
    new WebpackDeleteAfterEmit({
      globs: ['*.js', '*.css']
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: config.postBuild.copyTo.map(destination => ({ source: path.join(__dirname, 'templates'), destination }))
      }
    })
  ],
  externals: {
    ws: 'WebSocket'
  }
}
