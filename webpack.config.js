const path = require('path');

module.exports = {
  externals: [ 'aws-sdk' ],
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
    },
   ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join( __dirname, 'dist' ),
    filename: '[name].js',
  },
};