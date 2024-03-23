// webpack.config.js
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Other webpack config
  externals: [nodeExternals()],
};