angular.module(appName)
.controller('groupEditor',['$scope','group','groupForm',function($scope,group,groupForm){
    $scope.groupForm=groupForm;
    $scope.groupForm.selectedGroup=[''];
    $scope.groupForm.mode='add';
    $scope.group=group;
    $scope.addGroup=function(){
        var selectedGroup=$scope.groupForm.selectedGroup.reduce(function(a,b){
            if(a.indexOf(b)===-1) a.push(b);
            return a;
        },[]);
        var ele={
            eventList:[],
            habit:[],
            name:$scope.groupForm.name,
            updated:true
        }
        if(selectedGroup.join('')!==''){
            ele.parents=selectedGroup;
        }
        $scope.group.push(ele);
    }
}]);
