angular.module(appName)
.controller('detailCtrl',['$scope','eventCal','calF','group','user','mode','db',function($scope,eventCal,calF,group,user,mode,db){
    $scope.mode=mode;
    $scope.calF=calF;
    $scope.eventCalendar=eventCal.eventCalendar;
    $scope.user=user;
    $scope.isToday=function(){
        return calF.selected===calF.today.date && calF.month===calF.today.month && calF.year===calF.today.year;
    };
}]);
