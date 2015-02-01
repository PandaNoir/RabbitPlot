angular.module(appName)
.controller('detailCtrl',['$scope','eventForm','user','group','mode',function($scope,eventForm,user,group,mode){
    $scope.mode=mode;
}]);
