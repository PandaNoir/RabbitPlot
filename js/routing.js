angular.module(appName)
.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl:'/tempindex.html',
        controller: 'mainCtrl' 
    }).when('/signup', {
        templateUrl: '/signup.html',
        controller: 'signupCtrl'
    }).otherwise({redirectTo:'./'})
});
