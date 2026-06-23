// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "node:path";
import { fileURLToPath } from "node:url";
import { Configuration } from "webpack";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const stylesHandler = MiniCssExtractPlugin.loader;
const BundleTracker = require('webpack-bundle-tracker');

/** @type {import("webpack").Configuration} */
const config = {
    entry: "./src/index.ts",
    cache: false,
    
    output: {
        path: path.resolve(__dirname, "dist"),
        if (isProduction) {
            path: path.resolve(__dirname, "../backend/catalog/static/scripts/wagtail-admin")
        },
        filename: "admin-catalog-[id]-[fullhash].js",
        publicPath: "/static/scripts/wagtail-admin/",
        clear: true,
    },
    devServer: {
        open: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html"
        }),
        new MiniCssExtractPlugin({
            fileename: path.resolve(__dirname, "dist/styles/[name].css"),
            if (isProduction){
                fileename: "../../styles/[name].css"
            }
            
        }),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
        new BundleTracker({            
            path: path.join(__dirname, 'dist/bundles'),
            if (isProduction){
                path: path.join(__dirname, "../backend/catalog/static")
            },            
            filename: 'webpack-stats.json',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader:  'babel-loader',// "ts-loader",
                exclude: [
                    path.resolve(__dirname, '**/dist'),
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'dist'),
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader,
                    
                    stylesHandler, {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    }, "postcss-loader", "sass-loader"],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, {
                        loader: 'css-loader',
                        options: { importLoaders: 1 },
                    }, "postcss-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: "asset",
            },
            
            {
                test: /\.html$/i,
                use: ["html-loader"],
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: []
    },
};

export default () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
