angular.module(appName)
.controller('eventEditor',['$scope','group','user','eventForm',function($scope,group,user,eventForm){
    var today=new Date();
    $scope.group=group;
    $scope.user=user;
    $scope.eventForm=eventForm;
    $scope.addEvent=function(){
        if($scope.eventForm.year===null||$scope.eventForm.month===null||$scope.eventForm.date===null||$scope.eventForm.name===''||$scope.eventForm.selectedGroup===undefined||$scope.eventForm.selectedGroup===null){
            return;
        }
        var testDate=new Date($scope.eventForm.year,$scope.eventForm.month-1,$scope.eventForm.date);
        if(testDate.getFullYear()!==parseInt($scope.eventForm.year,10)||testDate.getMonth()!==parseInt($scope.eventForm.month,10)-1||testDate.getDate()!==parseInt($scope.eventForm.date,10)){
            //正常範囲に入っていない
            return;
        }
        if($scope.eventForm.type=='event'){
            var target={
                year:$scope.eventForm.year,
                month:$scope.eventForm.month-1,//!!important
                date:$scope.eventForm.date,
                name:$scope.eventForm.name
            };
            if($scope.eventForm.selectedGroup==='private'){
                $scope.user.private.eventList.push(target);
            }else if($scope.eventForm.selectedGroup!==null){
                $scope.group[$scope.eventForm.selectedGroup].eventList.push(target);
                $scope.group[$scope.eventForm.selectedGroup].updated=true;
            }
        }else if($scope.eventForm.type=='habit'){
            var target={
                selector:$scope.eventForm.rule,
                name:$scope.eventForm.name
            };
            if($scope.eventForm.selectedGroup==='private'){
                $scope.user.private.habit.push(target);
            }else if($scope.eventForm.selectedGroup!==null){
                $scope.group[$scope.eventForm.selectedGroup].habit.push(target);
                $scope.group[$scope.eventForm.selectedGroup].updated=true;
            }
        }
        $scope.eventForm.isEditMode=false;
        save();
    };
    $scope.saveEvent=function(){
        //編集したイベントを保存する
        if($scope.eventForm.year===null||$scope.eventForm.month===null||$scope.eventForm.date===null||$scope.eventForm.name===''){
        //selectedGroupは変更できない仕様だから判定いらない
            return;
        }
        var testDate=new Date($scope.eventForm.year,$scope.eventForm.month-1,$scope.eventForm.date);
        if(testDate.getFullYear()!==parseInt($scope.eventForm.year,10)||testDate.getMonth()!==parseInt($scope.eventForm.month,10)-1||testDate.getDate()!==parseInt($scope.eventForm.date,10)){
            //正常範囲に入っていない
            return;
        }
        if($scope.eventForm.type=='event'){
            var group;
            if($scope.eventForm.selectedGroup==='private'){
                var group=$scope.user.private.eventList[$scope.eventForm.id];
            }else if($scope.eventForm.selectedGroup!==null){
                var group=$scope.group[$scope.eventForm.selectedGroup].eventList[$scope.eventForm.id];
                $scope.group[$scope.eventForm.selectedGroup].updated=true;
            }
            group.year=$scope.eventForm.year;
            group.month=$scope.eventForm.month-1;
            group.date=$scope.eventForm.date;
            group.name=$scope.eventForm.name;

        }else if($scope.eventForm.type=='habit'){
            var group;
            if($scope.eventForm.selectedGroup==='private'){
                group=$scope.user.private.habit[$scope.eventForm.id]
            }else if($scope.eventForm.selectedGroup!==null){
                group=$scope.group[$scope.eventForm.selectedGroup].habit[$scope.eventForm.id]
                $scope.group[$scope.eventForm.selectedGroup].updated=true;
            }
            group.selector=$scope.eventForm.rule;
            group.name=$scope.eventForm.name;
        }
        $scope.eventForm.isEditMode=false;
        save();
    };
    $scope.cancel=function(){
        $scope.eventForm.isEditMode=false;
    };
    function save(){
        function setCookie(c_name,value,expiredays){
            // pathの指定
            var path = location.pathname;
            // pathをフォルダ毎に指定する場合のIE対策
            var paths = new Array();
            paths = path.split("/");
            if(paths[paths.length-1] != ""){
                paths[paths.length-1] = "";
                path = paths.join("/");
            }
            // 有効期限の日付
            var extime = new Date().getTime();
            var cltime = new Date(extime + (60*60*24*1000*expiredays));
            var exdate = cltime.toUTCString();
            // クッキーに保存する文字列を生成
            var s="";
            s += c_name +"="+ escape(value);// 値はエンコードしておく
            s += "; path="+ path;
            if(expiredays){
                s += "; expires=" +exdate+"; ";
            }else{
                s += "; ";
            }
            // クッキーに保存
            document.cookie=s;
        };
    function getCookie(c_name){
        var st="";
        var ed="";
        if(document.cookie.length>0){
            // クッキーの値を取り出す
            st=document.cookie.indexOf(c_name + "=");
            if(st!=-1){
                st=st+c_name.length+1;
                ed=document.cookie.indexOf(";",st);
                if(ed==-1) ed=document.cookie.length;
                // 値をデコードして返す
                return unescape(document.cookie.substring(st,ed));
            }
        }
        return "";
    }
        setCookie('private',JSON.stringify($scope.user),7);
    };
}])
