
const merge = require('webpack-merge');

const webpackConfig = merge(require('./webpack.dev.js'), {
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|\.spec\.ts$)/,
                loader: 'istanbul-instrumenter-loader',
                enforce: 'post',
                options: {
                    esModules: true
                }
            }
        ]
    }
});

module.exports = (config) => {
    config.set({
        client: {
            clearContext: false
        },
        frameworks: ['jasmine'],
        files: [
            { pattern: '**/*.spec.ts' }
        ],
        preprocessors: {
            '**/*.ts': ['webpack', 'sourcemap']
        },
        reporters: ['spec', 'kjhtml', 'coverage-istanbul'],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        webpack: webpackConfig,
        coverageIstanbulReporter: {
            reports: ['lcovonly', 'text', 'text-summary'],
            fixWebpackSourcePaths: true
        }
    });
};