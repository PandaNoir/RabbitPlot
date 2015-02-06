angular.module(appName)
.controller('eventListCtrl',['$scope','group','user','eventListToEdit','eventForm','mode','$log',function($scope,group,user,eventListToEdit,eventForm,mode,$log){//{{{
    $scope.eventListToEdit=eventListToEdit;
    $scope.group=group;
    $scope.user=user;
    $log.log('eventListToEdit.id===',eventListToEdit.id);
    if(eventListToEdit.id!=='private'&&eventListToEdit.id!==''){
        $scope.habitList=group[eventListToEdit.id].habit;
        $scope.eventList=group[eventListToEdit.id].event;
    }else{
        $scope.habitList=user['private'].habit;
        $scope.eventList=user['private'].event;
    }
    $scope.mode=mode;
}]);
