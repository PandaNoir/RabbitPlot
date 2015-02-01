angular.module(appName)
.controller('settingCtrl',['$scope','group','user','db','eventListToEdit','groupForm','$mdSidenav','$mdToast','$mdDialog',function($scope,group,user,db,eventListToEdit,groupForm,$mdSidenav,$mdToast,$mdDialog){//{{{
    function sortByNumber(a,b){
        return a-b;
    };
    $scope.group=group;
    $scope.user=user;
    $scope.groupForm=groupForm;
    $scope.search_keyword='';
    $scope.searchResult=[];
    $scope.hide=function(id){//{{{
        user.hiddenGroup[user.hiddenGroup.length]=id;
        user.hiddenGroup.sort(sortByNumber);
        user.save();
    };//}}}
    $scope.show=function(id){//{{{
        user.hiddenGroup=_.without($scope.user.hiddenGroup,id);
        user.save();
    };//}}}
    $scope.followsParent=function followsParent(groupID){//{{{
        var parents=parentsList(groupID);
        for(var i=0,j=parents.length;i<j;i++){
            if(!follows(parents[i])){
                return parents[i];
            }
        }
        return true;
    };//}}}

    $scope.toggleNav=function(){
        console.log('called');
        $mdSidenav('left').close();
    };
    function follows(id){return $scope.user.following.indexOf(id)!==-1;};
    $scope.follows=follows;
    $scope.follow=function(id){//{{{
        //フォロー処理。一応ソートかけておく
        $scope.user.following[$scope.user.following.length]=id;
        $scope.user.following.sort(sortByNumber);
        user.save();
        $mdToast.show($mdToast.simple().content(group[id].name+'をフォローしました').position('top right').hideDelay(3000));


    };//}}}
    $scope.unfollow=function(id){//{{{
        //フォロー解除する。親グループが解除されそうになったら、確認取る。確認取れたら子グループも解除する。確認取れなかったら親の解除もキャンセル
        var unfollowList=[];
        unfollowList[unfollowList.length]=$scope.user.following.indexOf(id);
        for(var i=0,j=$scope.user.following.length;i<j;i++){
            //フォローしているものを回す
            if(group[$scope.user.following[i]].parents){
                //親要素がある
                if(parentsList($scope.user.following[i]).indexOf(id)!=-1){
                    //親にidが含まれている
                    if(!confirm('このグループの子グループ('+group[$scope.user.following[i]].name+')をフォローしています。このグループをフォロー解除するとこちらも解除になります。よろしいですか?')){
                        return;
                    }
                    unfollowList[unfollowList.length]=i;
                }
            }
        }
        unfollowList.sort(function(a,b){return (b-a);});
        for(var i=0,j=unfollowList.length;i<j;i++){
            $scope.user.following.splice(unfollowList[i],1);
        }
        user.save();
    };//}}}
    $scope.showEventList=function(id){
        eventListToEdit.id=id;
    };
    function parentsList(groupID){
        if(!group[groupID].parents) return [];
        var res=group[groupID].parents;
        for(var i=0,j=group[groupID].parents.length;i<j;i++){
            res=parentsList(group[groupID].parents[i]).concat(res);
        }
        return res;
    }
    $scope.makeAGroup=function(){
        groupForm.isEditMode=true;
        $mdSidenav('left').close();
    };
    $scope.search=function(){//{{{
        //キーワードで検索する。例えば「新潟」で新潟高校がでるみたいな
        var res=[];
        if($scope.search_keyword==''){
            return res;
        }
        for(var i=0,j=group.length;i<j;i++){
            if(res.length>30) break;
            if(group[i].name.indexOf($scope.search_keyword)!==-1){
                res[res.length]=i;
            }
        }
        $scope.searchResult=res;
    };//}}}
    $scope.randomSearch=function(){//{{{
        //ランダム検索
        var res=[];
        if(group.length<5){
            Array.prototype.push.apply(res,group);
        }else{
            while(res.length<5){
                var elm=(Math.random()*group.length)|0;
                if(_.indexOf(res,elm)===-1){
                    res[res.length]=elm;
                }
            }
        }
        $scope.searchResult=res;
    };//}}}
    $scope.hideAll=function(){//{{{
        user.hiddenGroup.length=0;
        user.hiddenGroup=_.clone(user.following);
        user.hiddenGroup[user.hiddenGroup.length]=-1;//privateのidが-1
        user.hiddenGroup.sort(sortByNumber);
        user.save();
    };//}}}
    $scope.showAll=function(){//{{{
        user.hiddenGroup=[];
        user.save();
    };//}}}
    $scope.importSetting=function(){//{{{
       $mdDialog.show({
           controller:['$scope','$mdDialog',function($scope,$mdDialog){
               $scope.text='';
               $scope.answer=function(answer){
                   $mdDialog.hide(answer);
               };
           }],
           template:'<md-dialog><md-content>コピーしたデータを貼り付けてください。<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'
       }).then(function(value){
           value=JSON.parse(value);
           for(var key in value){
               user[key]=value[key];
           }
           user.save();
       });
    };//}}}
    $scope.exportSetting=function(){
        $mdDialog.show($mdDialog.alert().title('').content('これをコピーして移行先で貼り付けてください。'+angular.toJson(user)).ok('ok'))
    };
}])//}}}
.directive('autoFocus',function(){//{{{
    return {
        link:function(scope,element,attrs){
            function observer(value){
                if(scope.focus===true){
                    element[0].focus();
                }
            }
            scope.$watch('focus',observer);
        }
    };
});//}}}
