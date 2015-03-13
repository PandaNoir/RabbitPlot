var database='http://www40.atpages.jp/chatblanc/genderC/';
angular.module(appName)
.controller('signupCtrl',function($scope,$http){
    function confirmUsername(){
        $scope.waiting=true;
        $http.post(database+'confirm.php',{'username':$scope.username}).then(function(mes){
            mes=mes.data;
            if(mes==='OK'){
                $scope.canUse='使えます';
            }else{
                $scope.canUse='使えません';
            }
            $scope.waiting=false;
        });
    }
    function signup(){
        $http.post(database+'signup.php',{
            'username':JSON.stringify($scope.username),
            'password':(new jsSHA($scope.password,'TEXT')).getHash('SHA-384','HEX'),
            'id':JSON.stringify(uuid())
        }).then(function(mes){
            mes=mes.data;
            if(mes==='OK'){
                alert('登録完了しました.');
                //location.href='http://pandanoir.web.fc2.com/RabbitPlot';
            }else if(mes==='USERNAME'){
                alert('すでに'+$scope.username+'というユーザー名は使用されています.');
            }
        });
    };
    $scope.confirmUsername=confirmUsername;
    $scope.signup=signup;
    $scope.username='';
    $scope.password='';
    $scope.waiting=false;
});
