angular.module(appName)
.controller('detailCtrl',['$scope','eventCal','calendar','user','mode',function($scope,eventCal,calendar,user,mode){
    $scope.mode=mode;
    $scope.calendar=calendar;
    $scope.eventCalendar=eventCal.eventCalendar;
    $scope.user=user;
    $scope.isToday=function(){
        return calendar.selected===calendar.today.date && calendar.month===calendar.today.month && calendar.year===calendar.today.year;
    };
}]);
