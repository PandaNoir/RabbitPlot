console.log('hoge');
angular.module(appName)
.config(function($routeProvider) {
    $routeProvider.when('/RabbitPlot/', {
        templateUrl:'/RabbitPlot/tempindex.html',
        controller: 'mainCtrl' 
    }).when('/RabbitPlot/signup', {
        templateUrl: '/RabbitPlot/signup.html',
        controller: 'signupCtrl'
    });
});
