'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

module.exports = {
    entry: [
        path.join(__dirname, 'app/main.js')
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name]-[hash].min.js',
        publicPath: ''
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new HtmlWebpackPlugin({
            template: 'app/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('[name]-[hash].min.css'),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
                screw_ie8: true
            },
            mangle: false
        }),
        new StatsPlugin('webpack.stats.json', {
            source: false,
            modules: false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
        loaders: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                "presets": ["es2015"]
            }
        }, {
            test: /\.json?$/,
            loader: 'json'
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css?modules&localIdentName=[local]!postcss')
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: true
            }
        }],
        rules: [
            {
                test: /\.txt$/,
                use: 'raw-loader'
            }
        ]
    },
    postcss: [
        require('autoprefixer')
    ]
};