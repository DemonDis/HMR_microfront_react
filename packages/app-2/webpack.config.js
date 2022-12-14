const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  mode: "development",
  entry: './src/index.js',
  // experiments: {
  //   asset: true
  // },

  output: {
    publicPath: "http://localhost:8081/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },

  devServer: {
    port: 8081,
    historyApiFallback: true,
    headers: {"Access-Control-Allow-Origin": "*"}
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // {
      //   test: /\.(png|jpg|jpeg|svg)$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "file-loader",
      //   },
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "app_2",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        './BtnApp2': './src/BtnApp2.jsx',
        './PngTestImg': './src/PngTest.png',
        './SvgTestImg': './src/SvgTest.svg',
        './SvgTest': './src/ArrowUndo.jsx'
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
