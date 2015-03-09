angular.module(appName)
.controller('loginCtrl',function($scope,db,user,mode,$mdToast){
    $scope.login=function(){
        db.login({'username':$scope.username,'password':getHash($scope.password)}).then(function(_mes_){
            var mes=_mes_.data;
            if(mes==='failed'){
                $mdToast.show($mdToast.simple().content('ログインに失敗しました').position('top right').hideDelay(3000));
                return;
            }
            $mdToast.show($mdToast.simple().content('ログインに成功しました').position('top right').hideDelay(3000));
            for(var key in mes){
                user[key]=angular.fromJson(mes[key]);
            }
            user.save();
            mode.login=false;
        });
    };
})
