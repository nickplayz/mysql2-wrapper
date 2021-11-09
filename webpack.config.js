const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { IgnorePlugin } = require("webpack");

const outputPath = path.resolve('./dist');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
    externals:{
        'alt-server': 'alt-server'
    },
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /^cardinal$/,
            contextRegExp: /./,
        }),
        new CopyPlugin({
            patterns: ['./static'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.d.ts'],
        mainFields: ['main'],
    },
    output: {
        path: outputPath,
        filename: 'index.cjs',
        libraryExport: 'default',
        libraryTarget: 'umd',
        umdNamedDefine: true ,
    },
    optimization: {
        minimize: false,
    },
}