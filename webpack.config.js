// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: ['core-js/fn/promise',
    'whatwg-fetch',
    '@babel/polyfill',
    './src/presentation/index.js',
  ],
  output: {
    path: path.join(__dirname, 'output'),
    filename: "bundle.js",
  },
  devServer: {
    open: true,//ブラウザを自動で開く
    openPage: "index.html",//自動で指定したページを開く
    contentBase: path.join(__dirname, 'public'),// HTML等コンテンツのルートディレクトリ
    watchContentBase: true,//コンテンツの変更監視をする
    host: 'localhost',
    port: 8080, // ポート番号
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        secure: false
      }
    },
    inline: true, // 変更があった場合にページをリロード
    hot: true, // 変更のあった箇所のみ更新
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ["@babel/preset-env",
                  {
                    'modules': false, "targets": {
                      "ie": 11
                    }, useBuiltIns: "usage", corejs: 2
                  }
                ],
                "@babel/react",
              ]
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [
              'react-html-attrs',
              [require('@babel/plugin-proposal-decorators'), { legacy: true }]
            ],
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    })
  ]
};
