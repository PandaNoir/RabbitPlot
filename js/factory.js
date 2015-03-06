angular.module(appName)
.factory('user',['_','$rootScope','$mdDialog','group','localStorageService',function(_,$rootScope,$mdDialog,group,localStorageService){//{{{
    if(localStorageService.get('private')){
        var user=angular.fromJson(localStorageService.get('private'));
        if(!user.id){
            user.id=uuid();
        }
        user.updated=true;
    }else{
        var user={
            following:[],
            'private':{
                event:[],
                habit:[],
                name:'プライベート'
            },
            permission:[],
            hiddenGroup:[],
            id:uuid()
        };
        $mdDialog.show(
            $mdDialog.alert().title('[重要]ユーザー情報を生成しました。')
            .content('これはあなたのIDです。大切なのでメモしておいてください。'+angular.toJson(user)+' これは設定画面の設定を保存からも見ることができます。')
            .ok('ok')
        );
    }
    user.isHiddenGroup=function(id){
        return _.indexOf(this.hiddenGroup,id,true)!==-1;
    };
    user.save=function(){
        $rootScope.$broadcast('updated');
        localStorageService.set('private',angular.toJson(this));
    };
    user.hasPermission=function(groupID){
        return groupID==='private'||_.indexOf(user.permission,groupID)!==-1;
    };
    user.save();
    return user;
}])//}}}
.run(['user','db',function(user,db){//{{{
    db.permission().then(function(mes){
        mes=mes.data;
        user.permission=mes;
    });
}])//}}}
.factory('eventForm',function(){//{{{
    return {
        name:'',
        year:(new Date()).getFullYear(),
        month:(new Date()).getMonth()+1,
        date:(new Date()).getDate(),
        type:'event',
        rule:''
    };
})//}}}
.factory('groupForm',function(){//{{{
    return {
        name:''
    };
})//}}}
.factory('group',['_','calendar',function(_,calendar){//{{{
    var holiday=_.clone(calendar.holiday);
    holiday.id=0;
    holiday.name='祝日';
    holiday.updated=true;
    var o=[holiday];
    return o;
}])//}}}
.run(['_','db','group','$rootScope','localStorageService',function(_,db,group,$rootScope,localStorageService){//{{{
    var o=_.clone(group)[0];
    if(localStorageService.get('group')){
        group.length=0;
        Array.prototype.push.apply(group,angular.fromJson(localStorageService.get('group')));
        group[0]=_.clone(o);
    }
    db.list().then(function(mes){
        mes=mes.data;
        for(var i=0,i2=mes.length;i<i2;i++){
            for(var key in mes[i]){
                mes[i][key]=angular.fromJson(mes[i][key]||'""');
            }
            mes[i].updated=true;
        }
        mes.sort(function(a,b){return a.id-b.id});
        group.length=0;
        for(var i=0,i2=mes.length;i<i2;i++){
            group[mes[i].id]=mes[i];
        }
        group[0]=_.clone(o);
        $rootScope.$broadcast('updated');
        localStorageService.set('group',angular.toJson(group));
        db.getNameList().then(function(mes){
            for(var i=0,i2=mes.data[0].length;i<i2;i++){
                if(group[i]){
                    continue;
                }
                group[i]={
                    name:angular.fromJson(mes.data[0][i]),
                    description:angular.fromJson(mes.data[1][i])
                };
                if(mes.data[2][i]){
                    group[i].parents=angular.fromJson(mes.data[2][i]);
                }
            }
            group[0]=_.clone(o);
            localStorageService.set('group',angular.toJson(group));
        });
    });
}])//}}}
.factory('calendar',['OVER_MONTH','MEMO_LIMIT','IS_SMART_PHONE','ATTRIBUTE','error',calendar])
.factory('eventCal',['_','group','user','calendar',function(_,group,user,calendar){//{{{
    var ECMemo=[];//eventCalendarMemo;
    var beforeGroups='';//非表示表示切り替えに対応するため
    var yearOfEC=-1,monthOfEC=-1;//ECMemoの年と月
    function eventCalendar(date){//{{{
        var events=[];
        var eventCalendar=[]//日付と対応させているイベントカレンダー.フォーマットはcalendar()とは違うから注意
        var groups=_.difference(user.following,user.hiddenGroup);
        if(calendar.year!==yearOfEC||calendar.month!==monthOfEC){
            yearOfEC=calendar.year;
            monthOfEC=calendar.month;
            ECMemo=[];
        }else{
            if(groups.join(',')===beforeGroups && !user.updated && _.every(groups,function(item){return item.updated===false;})){
                //条件が変わっていないからそのまま使用
                return ECMemo[date]||[];
            }
            //どれか1つでもupdateされたものがあったらメモを使用しない
            ECMemo=[];
            beforeGroups=groups.join(',');
        }
        for(var i=0,i2=groups.length;i<i2;i++){
            events[events.length]=getEvents(groups[i],calendar.year,calendar.month);
        }
        if(!user.isHiddenGroup(-1)){
            //privateがhiddenに設定されていない
            events[events.length]=getEvents('private',calendar.year,calendar.month);
        }
        //events=[{year,month,date,name,id,group,type}, ..];
        for(var i=0,i2=events.length;i<i2;i++){
            for(var j=0,j2=events[i].length;j<j2;j++){
                var d=events[i][j].date;
                if(!eventCalendar[d]) eventCalendar[d]=[];
                //eventsをeventCalendarへ変換
                //eventCalendar=[['id:group:type', ...], ...];
                eventCalendar[d][eventCalendar[d].length]=events[i][j].id+':'+events[i][j].group+':'+events[i][j].type;
            }
        }
        ECMemo=_.clone(eventCalendar);
        beforeGroups=groups.join(',');
        return ECMemo[date]||[];
    };//}}}
    function getEvents(groupID,y,m){//{{{
        //habitとeventと合わせて、それを配列にして返す
        //y=year,m=month
        if(groupID!=='private' && !group[groupID]) return [];//まだデータベースからデータ取得できてない場合などに返す。これがないとAngularJSがエラーぶん投げる。当然ですね
        var res=[];
        var parentRes=[];
        if(groupID==='private'){
            _.each(user.following,function(fg){
                //fg=followingGroup
                parentRes=parentRes.concat(getEvents(fg,y,m));
            });
            res = res.concat(getEventList(user['private'].event,y,m,'private'));
            parentRes = parentRes.concat(res);
            res = res.concat(getHabitList(user['private'].habit,y,m,'private',parentRes));
            user.updated=false;
        }else{
            if(group[groupID].parents){
                _.each(group[groupID].parents,function(parent){
                    parentRes = parentRes.concat(getEvents(parent,y,m));
                });
            }
            res=res.concat(getEventList(group[groupID].event,y,m,groupID));
            parentRes = parentRes.concat(res);
            res = res.concat(getHabitList(group[groupID].habit,y,m,groupID,parentRes));
            group[groupID].updated=false;
        }
        if(groupID!==0) return res;
        //振替休日の選定
        if(!(y<1973||y==1973&&m<4)){
            //振替休日が制定されたあと
            var holidays=_.map(res,function(n){return n.date});
            var sundayHoliday=_.intersection(holidays,calendar.execSelectors('day:sun',y,m,[]));//日曜かつ祝日
            res.concat(_.map(sundayHoliday,function(n){
                var k=1;
                while(_.indexOf(holidays,n+k,true)!==-1){
                    //振替先が祝日
                    k+=1;
                }
                return {year:y,month:m,date:n+k,name:'[mes]振替休日',group:0,id:-1,type:'habit'};
            }));
            res.sort();
        }
        if(y>=1985||y==1985&&m==12&&d>=27){
            //国民の休日が制定されたあと
            var holidays=_.map(res,function(n){return n.date});
            var beforeDay=0;
            _.each(holidays,function(n){
                if(n-beforeDay===2){
                    res.push({year:y,month:m,date:n-1,name:'[mes]国民の休日',group:0,id:-2,type:'habit'});
                }
                beforeDay=n;
            });
            res.sort();
        }
        return res;
    };//}}}
    function getEventList(arr,y,m,groupID){//{{{
        //その月のイベントを取得(ここでいうイベントはhabitとeventのeventであってまとめたものを取得するのは下のgetEvents())
        //y=year,m=month
        var res=[];
        if(!arr) return res;
        for(var i=0,j=arr.length;i<j;i++){
            if(arr[i].year!==y || arr[i].month!==m){
                continue;
            }
            var tmpRes=_.clone(arr[i]);
            tmpRes.group=groupID;
            tmpRes.type='event';
            tmpRes.id=i;
            res[res.length]=tmpRes;
            tmpRes=null;
        }
        return res;
    }//}}}
    function getHabitList(arr,year,month,groupID,eventListRes){//{{{
        //arrは習慣の一覧,year,monthはそのまま
        //毎週何曜日、毎月20日みたいな処理をする
        //返り値は指定された月の具体的な日付がくっついた配列
        if(!arr) return [];
        var res=[];
        for(var i=0,i2=arr.length;i<i2;i++){
            arr[i].type='habit';
            arr[i].group=groupID;
            var tmpRes=calendar.execSelectors(arr[i].selector,year,month,eventListRes);
            _.each(tmpRes,function(item,index){
                tmpRes[index]={year:year,month:month,date:item,name:arr[i].name,group:groupID,id:i,type:'habit'};
            });
            res=res.concat(tmpRes);
        }
        return res;
    }//}}}
    return {
        eventCalendar:eventCalendar
    };
}])//}}}
.factory('eventListToEdit',function(){//{{{
    return {
        id:''
    };
})//}}}
.factory('error',['$mdToast',function($mdToast){//{{{
    var ErrorConstructor = ErrorConstructor || Error;
    return function(mes){
        $mdToast.show($mdToast.simple().content(mes).position('top right').hideDelay(3000));
        return new ErrorConstructor(mes);
    };
}])//}}}
.factory('mode',['_','eventForm','$mdSidenav','user','group',function(_,eventForm,$mdSidenav,user,group){//{{{
    function switchToEdit(){//{{{
        //event= eventのid:groupのid:eventのtype(event or habit)
        if(arguments.length===1||arguments.length===2&&arguments[1]===true){
            //switchToEdit(event [,isEdit])の場合
            var event=arguments[0].split(':');// event=[eventID,groupID,eventType];
            eventForm.mode=arguments.length===1?'edit':'add';

            _.extend(eventForm,{
                type: event[2],
                id: arguments.length===1? toInt(event[0]): 0
            });

            if(event[1]!=='private') eventForm.selectedGroup=toInt(event[1]);
            else eventForm.selectedGroup='private';//event[1]==='private'

            var targetGroup= event[1]==='private' ? user['private'] : group[event[1]];
            if(event[2]==='event'){
                targetGroup=targetGroup.event[event[0]];

                _.map(['year','month','date','name'],function(key){
                    eventForm[key]=targetGroup[key];
                });

                eventForm.month+=1;
                targetGroup=null;
            }else if(event[2]==='habit'){
                targetGroup=targetGroup.habit[event[0]];

                eventForm.rule=targetGroup.selector;
                eventForm.name=targetGroup.name;

                targetGroup=null;
            }

            eventForm.isMessage=(eventForm.name.slice(0,'[mes]'.length)==='[mes]');
            if(eventForm.isMessage){
                eventForm.name=eventForm.name.slice('[mes]'.length);
            }

        }else if(arguments.length===3){
            //switchToEdit(year,month,date)の場合
            //この場合は、新規でyear/month/dateにイベントを作成する
            _.extend(eventForm,{mode: 'add', type: 'event', rule: '', id: 0, name: '', year: arguments[0], month: arguments[1]+1, date: arguments[2]});
        }
        this.editsEvent=true;
        $mdSidenav('left').close();
    }//}}}
    return {
        editsEvent:false,
        editsGroup:false,
        showsEventList:false,
        switchToEdit:switchToEdit
    };
}])//}}}
.factory('db',['_','user','$http','$rootScope','$log',function(_,user,$http,$rootScope,$log){//{{{
    var database='http://www40.atpages.jp/chatblanc/genderC/database.php';
    function post(group,id,type){
        //データベースにpostする汎用メソッド
        //typeにupdateとかinsertとか指定することで動作変えている
        //下のlist()及びgetNameList()はこれを使用していないため注意
        var o=_.clone(group);
        o.id=id;
        o.permission=o.permission||[user.id];
        o.description=o.description||'';
        o.parents=o.parents||'';
        delete o.updated;
        for(var key in o) o[key]=toOneByte(angular.toJson(o[key]));
        o.type=type;
        $rootScope.$broadcast('updated');
        return $http.post(database,o).success(function(mes){
            $log.log('updated');
            $log.log(mes);
        }).error(function(mes){
            $log.log(mes);
        });
    };
    function list(){
        //データベースから指定idのデータを取得する
        return $http.post(database,{type:'list',groupID:user.following.join(',')}).success(function(data){return data}).error(function(mes){
            $log.log(mes);
        });
    };
    function getNameList(){
        //データベースからグループ一覧を取得する
        return $http.post(database,{type:'namelist'}).success(function(data){return data});
    };
    function permission(list){
        return $http.post(database,{type:'permission',groupID:user.following.join(','),userID:user.id}).success(function(data){return data}).error(function(mes){
            $log.log(mes);
        });
    };
    return {
        post:post,
        list:list,
        getNameList:getNameList,
        permission:permission
    };
}])//}}}
.run(['calendar','$timeout',function(calendar,$timeout){//{{{
    var tomorrow=new Date();
    tomorrow.setDate(tomorrow.getDate()+1);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    function setTomorrow(){
        var tomorrow=new Date();
        tomorrow.setDate(tomorrow.getDate()+1);
        tomorrow.setHours(0);
        tomorrow.setMinutes(0);
        tomorrow.setSeconds(0);
        tomorrow.setMilliseconds(0);
        var today=new Date();
        calendar.today.year=today.getFullYear();
        calendar.today.month=today.getMonth();
        calendar.today.date=today.getDate();
        $timeout(setTomorrow,tomorrow-(new Date()));
    }
    $timeout(setTomorrow,tomorrow-(new Date()));
}])//}}}
;//factoryとか追加するときに便利なようにここにセミコロン
