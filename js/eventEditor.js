angular.module(appName)
.controller('eventEditorCtrl',['$scope','group','user','eventForm','calF','db','$mdToast',function($scope,group,user,eventForm,calF,db,$mdToast){
    var today=new Date();
    var faseHistory=[];
    var rule=[];
    $scope.group=group;
    $scope.user=user;
    $scope.eventForm=eventForm;
    $scope.calF=calF;
    $scope.ruleWriterFase='';
    $scope.ruleInput='';
    $scope.eventEditor={
        rules:'',
        selectedGroup:''
    }
    $scope.addEvent=function(){
        //イベントの追加
        var type=$scope.eventForm.type;
        if(eventForm.name===''||eventForm.selectedGroup===undefined||eventForm.selectedGroup===null){
            return;
        }
        var testDate=new Date(eventForm.year,eventForm.month-1,eventForm.date);
        if(testDate.getFullYear()!==parseInt(eventForm.year,10)||testDate.getMonth()!==parseInt(eventForm.month,10)-1||testDate.getDate()!==parseInt(eventForm.date,10)){
            //正常範囲に入っていない
            return;
        }

        if(type=='event'){
            var target={
                year:eventForm.year,
                month:eventForm.month-1,//!!important
                date:eventForm.date,
                name:eventForm.name
            };
        }else if(type=='habit'){
            var target={
                selector:eventForm.rule,
                name:eventForm.name
            };
        }

        if(eventForm.selectedGroup==='private'){
            $scope.user['private'][type][$scope.user['private'][type].length]=target;
            $scope.user.updated=true;
        }else if(eventForm.selectedGroup!==null){
            $scope.group[eventForm.selectedGroup][type][$scope.group[eventForm.selectedGroup][type].length]=target;
            $scope.group[eventForm.selectedGroup].updated=true;
        }

        $mdToast.show($mdToast.simple().content('イベントを追加しました').position('top right'));

        eventForm.isEditMode=false;
        save(eventForm.selectedGroup);
    };
    $scope.saveEvent=function(){
        //編集したイベントを保存する
        var type=eventForm.type;
        if(eventForm.year===null||eventForm.month===null||eventForm.date===null||eventForm.name===''){
            //selectedGroupは変更できない仕様だから判定いらない
            return;
        }
        var testDate=new Date(eventForm.year,eventForm.month-1,eventForm.date);
        if(testDate.getFullYear()!==parseInt(eventForm.year,10)||testDate.getMonth()!==parseInt(eventForm.month,10)-1||testDate.getDate()!==parseInt(eventForm.date,10)){
            //正常範囲に入っていない
            return;
        }
        if(eventForm.selectedGroup==='private'){
            var group=$scope.user['private'][type][eventForm.id];
        }else if(eventForm.selectedGroup!==null){
            var group=$scope.group[eventForm.selectedGroup][type][eventForm.id];
            $scope.group[eventForm.selectedGroup].updated=true;
        }
        if(type=='event'){
            group.year=eventForm.year;
            group.month=eventForm.month-1;
            group.date=eventForm.date;
            group.name=eventForm.name;
        }else if(type=='habit'){
            group.selector=eventForm.rule;
            group.name=eventForm.name;
        }
        eventForm.isEditMode=false;
        save(eventForm.selectedGroup);
    };
    $scope.cancel=function(){//{{{
        eventForm.isEditMode=false;
    };
    $scope.goFase=function(fase,opt){
        faseHistory[faseHistory.length]=$scope.ruleWriterFase;
        rule[rule.length]=opt||fase;
        $scope.ruleWriterFase=fase;
        eventForm.rule=rule.join('');
    };
    $scope.cancelFase=function(){
        $scope.ruleWriterFase=faseHistory.pop();
        rule.pop();
        eventForm.rule=rule.join('');
    };
    $scope.finishWritingRule=function(){
        $scope.ruleWriterFase='';
        faseHistory=[];
        eventForm.rule=rule.join('');
        rule=[];
    };
    $scope.startWritingRule=function(){
        $scope.ruleWriterFase='selector';
        faseHistory=[];
        rule=[];
    };//}}}
    function save(groupID){
        if(groupID==='private'){
            user.save();
        }else{
            db.post($scope.group[groupID],groupID,'update');
        }
    };
}]);
