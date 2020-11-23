  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { CleanWebpackPlugin } = require('clean-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const WorkboxPlugin = require('workbox-webpack-plugin');
  const imgPath = './images/';
  const imageminGifsicle = require("imagemin-gifsicle");
  const imageminPngquant = require("imagemin-pngquant");
  const imageminSvgo = require("imagemin-svgo");
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const CopyPlugin = require('copy-webpack-plugin');

  module.exports = {
    mode: 'development',
    entry: {
      app: './src/index.js',
      demo: './src/demo.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      compress: true,
      port: 9000
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.twig$/,
          use: [
            'raw-loader',
            'twig-html-loader'
          ]
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            // fallback to style-loader in development
            // process.env.NODE_ENV !== 'production' // 'production' 'development'
            // ? 'style-loader' : MiniCssExtractPlugin.loader,
            // "style-loader",
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                // sourceMap: true,
                // Prefer `dart-sass`
                implementation: require('sass'),
              }
            }
          ]
        },
        {
          test: /\.css$/i,
          use: [
            // 'style-loader',
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader?name=images/[name].[ext]',
              options: {
                publicPath: imgPath
              }
            },
            {
              loader: 'img-loader',
              options: {
                  plugins: [
                      imageminGifsicle({
                          interlaced: false
                      }),
                      imageminMozjpeg({
                          progressive: true,
                          arithmetic: false
                      }),
                      imageminPngquant({
                          floyd: 0.5,
                          speed: 2
                      }),
                      imageminSvgo({
                          plugins: [
                              { removeTitle: true },
                              { convertPathData: false }
                          ]
                      })
                  ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.twig'), // .twig './src/index.twig', resolve(__dirname, 'src/public', 'index.html'),
        filename: './index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: false
        }
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'photos.twig'), // .twig './src/photos.twig', resolve(__dirname, 'src/public', 'photos.html'),
        filename: './photos.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: false
        }
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/images', to: 'images' },
        ],
      }),
    ]
  };