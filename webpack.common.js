const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main.ts',
        styles: './src/styles.css'
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(woff(2)?|ttf|eot$)/,
                loader: 'file-loader',
                options: {
                    outputPath: 'fonts',
                }
            }
        ]
    },
    optimization: {
        moduleIds: 'hashed',
        runtimeChunk: 'single'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Minesweeper',
            favicon: 'src/icons/favicon.ico',
            inject: false,
            template: require('html-webpack-template'),
            lang: 'en',
            meta: [
                {
                    name: 'description',
                    content: 'Minesweeper',
                }
            ],
            mobile: true,
            appMountId: 'minesweeper',
            appMountHtmlSnippet: '<noscript>You need to enable JavaScript to run this app.</noscript>'
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),
        new WebpackPwaManifest({
            name: 'Minesweeper',
            short_name: 'Minesweeper',
            description: 'Online implementation of minesweeper',
            background_color: 'grey',
            icons: [
                {
                    src: path.resolve('src/icons/android-chrome-192x192.png'),
                    size: 192,
                    type: 'image/png'
                },
                {
                    src: path.resolve('src/icons/android-chrome-512x512.png'),
                    size: 512,
                    type: 'image/png'
                },
                {
                    src: path.resolve('src/icons/apple-touch-icon.png'),
                    size: 180,
                    type: 'image/png',
                    ios: true
                }
            ],
            theme_color: '#000000',
            ios: true
        }),
        new PreloadWebpackPlugin({
            include: 'allAssets',
            fileWhitelist: [/\.css$/, /\.woff2/, /\.js$/],
            as(entry) {
                if (/\.css$/.test(entry)) return 'style';
                if (/\.woff2$/.test(entry)) return 'font';
                if (/\.js$/.test(entry)) return 'script';
            }
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    }
};