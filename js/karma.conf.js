module.exports = function(config) {
    config.set({
        basePath: './',

        files: [
            'https://code.angularjs.org/1.3.0/angular.min.js',
            'https://code.angularjs.org/1.3.0/angular-touch.min.js',
            'https://code.angularjs.org/1.3.0/angular-animate.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-mocks.js',
            'underscore-min.js',
            'mainController.js',
            'calendar.js',
            'eventCal.js',
            'eventEditor.js',
            'groupEditor.js',
            'detail.js',
            'setting.js',
            'factory.js',
            'test.js'
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
