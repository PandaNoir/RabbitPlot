angular.module(appName)
.controller('detailCtrl',['$scope','eventCal','calF','mode',function($scope,eventCal,calF,mode){
    $scope.mode=mode;
    $scope.calF=calF;
    $scope.eventCalendar=eventCal.eventCalendar;
}]);
