angular.module(appName)
.controller('detailCtrl',['$scope','eventCal','calF','mode',function($scope,eventCal,calF,mode){
    $scope.mode=mode;
    $scope.calF=calF;
    $scope.eventCalendar=eventCal.eventCalendar;
    $scope.isToday=function(){
        return calF.selected===calF.today.date && calF.month===calF.today.month && calF.year===calF.today.year;
    };
}]);
