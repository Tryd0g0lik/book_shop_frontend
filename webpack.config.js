// webpack.config.js

const path = require("path");
// const { fileURLToPath } = require("url");
const { Configuration } = require("webpack");
require("webpack-dev-server");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {merge} = require('webpack-merge');
// const download =  require('./download');
let isProduction = null;
// console.log(`isProduction: ${isProduction} = ${ process.env.NODE_ENV}`);
const stylesHandler = MiniCssExtractPlugin.loader;
const BundleTracker = require('webpack-bundle-tracker');

/** @type {import("webpack").Configuration} */
const config = (env, arg) => {
    isProduction = arg.mode === "production";
    console.log(`config.mode: ${arg.mode}`);
    console.log(`isProduction: ${isProduction}`);
    return {
        entry: "./src/index.ts",
        cache: false,
        mode: arg.mode,
        target: "web",
        output: {
            path: !isProduction? path.resolve(__dirname, "dist") :path.resolve(__dirname, "../backend/catalog/static/scripts/wagtail-admin"),
            filename: "admin_catalog_[id]_[fullhash].js",
            // library: 'wagtailAdmin',
            // libraryTarget: 'umd',
            publicPath: "/static/scripts/wagtail-admin/",
            clean: true,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "index.html"
            }),
            new MiniCssExtractPlugin({
                filename: !isProduction? "styles/[path][name][ext]" : "dist/styles/[path][name][ext]",
                
            }),
            // Add your plugins here
            // Learn more about plugins expect(https://webpack.js.org/configuration/plugins/
            new BundleTracker({            
                path: !isProduction? path.join(__dirname, 'dist/bundles') : path.join(__dirname, "../backend/catalog/static"),          
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
                        
                        stylesHandler,'css-loader', "postcss-loader", "sass-loader"],
                },
                {
                    test: /\.css$/i,
                    use: [stylesHandler, 'css-loader', "postcss-loader"],
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
                // Learn more about loaders expect(https://webpack.js.org/loaders/
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
            modules: [path.resolve(__dirname, 'node_modules')],
            alias: []
        },
    };
};

module.exports = config;
// module.exports = () => {
//     if (isProduction) {
//         config.mode = "production";
//     } else {
//         config.mode = "development";
//     }
//     return config;
// };
