const path = require('path');

module.exports = {
  externals: [ 'aws-sdk' ],
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [ {
      test: /\.js$/,
      loaders: [ 'babel-loader' ],
    },
   ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join( __dirname, 'dist' ),
    filename: '[name].js',
  },
};