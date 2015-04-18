angular.module(appName)
.factory('user',function(_,$rootScope,group,localStorageService){//{{{
    var user={
        following:[],
        'private':{
            event:[],
            habit:[],
            name:'プライベート'
        },
        permission:[],
        hiddenGroup:[],
        isLoggedIn:false,
        updated:true,
        id:uuid()
    };
    user.isHiddenGroup=function(groupID){
        return _.indexOf(this.hiddenGroup,groupID,true)!==-1;
    };
    user.save=function(){
        var copiedUser=_.clone(user);
        delete copiedUser.permission;
        delete copiedUser.updated;

        $rootScope.$broadcast('updated');
        localStorageService.set('private',angular.toJson(copiedUser));
    };
    user.hasPermission=function(groupID){
        return groupID==='private'||_.indexOf(user.permission,groupID)!==-1;
    };
    user.follow=function(groupID){
        user.following[user.following.length]=toInt(groupID);
        user.following.sort(sortByNumber);
        user.save();
        db.updateUser();
    };
    return user;
})//}}}
.run(function(user,db){//{{{
    db.permission().then(function(mes){
        user.permission=mes.data;
    });
})//}}}
.run(function(user,mode,localStorageService,db,_,$mdToast,$mdDialog,$location){//{{{
    if($location.path()!=='/RabbitPlot/') return;

    if(localStorageService.get('private')){
        _.extend(user,angular.fromJson(localStorageService.get('private')));
        if(user.isLoggedIn){
            db.login({'username':localStorageService.get('username'),'password':localStorageService.get('password')}).then(function(mes){
                mes=mes.data;
                if(mes==='failed'){
                    $mdToast.show($mdToast.simple().content('ログインに失敗しました').position('top right').hideDelay(3000));
                    return;
                }
                $mdToast.show($mdToast.simple().content('ログインに成功しました').position('top right').hideDelay(3000));
                for(var key in mes){
                    user[key]=angular.fromJson(mes[key]);
                }
                user.isLoggedIn=true;
            });
        }
    }else{
        $mdDialog.show(
            $mdDialog.confirm()
            .title('データがありません')
            .content('ログインしますか?ログインせずに使いますか?それともユーザー登録しますか?')
            .ok('ログインする')
            .cancel('ログインしない/登録する')
        ).then(mode.switchToLogin,
        function() {
            //ログインしない
            $mdDialog.show(
                $mdDialog.confirm()
                .content('ユーザー登録しますか?')
                .ok('する')
                .cancel('しない')
            ).then(function() {
                //ユーザー登録する
                $location.path('/RabbitPlot/signup');
            }, function() {
                //ユーザー登録しない
                $mdDialog.show(
                    $mdDialog.alert().title('[重要]ユーザー情報を生成しました。')
                    .content('これはあなたのIDです。大切なのでメモしておいてください。'+angular.toJson(user)+' これは設定画面の設定を保存からも見ることができます。')
                    .ok('ok')
                );
            });
        });
    }
    user.save();
})//}}}
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
.factory('group',function(_,calendar){//{{{
    var holiday=_.clone(calendar.holiday);
    holiday.id=0;
    holiday.name='祝日';
    holiday.updated=true;
    var o=[holiday];
    return o;
})//}}}
.run(function(_,db,group,$rootScope,localStorageService){//{{{
    var o=_.clone(group)[0];
    if(localStorageService.get('group')){
        group.length=0;
        Array.prototype.push.apply(group,angular.fromJson(localStorageService.get('group')));
        group[0]=_.clone(o);
    }
    db.list();
})//}}}
.factory('calendar',['OVER_MONTH','MEMO_LIMIT','IS_SMART_PHONE','ATTRIBUTE','error',_calendar_])
.factory('eventCal',function(_,group,user,calendar){//{{{
    var ECMemo=[];//eventCalendarMemo;
    var beforeGroups='';//非表示表示切り替えに対応するため
    var yearOfEC=-1,monthOfEC=-1;//ECMemoの年と月
    function eventCalendar(date){//{{{
        var events=[];
        var res=[]//日付と対応させているイベントカレンダー.フォーマットはcalendar()とは違うから注意
        var groups=_.difference(user.following,user.hiddenGroup);
        if(calendar.year!==yearOfEC||calendar.month!==monthOfEC){
            yearOfEC=calendar.year;
            monthOfEC=calendar.month;
            ECMemo=[];
        }else{
            if(groups.join(',')===beforeGroups && !user.updated && _.every(groups,function(id){return !group[id]||group[id].updated===false;})){
                //条件が変わっていないからそのまま使用
                return ECMemo[date]||[];
            }
            //どれか1つでもupdateされたものがあったらメモを使用しない
            ECMemo=[];
            beforeGroups=groups.join(',');
        }
        for(var i=0,_i=groups.length;i<_i;i++){
            events[events.length]=getEvents(groups[i],calendar.year,calendar.month);
        }
        if(!user.isHiddenGroup(-1)){
            //privateがhiddenに設定されていない
            events[events.length]=getEvents('private',calendar.year,calendar.month);
        }
        //events=[{year,month,date,name,id,group,type}, ..];
        for(var i=0,_i=events.length;i<_i;i++){
            for(var j=0,_j=events[i].length;j<_j;j++){
                var d=events[i][j].date;
                if(!res[d]) res[d]=[];
                //eventsをeventCalendarへ変換
                //res=[['id:group:type', ...], ...];
                res[d][res[d].length]=events[i][j].id+':'+events[i][j].group+':'+events[i][j].type;
            }
        }
        ECMemo=_.clone(res);
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
        _.each(calendar.getSubstituteHolidays(y,m),function(date){
            res.push({year:y,month:m,date:date,name:'[mes]振替休日',group:0,id:-1,type:'habit'});
        });
        _.each(calendar.getNationalHolidays(y,m),function(date){
            res.push({year:y,month:m,date:date,name:'[mes]国民の休日',group:0,id:-2,type:'habit'});
        });
        return res;
    };//}}}
    function getEventList(arr,y,m,groupID){//{{{
        //その月のイベントを取得(ここでいうイベントはhabitとeventのeventであってまとめたものを取得するのは下のgetEvents())
        //y=year,m=month
        var res=[];
        if(!arr) return res;
        for(var i=0,_i=arr.length;i<_i;i++){
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
        for(var i=0,_i=arr.length;i<_i;i++){
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
        eventCalendar:eventCalendar,
        getEvents:getEvents
    };
})//}}}
.factory('eventListToEdit',function(){//{{{
    return {
        id:''
    };
})//}}}
.factory('error',function($mdToast){//{{{
    var ErrorConstructor = ErrorConstructor || Error;
    return function(mes){
        $mdToast.show($mdToast.simple().content(mes).position('top right').hideDelay(3000));
        return new ErrorConstructor(mes);
    };
})//}}}
.factory('mode',function(_,eventForm,$mdSidenav,user,group){//{{{
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
        switchToEdit:switchToEdit,
        switchToLogin:function(){
            this.login=true;
            $mdSidenav('left').close();
        }
    };
})//}}}
.factory('db',function(_,user,group,$rootScope,$http,$log,localStorageService){//{{{
    var database='http://www40.atpages.jp/chatblanc/genderC/';
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
        return $http.post(database+'database.php',o).success(function(mes){
            $log.log('updated');
            $log.log(mes);
        }).error(error);
    };
    function list(list){
        var o=_.clone(group)[0];
        list=list||user.following.join(',');
        //データベースから指定idのデータを取得する
        return $http.post(database+'database.php',{type:'list',groupID:list}).success(success).error(error).then(function(mes){
        mes=mes.data;
        for(var i=0,_i=mes.length;i<_i;i++){
            for(var key in mes[i]){
                mes[i][key]=angular.fromJson(mes[i][key]||'""');
            }
            mes[i].updated=true;
        }
        mes.sort(function(a,b){return a.id-b.id});
        group.length=0;
        for(var i=0,_i=mes.length;i<_i;i++){
            group[mes[i].id]=mes[i];
        }
        group[0]=_.clone(o);
        $rootScope.$broadcast('updated');
        localStorageService.set('group',angular.toJson(group));
        getNameList().then(function(mes){
            for(var i=0,_i=mes.data[0].length;i<_i;i++){
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
    };
    function getNameList(){
        //データベースからグループ一覧を取得する
        return $http.post(database+'database.php',{type:'namelist'}).success(success).error(error);
    };
    function permission(list){
        return $http.post(database+'database.php',{type:'permission',groupID:user.following.join(','),userID:user.id}).success(success).error(error);
    };
    function login(opt){
        return $http.post(database+'login.php',opt).success(success).error(error);
    };
    function updateUser(){
        var o=_.clone(user);
        delete o.permission;
        delete o.updated;
        delete o.isLoggedIn;
        delete o.isHiddenGroup;
        delete o.save;
        delete o.hasPermission;
        delete o.follow;
        o.username=localStorageService.get('username');
        for(var key in o) o[key]=toOneByte(angular.toJson(o[key]));
        o.type='updateUser';
        return $http.post(database+'database.php',o).success(success).error(error);
    };
    function success(data){
        return data;
    };
    function error(mes){
        $log.log(mes);
    };
    return {
        post:post,
        list:list,
        login:login,
        updateUser:updateUser,
        getNameList:getNameList,
        permission:permission
    };
})//}}}
.run(function(calendar,$timeout){//{{{
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
})//}}}
.config(function($locationProvider){//{{{
    $locationProvider.html5Mode({
        enabled:true,
        requireBase:false
    });
})
.run(function(user,group,$location){
    var getParams=$location.search();
    if(angular.isDefined(getParams.id)){
        var groupID=toInt(getParams.id);
        if(_.indexOf(user.following,groupID,true)===-1){
            if(angular.isUndefined(group[groupID])){
                group[groupID]={
                    name:'',
                    description:'',
                    event:[],
                    habit:[],
                    updated:false,
                    id:groupID
                };
            }
            user.follow(getParams.id);
            user.save();
            db.updateUser();
        }
    }
})//}}}
;//factoryとか追加するときに便利なようにここにセミコロン
