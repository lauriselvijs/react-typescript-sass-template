import path from "path";
import { Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import CopyPlugin from "copy-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

const devServer: DevServerConfiguration = {
  static: {
    directory: path.resolve(__dirname, "src"),
  },
  historyApiFallback: true,
  compress: true,
  hot: true,
  open: true,
  port: 3000,
};

const config: Configuration = {
  mode: isProduction ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "static/js/main.[contenthash].js",
    clean: true,
    assetModuleFilename: "static/media/[name].[contenthash][ext]",
  },
  entry: path.resolve(__dirname, "src/index.tsx"),
  devtool: "source-map",
  devServer,
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          "resolve-url-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/inline",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "./index.html",
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      manifest: "./public/manifest.json",
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.[contenthash].css",
    }),
    new CopyPlugin({
      patterns: [
        { from: "./public/manifest.json", to: "./" },
        { from: "./public/robots.txt", to: "./" },
        { from: "./public/logo192.png", to: "./" },
        { from: "./public/logo512.png", to: "./" },
      ],
    }),
    ...(!isProduction
      ? [
          new ESLintPlugin({
            extensions: ["js", "jsx", "ts", "tsx"],
          }),
          new ForkTsCheckerWebpackPlugin({
            async: false,
          }),
        ]
      : []),
    ...(isProduction
      ? [
          new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                plugins: [
                  ["gifsicle", { interlaced: true }],
                  ["jpegtran", { progressive: true }],
                  ["optipng", { optimizationLevel: 5 }],
                  [
                    "svgo",
                    {
                      multipass: true,
                      plugins: ["preset-default"],
                    },
                  ],
                ],
              },
            },
          }),
          new CompressionPlugin({
            algorithm: "gzip",
            deleteOriginalAssets: false,
            threshold: 1 * 1024,
          }),
        ]
      : []),
  ],
};

export default config;
