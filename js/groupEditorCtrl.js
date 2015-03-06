angular.module(appName)
.controller('groupEditorCtrl',function($scope,group,user,groupForm,db,$mdToast,mode){
    $scope.groupForm=groupForm;
    $scope.user=user;
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
            description:groupForm.description,
            updated:true
        }
        if(parentGroup.join('')!==''){
            ele.parents=parentGroup;
        }
        group[group.length]=ele;
        db.post(ele,group.length-1,'insert').success($scope.finishMakingGroup);
        $mdToast.show($mdToast.simple().content('グループ '+groupForm.name+' を作成しました').position('top right').hideDelay(3000));

        groupForm.name='';
        groupForm.description='';
    };
    $scope.cancel=function(){
        mode.editsGroup=false;
    };
});
