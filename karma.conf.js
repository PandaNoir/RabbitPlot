// Karma configuration
// Generated on Tue Feb 10 2015 23:04:46 GMT+0900 (JST)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'https://cdn.jsdelivr.net/hammerjs/2.0.4/hammer.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular-touch.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular-animate.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular-aria.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular-messages.min.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.12/angular-mocks.js',
            'https://ajax.googleapis.com/ajax/libs/angular_material/0.7.1/angular-material.min.js',

            'js/lodash.min.js',
            'js/main.js',
            'spec/*.js',
            'js/main.js',
            'spec/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
