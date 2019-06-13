const path = require('path');

module.exports = {
  name: 'getscripts',
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx'],
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
    ],
  },
  plugins: [],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist',
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
  },
};
