angular.module(appName)
.controller('eventListCtrl',['$scope','group','user','eventListToEdit','eventForm','mode',function($scope,group,user,eventListToEdit,eventForm,mode){//{{{
    $scope.eventListToEdit=eventListToEdit;
    $scope.group=group;
    $scope.user=user;
    $scope.habitList= eventListToEdit.id!=='private' ? group[eventListToEdit.id].habit : user['private'].habit;
    $scope.eventList= eventListToEdit.id!=='private' ? group[eventListToEdit.id].event : user['private'].event;
    $scope.mode=mode;
}]);
