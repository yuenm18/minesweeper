const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    devServer: {
        compress: true,
        host: '0.0.0.0',
        hot: true,
        overlay: true
    },
    devtool: 'inline-source-map',
    mode: 'development'
});