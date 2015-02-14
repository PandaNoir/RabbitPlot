angular.module(appName)
.controller('eventEditorCtrl',['$scope','group','user','eventForm','calendar','db','mode','$mdToast',function($scope,group,user,eventForm,calendar,db,mode,$mdToast){
    var today=new Date();
    var faseHistory=[];
    var rule=[];
    $scope.mode=mode;
    $scope.group=group;
    $scope.user=user;
    $scope.eventForm=eventForm;
    $scope.calendar=calendar;
    $scope.ruleWriterFase='';
    $scope.ruleInput='';
    $scope.eventEditor={
        rules:'',
        selectedGroup:''
    };
    $scope.ruleGuide={
        day:[
            [':sun','日曜日'],[':mon','月曜日'],[':tue','火曜日'],[':wed','水曜日'],[':thu','木曜日'],[':fri','金曜日'],[':sat','土曜日']
        ],
        month:[
            [':1','1月'],[':2','2月'],[':3','3月'],[':4','4月'],[':5','5月'],[':6','6月'],
            [':7','7月'],[':8','8月'],[':9','9月'],[':10','10月'],[':11','11月'],[':12','12月']
        ],
        selector:[
            ['month','何月'],['date','何日'],['day','何曜日'],['not','除く'],['range','範囲']
        ]
    };
    $scope.addEvent=function(){//{{{
        var type=eventForm.type;
        if(eventForm.selectedGroup==='private'){
            saveEvent($scope.user['private'][type].length, eventForm.selectedGroup);
        }else if(eventForm.selectedGroup!==null){
            saveEvent($scope.group[eventForm.selectedGroup][type].length, eventForm.selectedGroup);
        }
    };//}}}
    $scope.editEvent=function(){//{{{
        console.log(eventForm);
        saveEvent(eventForm.id,eventForm.selectedGroup);
    };//}}}
    function saveEvent(eventID,groupID){//{{{
        //編集したイベントを保存する
        var type=eventForm.type;
        var isInvalid= eventForm.name==='' ||//nameは必須
            type==='event' && (eventForm.year===null || eventForm.month===null || eventForm.date===null) ||//eventの時はyear,month,dateすべて必須
            type==='habit' && (eventForm.rule==='') ||//habitの時はrule必須
            eventForm.selectedGroup===undefined || eventForm.selectedGroup===null;//selectedGroupも必須
        if(isInvalid){
            $mdToast.show($mdToast.simple().content('入力が不適切です').position('top right').hideDelay(3000));
            //selectedGroupは変更できない仕様だから判定いらない
            return;
        }
        if(type==='event'){
            var testDate=new Date(eventForm.year,eventForm.month-1,eventForm.date);
            isInvalid= testDate.getFullYear()!==toInt(eventForm.year)||
                testDate.getMonth()!==toInt(eventForm.month)-1||
                testDate.getDate()!==toInt(eventForm.date);
            //2014/12/32のような時の排除と、null/undefined/'hoge'のようなでたらめな日付を排除するためにこうなっている
            if(isInvalid){
                //正常範囲に入っていない
                return;
            }
        }
        if(groupID==='private'){
            if(!user['private'][type][eventID]){
                user['private'][type][eventID]={};//eventIDがない==新たに追加の時対策
            }
            if(type==='event'){
                user['private'][type][eventID].year=eventForm.year;
                user['private'][type][eventID].month=eventForm.month-1;
                user['private'][type][eventID].date=eventForm.date;
                user['private'][type][eventID].name=eventForm.name;
                user.updated=true;
            }else if(type==='habit'){
                user['private'][type][eventID].selector=eventForm.rule;
                user['private'][type][eventID].name=eventForm.name;
                user.updated=true;
            }
        }else{
            if(!group[eventForm.selectedGroup][type][eventID]){
                group[eventForm.selectedGroup][type][eventID]={};
            }
            if(type==='event'){
                group[eventForm.selectedGroup][type][eventID].year=eventForm.year;
                group[eventForm.selectedGroup][type][eventID].month=eventForm.month-1;
                group[eventForm.selectedGroup][type][eventID].date=eventForm.date;
                group[eventForm.selectedGroup][type][eventID].name=eventForm.name;
                group[eventForm.selectedGroup].updated=true;
            }else if(type==='habit'){
                group[eventForm.selectedGroup][type][eventID].selector=eventForm.rule;
                group[eventForm.selectedGroup][type][eventID].name=eventForm.name;
                group[eventForm.selectedGroup].updated=true;
            }
        }
        $mdToast.show($mdToast.simple().content('イベントを追加しました').position('top right').hideDelay(3000));
        mode.editsEventForm=false;
        save(eventForm.selectedGroup);
    };//}}}
    $scope.cancel=function(){//{{{
        mode.editsEventForm=false;
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
