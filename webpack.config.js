const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const port = process.env.PORT || 3000;

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(css|scss)$/i,
                use: [
                    {loader: "css-loader"},
                    {loader: "resolve-url-loader"},
                    {
                        loader: "sass-loader", options: {
                            sourceMap: true,
                        }
                    }
                ],
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "url-loader?limit=1000",
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'file-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new NodePolyfillPlugin()
    ],
    devServer: {
        // publicPath: 'http://localhost:3000/event-list/',
        // hot: true,
        host: 'localhost',
        port: port,
        historyApiFallback: true,
        open: true
    }
};