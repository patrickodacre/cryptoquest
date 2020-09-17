const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './webapp/index.js',
    },
    plugins: [
        // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
        new CleanWebpackPlugin(),
        // new HtmlWebpackPlugin({
            // title: 'Production',
        // }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './webapp/public'),
    },
};
