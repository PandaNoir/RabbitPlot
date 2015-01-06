module.exports = function(config) {
    config.set({
        basePath: './',

        files: [
            'https://code.angularjs.org/1.3.0/angular.min.js',
            'https://code.angularjs.org/1.3.0/angular-touch.min.js',
            'https://code.angularjs.org/1.3.0/angular-animate.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-mocks.js',
            './js/underscore-min.js',
            './js/mainController.js',
            './js/calendar.js',
            './js/eventCal.js',
            './js/eventEditor.js',
            './js/groupEditor.js',
            './js/detail.js',
            './js/setting.js',
            './js/factory.js',
            './js/test.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
        ]

    })
}
