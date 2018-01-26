const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const config = require('./config.js')

function compileTemplate (templateName) {
  return {
    performance: {
      hints: false
    },
    entry: `${config.sourceDirectory}/${templateName}/index.js`,
    output: {
      path: config.templatesDirectory,
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
          include: [ config.sourceDirectory ],
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
      new webpack.ProvidePlugin({
        ReactDOM: 'react-dom',
        React: 'react'
      }),
      new CleanWebpackPlugin([config.templatesDirectory]),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html'
      }),
      new FileManagerPlugin({
        onEnd: {
          copy: config.postBuild.copyTo.map(destination => ({
            source: config.templatesDirectory,
            destination: path.join(destination, templateName)
          }))
        }
      })
    ],
    externals: {
      ws: 'WebSocket'
    },
    resolve: {
      alias: {
        lib: path.resolve(__dirname, 'lib')
      }
    }
  }
}

module.exports = config.templateNames.map(templateName => compileTemplate(templateName))
