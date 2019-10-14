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
        reporters: ['spec', 'kjhtml'],
        browsers: ['ChromeHeadless'],
        singleRun: true,
        webpack: require('./webpack.dev.js')
    });
};