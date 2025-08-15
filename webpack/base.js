const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const variousConfig = require('../various.config')

const { NODE_ENV } = process.env

const config = {
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../src/index.html'),
    filename: path.resolve(__dirname, '../public/index.html'),
    config: JSON.stringify(variousConfig.config, null, 2),
    inject: false,
  })],
  stats: 'minimal',
  entry: variousConfig.components,
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    libraryTarget: 'amd',
  },
  target: ['web', 'es5'],
  externals: [
    'react',
    'react-dom',
    'react-dom/client',
    'react-router-dom',
    '@variousjs/various',
    ...variousConfig.externals,
  ],
  mode: NODE_ENV || 'production',
  devtool: 'source-map',
  resolve: {
    // 必须加上 .js，不然 webpack dev server 会报错找不到模块
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src/shadcn-ui'),
    },
  },
  devServer: {
    allowedHosts: 'all',
    port: 2333,
    host: '0.0.0.0',
    static: {
      directory: path.join(__dirname, '../public'),
    },
    // 监听文件构建后重新刷新页面，包括 html 文件
    watchFiles: ['public'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: NODE_ENV === 'development',
              modules: {
                localIdentName: '[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: NODE_ENV === 'development',
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
}

module.exports = config
