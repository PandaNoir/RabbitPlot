angular.module(appName)
.controller('groupEditor',['$scope','group','groupForm','db',function($scope,group,groupForm,db){
    $scope.groupForm=groupForm;
    $scope.groupForm.parentGroup=[null];
    $scope.groupForm.mode='add';
    $scope.group=group;
    $scope.addGroup=function(){
        var parentGroup=$scope.groupForm.parentGroup.reduce(function(a,b){
            if(a.indexOf(b)===-1) a[a.length]=angular.isNumber(b)?parseInt(b,10):'';
            return a;
        },[]);
        var ele={
            event:[],
            habit:[],
            name:$scope.groupForm.name,
            updated:true
        }
        if(parentGroup.join('')!==''){
            ele.parents=parentGroup;
        }
        group[group.length]=ele;
        db.post(ele,$scope.group.length-1,'insert').success(function(){$scope.endMakingAGroup()});
        $scope.dialog('グループ '+$scope.groupForm.name+' を作成しました');
    }
}]);
