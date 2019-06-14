const path = require('path');
const htmlList = ['index'];
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlPlugins = htmlList.map(function(htmlName) {
  return new HtmlWebpackPlugin({
    filename: `${htmlName}.html`,
    template: `./${htmlName}.html`,
    hash: true,
    chunks: [`${htmlName}`],
  });
});

module.exports = {
  name: 'getscripts',
  mode: 'production',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },

  entry: {
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'react-hot-loader/babel',
            'babel-plugin-styled-components',
          ],
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  plugins: [].concat(htmlPlugins),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/build',
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
};
