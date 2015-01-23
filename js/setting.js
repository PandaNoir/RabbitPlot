angular.module(appName)
.controller('setting',['$scope','group','user','db','eventListToEdit',function($scope,group,user,db,eventListToEdit){//{{{
    function sortByNumber(a,b){
        return a-b;
    }
    $scope.isGroupEditMode=false;
    $scope.group=group;
    $scope.user=user;
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
    function follows(id){return $scope.user.following.indexOf(id)!==-1;};
    $scope.follows=follows;
    $scope.follow=function(id){//{{{
        //フォロー処理。一応ソートかけておく
        $scope.user.following[$scope.user.following.length]=id;
        $scope.user.following.sort(sortByNumber);
        user.save();
        $scope.dialog(group[id].name+'をフォローしました');
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
    $scope.makeAGroup=function(){$scope.isGroupEditMode=true;};
    $scope.finishMakingAGroup=function(){$scope.isGroupEditMode=false;};
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
        $scope.dialog({
            mes:'エクスポートしたデータを入力してください。',
            val:'',
            showsInputDialog:true,
            time:true,
            focus:true,
            locked:true,
            callback:(function($scope){
                return function(value){
                    value=JSON.parse(value);
                    console.log(user,value);
                    for(var key in value){
                        user[key]=value[key];
                    }
                    user.save();
                };
            })($scope)
        });
    };//}}}
    $scope.exportSetting=function(){
        $scope.dialog({mes:'これをコピーして移行先で貼り付けてください',val:user,showsInputDialog:true,time:true,focus:true,locked:true});
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
