angular.module(appName)
.controller('groupEditorCtrl',['$scope','group','groupForm','db','$mdToast','mode',function($scope,group,groupForm,db,$mdToast,mode){
    $scope.groupForm=groupForm;
    groupForm.parentGroup=[null];
    groupForm.mode='add';
    $scope.group=group;
    $scope.finishMakingGroup=function(){mode.editsGroup=false;};
    $scope.addGroup=function(){
        var parentGroup=groupForm.parentGroup.reduce(function(a,b){
            if(a.indexOf(b)===-1) a[a.length]=angular.isNumber(b)?toInt(b):'';
            return a;
        },[]);
        var ele={
            event:[],
            habit:[],
            name:groupForm.name,
            updated:true
        }
        if(parentGroup.join('')!==''){
            ele.parents=parentGroup;
        }
        group[group.length]=ele;
        db.post(ele,group.length-1,'insert').success($scope.finishMakingGroup);
        $mdToast.show($mdToast.simple().content('グループ '+groupForm.name+' を作成しました').position('top right').hideDelay(3000));

        groupForm.name='';
    };
    $scope.cancel=function(){
        mode.editsGroup=false;
    };
}]);
