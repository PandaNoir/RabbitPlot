angular.module(appName)
.controller('groupEditorCtrl',['$scope','group','groupForm','db','$mdToast',function($scope,group,groupForm,db,$mdToast){
    $scope.groupForm=groupForm;
    $scope.groupForm.parentGroup=[null];
    $scope.groupForm.mode='add';
    $scope.group=group;
    $scope.finishMakingAGroup=function(){groupForm.isEditMode=false;};
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
        db.post(ele,$scope.group.length-1,'insert').success($scope.finishMakingAGroup);
        $mdToast.show($mdToast.simple().content('グループ '+$scope.groupForm.name+' を作成しました').position('top right').hideDelay(3000));

        $scope.groupForm.name='';
    }
}]);
