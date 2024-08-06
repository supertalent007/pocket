const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist') // Output directory
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Apply this rule to .css files
        use: ['style-loader', 'css-loader'] // Loaders to handle CSS files
      }
    ]
  },
  mode: 'development' // Mode can be 'development' or 'production'
};
