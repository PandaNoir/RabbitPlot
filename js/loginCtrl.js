angular.module(appName)
.controller('loginCtrl',function($scope,db,user,mode,$mdToast,localStorageService){
    $scope.login=function(){
        db.login({'username':$scope.username,'password':getHash($scope.password)}).then(function(mes){
            mes=mes.data;
            if(mes==='failed'){
                $mdToast.show($mdToast.simple().content('ログインに失敗しました').position('top right').hideDelay(3000));
                return;
            }
            $mdToast.show($mdToast.simple().content('ログインに成功しました').position('top right').hideDelay(3000));
            for(var key in mes){
                user[key]=angular.fromJson(mes[key]);
            }
            localStorageService.set('username',$scope.username);
            localStorageService.set('password',getHash($scope.password));
            user.isLoggedIn=true;
            user.save();
            mode.login=false;
        });
    };
})
