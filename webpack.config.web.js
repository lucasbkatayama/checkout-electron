const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

const webpackConfig = merge.smart(baseConfig, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"web"'
            }
        })
    ],
    node: {
        fs: 'empty'
    },
    target: 'web',
    devServer: {
        historyApiFallback: true
    }
});

module.exports = webpackConfig;
