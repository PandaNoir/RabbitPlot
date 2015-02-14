angular.module(appName)
.factory('_',function(){//{{{
    return _;
})//}}}
.factory('user',['_','$rootScope','$mdDialog','group',function(_,$rootScope,$mdDialog,group){//{{{
    if(localStorage&&angular.fromJson(localStorage.getItem('private'))){
        var user=angular.fromJson(localStorage.getItem('private'));
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
            hiddenGroup:[],
            id:uuid()
        };
        $mdDialog.show($mdDialog.alert().title('[重要]ユーザー情報を生成しました。').content('これはあなたのパソコンにのみ保存されるもので、データベースに登録されたり、どこかへ送られたりしません。ただし、なにかの拍子にデータが消去されてidが変更されてしまうとグループの権限が消えてしまいます。だから、次の文字列を保存しておいてください。'+angular.toJson(user)).ok('ok'));
    }
    user.isHiddenGroup=function(id){
        return _.indexOf(this.hiddenGroup,id,true)!==-1;
    };
    user.save=function(){
        $rootScope.$broadcast('updated');
        localStorage.setItem('private',angular.toJson(this));
    };
    user.hasPermission=function(groupID){
        return groupID==='private'||_.indexOf(group[groupID].permission,user.id)!==-1;
    };
    user.save();
    return user;
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
.factory('group',['$http',function($http){//{{{
    var o=[{//{{{
        id:0,
        event:[
            {name:'[mes]十五夜',year:2000,month:8,date:12},{name:'[mes]十五夜',year:2001,month:9,date:1},
            {name:'[mes]十五夜',year:2002,month:8,date:21},{name:'[mes]十五夜',year:2003,month:8,date:11},
            {name:'[mes]十五夜',year:2004,month:8,date:28},{name:'[mes]十五夜',year:2005,month:8,date:18},
            {name:'[mes]十五夜',year:2006,month:9,date:6},{name:'[mes]十五夜',year:2007,month:8,date:25},
            {name:'[mes]十五夜',year:2008,month:8,date:14},{name:'[mes]十五夜',year:2009,month:9,date:3},
            {name:'[mes]十五夜',year:2010,month:8,date:22},{name:'[mes]十五夜',year:2011,month:8,date:12},
            {name:'[mes]十五夜',year:2012,month:8,date:30},{name:'[mes]十五夜',year:2013,month:8,date:19},
            {name:'[mes]十五夜',year:2014,month:8,date:8},{name:'[mes]十五夜',year:2015,month:8,date:27},
            {name:'[mes]十五夜',year:2016,month:8,date:15}
        ],
        habit:[
            {name:'[mes]元旦',selector:'month:1 date:1'},{name:'[mes]成人の日',selector:'month:1 day:2nd-mon'},
            {name:'[mes]昭和の日',selector:'month:4 date:29'},{name:'[mes]建国記念日',selector:'month:2 date:11'},
            {name:'[mes]憲法記念日',selector:'month:5 date:3'},{name:'[mes]みどりの日',selector:'month:5 date:4'},
            {name:'[mes]こどもの日',selector:'month:5 date:5'},{name:'[mes]海の日',selector:'month:7 day:3rd-mon'},
            {name:'[mes]敬老の日',selector:'month:9 day:3rd-mon'},{name:'[mes]体育の日',selector:'month:10 day:2nd-mon'},
            {name:'[mes]文化の日',selector:'month:11 date:3'},{name:'[mes]勤労感謝の日',selector:'month:11 date:23'},
            {name:'[mes]天皇誕生日',selector:'month:12 date:23'}
        ],
        name:'祝日',
        updated:true
    }];//}}}
    var shuubun={name:'[mes]秋分の日',month:8};
    var shuubunDates=[23,23,23,23,23,23,23,23,23,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23]
    _.each(shuubunDates,function(date,year){
        o.event[o.event.length]=_.extend(_.clone(shuubun),{year:2000+year,date:date});
    });

    var shunbun={name:'[mes]春分の日',month:2};
    var shunbunDates=[20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,20,21,20,20,20]//2000年からのもの
    _.each(shunbunDates,function(date,year){
        o.event[o.event.length]=_.extend(_.clone(shunbun),{year:2000+year,date:date});
    });
    return o;
}])//}}}
.factory('calF',function(){//{{{
    var today=new Date();
    var memo=[];
    function calendar(year,month){
        //ここでのmonthはnew Dateを使用するため実際-1されている(=0月から始まっている)
        if(memo[year-MEMO_LIMIT]){
            if(memo[year-MEMO_LIMIT][month]){
                return memo[year-MEMO_LIMIT][month];
            }
        }else{
            memo[year-MEMO_LIMIT]=[];
        }
        var first=(new Date(year,month,1)).getDay();
        var last=[31,28,31,30,31,30,31,31,30,31,30,31][month];//来月の1日の1日前という算出方法をとる
        if(month===1 && isLeapYear(year)){
            //month===1は、monthが(実際の数字-1)月だから2月の判定部分となっている
            last=29;//うるう年だから
        }

        var res=[];//カレンダー用配列
        res.year=year;
        res.month=month;
        var i=0;
        var row=0;
        loop:while(true){
            res[row]=[];
            for(var j=1;j<=7;j++){
                //i*7+j-first.getDay()でその部分の日付
                if(row*7+j-first>0){
                    if(row*7+j-first<=last){
                        res[row][res[row].length]=row*7+j-first;//日付が今月の範囲に収まっている
                    }else{
                        res[row][res[row].length]=OVER_MONTH;//来月の範囲
                    }
                }else{
                    res[row][res[row].length]=0;//先月の範囲
                }
            }
            if(res[row][res[row].length-1]>=last) break;
            row++;
        }
        return memo[year-MEMO_LIMIT][month]=res;
    };
    var res={
        year:today.getFullYear(),
        month:today.getMonth(),
        date:today.getDate(),
        calendar:calendar,
        today:{
            year:today.getFullYear(),
            month:today.getMonth(),
            date:today.getDate()
        },
        selected:today.getDate(),
        selectedDay:function(){
            if(this.selected==null) return '';
            else return ['日','月','火','水','木','金','土'][new Date(this.year,this.month,this.selected).getDay()];
        },
        disableHoverEvent:isSmartPhone
    };
    return res;
})//}}}
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
    return {
        editsEventForm:false,
        editsGroupForm:false,
        showsEventList:false,
        switchToEdit:function(){//{{{
            //event= eventのid:groupのid:eventのtype(event or habit)
            var args=slice.call(arguments);
            if(args.length===1||args.length===2&&args[1]===true){//{{{
                //switchToEdit(event [,isEdit])の場合
                var event=args[0].split(':');// event=[eventID,groupID,eventType];
                eventForm.mode=args.length===1?'edit':'add';

                _.extend(eventForm,{
                    type: event[2],
                    id: args.length===1? event[0]: 0
                });

                if(event[1]!=='private'){
                    eventForm.selectedGroup=toInt(event[1]);
                }else{
                    eventForm.selectedGroup='private';//event[1]==='private'
                }
                if(event[2]==='event'){
                    _.map(['year','month','date','name'],function(key){
                        if(event[1]==='private'){
                            eventForm[key]=user['private'].event[event[0]][key];
                        }else{
                            eventForm[key]=group[event[1]].event[event[0]][key];
                        }
                    });
                    eventForm.month+=1;
                }else if(event[2]==='habit'){
                    if(event[1]==='private'){
                        eventForm.rule=user['private'].habit[event[0]].selector;
                        eventForm.name=user['private'].habit[event[0]].name;
                    }else{
                        eventForm.rule=group[event[1]].habit[event[0]].selector;
                        eventForm.name=group[event[1]].habit[event[0]].name;
                    }
                }//}}}
            }else if(args.length===3){//{{{
                //switchToEdit(year,month,date)の場合
                _.extend(eventForm,{mode: 'add', type: 'event', rule: '', id: 0, name: '', year: args[0], month: args[1]+1, date: args[2]});
            }//}}}
            this.editsEventForm=true;
            $mdSidenav('left').close();
        }//}}}
    };
}])//}}}
.factory('db',['_','group','user','$http','$rootScope','$log',function(_,group,user,$http,$rootScope,$log){//{{{
    var database='http://www40.atpages.jp/chatblanc/genderC/database.php';
    function post(group,id,type){
        //データベースにpostする汎用メソッド
        //typeにupdateとかinsertとか指定することで動作変えている
        //下のlist()及びgetNameList()はこれを使用していないため注意
        var o=_.clone(group);
        o.id=id;
        o.permission=o.permission||[];
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
    return {
        post:post,
        list:list,
        getNameList:getNameList
    };
}])//}}}
.factory('eventCal',['_','group','user','calF','error',function(_,group,user,calF,myError){//{{{
    function last(arr){return arr[arr.length-1];};
    var constDic=['OPERATOR','OTHERS','LPARENTHESES','RPARENTHESES'];
    var OPERATOR=0;
    var OTHERS=1;
    var LPARENTHESES=2;
    var RPARENTHESES=3;
    var GHLMemo=[];//getHabitListMemo;
    var SSMemo={};//splitSelectorMemo;
    var ECMemo=[];//eventCalendarMemo;
    var beforeGroups='';//非表示表示切り替えに対応するため
    var yearOfEC=-1,monthOfEC=-1;//ECMemoの年と月
    function eventCalendar(date){//{{{
        var events=[];
        var eventCalendar=[]//日付と対応させているイベントカレンダー.フォーマットはcalendar()とは違うから注意
        var groups=_.difference(user.following,user.hiddenGroup);
        if(calF.year!==yearOfEC||calF.month!==monthOfEC){
            yearOfEC=calF.year;
            monthOfEC=calF.month;
            ECMemo=[];
        }else{
            if(groups.join(',')!==beforeGroups||user.updated||_.any(groups,function(item){return item.updated===true;})){
                //どれか1つでもupdateされたものがあったらメモを使用しない
                ECMemo=[];
                beforeGroups=groups.join(',');
            }else{
                //条件が変わっていないからそのまま使用
                return ECMemo[date]||[];
            }
        }
        for(var i=0,i2=groups.length;i<i2;i++){
            events[events.length]=getEvents(groups[i],calF.year,calF.month);
        }
        if(!user.isHiddenGroup(-1)){
            //privateがhiddenに設定されていない
            events[events.length]=getEvents('private',calF.year,calF.month);
        }
        //events=[{year,month,date,name,id,group,type}, ..];
        for(var i=0,i2=events.length;i<i2;i++){
            for(var j=0,j2=events[i].length;j<j2;j++){
                var d=events[i][j].date;
                if(!eventCalendar[d]){
                    eventCalendar[d]=[];
                }
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
        var parent_res=[];
        if(groupID==='private'){
            _.each(user.following,function(fg){
                //fg=followingGroup
                parent_res=parent_res.concat(getEvents(fg,y,m));
            });
            res = res.concat(getEventList(user['private'].event,y,m,'private'));
            parent_res = parent_res.concat(res);
            res = res.concat(getHabitList(user['private'].habit,y,m,'private',parent_res));
            user.updated=false;
        }else{
            if(group[groupID].parents){
                _.each(group[groupID].parents,function(parent){
                    parent_res = parent_res.concat(getEvents(parent,y,m));
                });
            }
            res=res.concat(getEventList(group[groupID].event,y,m,groupID));
            parent_res = parent_res.concat(res);
            res = res.concat(getHabitList(group[groupID].habit,y,m,groupID,parent_res));
            group[groupID].updated=false;
        }
        if(groupID===0){
            //振替休日の選定
            var holidays=_.map(res,function(n){return n.date});
            var sundayHoliday=_.intersection(holidays,execSelectors('day:sun',y,m,[]));//日曜かつ祝日
            res.push.apply(res,_.map(sundayHoliday,function(n){
                var k=1;
                while(_.indexOf(holidays,n+k,true)!==-1){
                    //振替先が祝日
                    k+=1;
                }
                return {year:y,month:m,date:n+k,name:'[mes]振替休日',group:0,id:-1,type:'habit'};
            }));
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
            if(arr[i].year===y && arr[i].month===m){
                var tmp_res=_.clone(arr[i]);
                tmp_res.group=groupID;
                tmp_res.type='event';
                tmp_res.id=i;
                res[res.length]=tmp_res;
                tmp_res=null;
            }
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
            var tmp_res=execSelectors(arr[i].selector,year,month,eventListRes);
            _.each(tmp_res,function(item,index){
                tmp_res[index]={year:year,month:month,date:item,name:arr[i].name,group:groupID,id:i,type:'habit'};
            });
            res=res.concat(tmp_res);
        }
        return res;
    }//}}}
    function execSelectors(selectors,year,month,eventListRes){//{{{
        //セレクタを適応させて返す
        //year,monthはexecSelectorをメモ化するため
        //eventListResはnotで使用する配列。使用方法は、eventListResに入っているイベントに指定した名前と同じ名前が入っているところを除くという方法。つまり、not:name='燃えるごみの日'のようなときに使う。
        if(selectors===''){
            throw myError('cannot exec empty selector.');
        }
        selectors=shuntingYard(splitSelector(selectors));//文字列として渡されたselectorsを分解する
        eventListRes=eventListRes||[];
        var stack=[];
        _.each(selectors,function(nowSelector){//{{{
            if(nowSelector[1]===OTHERS){
                //セレクタの時
                stack[stack.length]=execSelector(nowSelector[0],year,month,eventListRes);
            }else if(nowSelector[1]===OPERATOR){
                //演算子の時
                if(nowSelector[0]==='&&') //セレクタのand処理部分
                    stack.push(_.intersection(stack.pop(),stack.pop()));//[重要]stack.pop()しているため、stack.pushを直してはいけない
                else if(nowSelector[0]==='||')
                    stack.push(_.union(stack.pop(),stack.pop()));//同上
                else{
                    throw myError('undefined operator '+nowSelector[0]);
                }
            }
        });//}}}
        function execSelector(nowSelector,year,month,eventListRes){//{{{
            var all_days=function(){
                return _.flatten(cal);
            };
            var meansPublicHoliday=function(s){
                //sが祝日を表しているか判定
                // publicHoliday || public-holiday || 祝日を想定
                s=s.toLowerCase();
                return s==='public-holiday'||s==='publicholiday'||s==='祝日';
            };
            var cal=calF.calendar(year,month);
            var dayDic={
                'sunday':0,'sun':0,'日曜日':0,
                'monday':1,'mon':1,'月曜日':1,
                'tuesday':2,'tue':2,'火曜日':2,
                'wednesday':3,'wed':3,'水曜日':3,
                'thursday':4,'thu':4,'木曜日':4,
                'friday':5,'fri':5,'金曜日':5,
                'saturday':6,'sat':6,'土曜日':6
            };
            var monthDic={
                'january':0,'jan':0,'睦月':0,
                'february':1,'feb':1,'如月':1,
                'march':2,'mar':2,'弥生':2,
                'april':3,'apr':3,'卯月':3,
                'may':4,'皐月':4,
                'june':5,'jun':5,'水無月':5,
                'july':6,'jul':6,'文月':6,
                'august':7,'aug':7,'葉月':7,
                'september':8,'sep':8, '長月':8,
                'october':9,'oct':9,'神無月':9,
                'november':10,'nov':10,'霜月':10,
                'december':11,'dec':11,'師走':11
            };
            //セレクタを実行する
            //注意:nowSelectorはnowSelector[0]が代入されている。この関数内ではnowSelector[0]しか使用されていなかったからだ。変更がある場合注意せよ
            if(GHLMemo[year-MEMO_LIMIT]){
                if(GHLMemo[year-MEMO_LIMIT][month]){
                    if(GHLMemo[year-MEMO_LIMIT][month][nowSelector]){
                        return _.clone(GHLMemo[year-MEMO_LIMIT][month][nowSelector]);
                    }
                }else GHLMemo[year-MEMO_LIMIT][month]={};
            }else{
                GHLMemo[year-MEMO_LIMIT]=[];
                GHLMemo[year-MEMO_LIMIT][month]={};
            }
            var key=nowSelector.split(':')[0];
            var val=nowSelector.split(':').slice(1).join(':');
            var tmp_res=[];
            var from_res=[],to_res=[];
            var from_reses=[];
            var from,to;
            var top4,top5,froms=[];//month/dateを処理するときにfromが2つでてくるから使用
            if(key==='not'){//{{{
                tmp_res=all_days();
                if(meansPublicHoliday(val)){
                    //祝日を除くフィルタ
                    var publicHolidays=getEvents(0,year,month);//getEvents(0,year,month);で祝日を取得できる
                    for(var i=0,j=publicHolidays.length;i<j;i++) publicHolidays[i]=publicHolidays[i].date;
                    tmp_res=_.difference(tmp_res,publicHolidays);
                    GHLMemo[year-MEMO_LIMIT][month][nowSelector]=_.clone(tmp_res);
                }else if(val.indexOf('year')===0||val.indexOf('month')===0||val.indexOf('date')===0||val.indexOf('day')===0){
                    //not:month=3 もしくは not:month:3
                    val=val.replace(/=/,':');//not:month=3をnot:month:3に揃える
                    tmp_res=_.difference(all_days(),execSelector(val,year,month));//month:3を実行してその結果を返す
                }else{
                    var nameKey=val.split('=')[0];//not:name='なんとか'みたいにしてるから
                    var nameVal=val.replace(/^.+?=/,'');//not:name='なんとか'みたいにしてるから
                    nameVal=nameVal.replace(/^"(.+)"$/,'$1');//name="なんとか"としていて valが"なんとか"になっている
                    _.each(eventListRes,function(resItem){
                        if(resItem[nameKey]===nameVal || resItem[nameKey].indexOf('[mes]')===0 && resItem[nameKey].slice(5)===nameVal){
                            //eventListResはnot:name="自主練なし"みたいな指定をしたいから使う
                            //多分反例が出てくるからそのうち直したい
                            tmp_res=_.without(tmp_res,resItem.date);
                        }
                    });
                }//}}}
            }else if(key==='is'){//{{{
                // is:public-holidayと言った感じ
                tmp_res=all_days();
                if(meansPublicHoliday(val)){
                    var publicHolidays=getEvents(0,year,month);//getEvents(0,year,month);で祝日を取得できる
                    for(var i=0,j=publicHolidays.length;i<j;i++){
                        publicHolidays[i]=publicHolidays[i].date;
                    }
                    tmp_res=_.intersection(tmp_res,publicHolidays);
                }else if(val==='last'){
                    //======================
                    var lastDay=[31,28,31,30,31,30,31,31,30,31,30,31][month];
                    if(isLeapYear(year)&&month===1){
                        lastDay=29;
                    }
                    return [lastDay];
                }else{
                    throw myError('unexpected a value of a yesterday selector.'+val);
                }
                GHLMemo[year-MEMO_LIMIT][month][nowSelector]=_.clone(tmp_res);//}}}
            }else if(key==='yesterday'){//{{{
                tmp_res=all_days();
                var key2=val.split(':')[0];
                var val2=val.split(':').slice(1).join(':');
                if(meansPublicHoliday(val)){
                    tmp_res=_.intersection(tmp_res,_.map(execSelector('is:'+val,year,month),function(n){return n+1;}));
                    // 12/32日みたいな日があるかもしれないからこういう処理
                    GHLMemo[year-MEMO_LIMIT][month][nowSelector]=_.clone(tmp_res);
                }else if(key2==='day'||key2==='date'){
                    //この辺は代用できる気がするし、いらないとおもう。一応つけるけど
                    tmp_res=_.intersection(all_days(),_.map(execSelector(val,year,month),function(n){return n+1;}));//month:3を実行してその結果を返す
                }else{
                    throw myError('unexpected a value of a yesterday selector.'+val);
                }
                GHLMemo[year-MEMO_LIMIT][month][nowSelector]=_.clone(tmp_res);
                //}}}
            }else if(key==='range'){//{{{
                if(val.slice(0,2)==='..'){//{{{
                    //..20xx/xx/xxという形式、つまりtoのみ指定
                    //必ずyear/month/date という形。year,month,dateはいづれも省略不可。month/dateとはとれない
                    if(val.slice(0,3)==='...'){
                        val=val.slice(3);//...をカット
                    }else{
                        val=val.slice(2);//..をカット
                    }
                    tmp_res=all_days();
                    // 2014/1/1 のように区切れている
                    //こっちはfromの設定とあまり関係ない
                    val=val.split('/');
                    val=_.map(val,toInt);
                    to=new Date(val[0],val[1]-1,val[2]);//これでtoが生成できる
                    if(to.getFullYear()<year || to.getFullYear()==year && to.getMonth()<month){
                        //明らかにto以降だからtmp_resは空
                        tmp_res=[];
                    }else if(to.getFullYear()==year&&to.getMonth()==month){
                        //toがかぶっているであろう時
                        tmp_res=all_days();
                        tmp_res=_.filter(tmp_res,function(n){
                            return n<=to.getDate();//toより前であることが条件
                        });
                    }else tmp_res=all_days();//}}}
                }else if(val.slice(-2)==='..'){//{{{
                    //20xx/xx/xx..という形式、つまりfromのみ指定
                    //必ずyear/month/date という形。year,month,dateはいづれも省略不可。month/dateとはとれない
                    if(val.slice(-3)==='...'){
                        val=val.slice(0,-3);//...をカット
                    }else{
                        val=val.slice(0,-2);//..をカット
                    }
                    val=val.split('/');
                    val=_.map(val,toInt);
                    from=new Date(val[0],val[1]-1,val[2]);
                    if(from.getFullYear()>year || from.getFullYear()==year && from.getMonth()>month){
                        //fromよりも明らかに以前
                        tmp_res=[];
                    }else if(from.getFullYear()==year&&from.getMonth()==month){
                        //fromの境目あたり。
                        tmp_res=all_days();
                        tmp_res=_.filter(tmp_res,function(n){
                            return n>=from.getDate();
                        });
                    }else tmp_res=all_days();//}}}
                }else if(val.indexOf('..')!==-1){//{{{
                    //20xx/xx/xx..20xx/xx/xxという形式
                    //month/date..month/dateも可能(例:12/29..1/3)
                    tmp_res=[];
                    val=val.split('...');//下で..の時の処理もしてる
                    if(val.length===1){
                        //...がなかった = ..があった
                        val=val[0].split('..');
                    }
                    from_res=[];
                    to_res=[];
                    from_reses=[];
                    from=val[0];
                    to=val[1];
                    top4=to.substr(to.length-4,4);//最後の4文字を取り出す。to:4weekのようになっているから
                    top5=to.substr(to.length-5,5);//最後の5文字を取り出す。to:4weeksのようになっているから
                    froms=[];//month/dateを処理するときにfromが2つでてくるから使用
                    //from処理
                    from=from.split('/');
                    from=_.map(from,toInt);
                    if(from.length===3){
                        // year/month/dateと記述されている
                        var from1=new Date(from[0],from[1]-1,from[2]);
                        froms.push(from1);
                    }else if(from.length===2){
                        // month/date yearがないから、すべてのyearに当てはまる。ただし、去年及び今年のもの以外は重要でない
                        var from1=new Date(year-1,from[0]-1,from[1]);
                        var from2=new Date(year,from[0]-1,from[1]);
                        froms.push(from1,from2);
                    }
                    _.each(froms,function(fromItem){
                        if(fromItem.getFullYear()>year||fromItem.getFullYear()==year&&fromItem.getMonth()>month){
                            //fromよりも明らかに以前
                            from_res=[];
                        }else if(fromItem.getFullYear()==year&&fromItem.getMonth()==month){
                            //fromの境目あたり。
                            from_res=all_days();
                            from_res=_.filter(from_res,function(n){
                                return n>=fromItem.getDate();
                            });
                        }else from_res=all_days();
                        from_reses.push(from_res);
                    });
                    froms=_.zip(froms,from_reses);// [[from,from_res],[from,from_res], ...]
                    _.each(froms,function(item){
                        var from=item[0];
                        var from_res=item[1];
                        var nowTo;
                        //to処理
                        if(top4==='date'||top4==='week'||top4==='year'||top5==='dates'||top5==='weeks'||top5==='years'){
                            var times;
                            if(top4==='date'||top4==='week'||top4==='year'){
                                times=toInt(to.substring(0,to.length-4));//to:4weekの4の部分
                            }else{
                                times=toInt(to.substring(0,to.length-5));//to:4weeksの4の部分
                            }
                            nowTo=new Date(from.getTime());
                            if(top4==='date'||top5==='dates')
                                nowTo.setDate(nowTo.getDate()+times);
                            else if(top4==='week'||top5==='weeks')
                                nowTo.setDate(nowTo.getDate()+7*times);
                            else if(top4==='year'||top5==='years')
                                nowTo.setFullYear(nowTo.getFullYear()+times);
                        }else{
                            nowTo=to.split('/');
                            nowTo=_.map(nowTo,toInt);
                            if(nowTo.length===3){
                                nowTo=new Date(nowTo[0],nowTo[1]-1,nowTo[2]);//これでnowToが生成できる
                            }else{
                                nowTo=new Date(from.getFullYear(),nowTo[0]-1,nowTo[1]);
                                if(nowTo.getTime()<from.getTime()){
                                    // 12/29..1/3というとき、fromよりも前にtoがきてしまっている
                                    nowTo.setFullYear(nowTo.getFullYear()+1);
                                }
                            }
                        }
                        if(nowTo.getFullYear()<year || nowTo.getFullYear()==year && nowTo.getMonth()<month){
                            //明らかにto以降だからto_resは空
                            to_res=[];
                        }else if(nowTo.getFullYear()==year && nowTo.getMonth()==month){
                            //toがかぶっているであろう時
                            to_res=all_days();
                            to_res=_.filter(to_res,function(n){
                                return n<=nowTo.getDate();//toより前であることが条件
                            });
                        }else to_res=all_days();
                        if(!_.isEmpty(_.intersection(from_res,to_res))){
                            tmp_res=_.intersection(from_res,to_res);
                        }
                    });//}}}
                }else{//{{{
                    throw myError('invalid selector "'+key+':'+val+'" in '+group[groupID].name+'.');
                }//}}}//}}}
            }else if(key==='date'){//{{{
                tmp_res[tmp_res.length]=toInt(val);//}}}
            }else if(key==='month'){//{{{
                if(!monthDic[val.toLowerCase()] && toInt(val)!==month+1 || monthDic[val.toLowerCase()] && monthDic[val.toLowerCase()]!=month)
                    tmp_res=[];//違う月の時
                else
                    tmp_res=all_days();//同じ月の時//}}}
            }else if(key==='day'){//{{{
                if(val.match(/^\d/)){
                    // day:3rd-wed
                    //valが1st-wedといった具合になっている
                    val=val.match(/^(\d+)(?:st|[nr]d|th)-?(.+)$/i);
                    var ordinalNum=toInt(val[1]);
                    var valDay=dayDic[val[2].toLowerCase()];
                    var dayCount=0;
                    var index=0;
                    while(cal[index][valDay]==='') index++;//今月に入るまでループ回す
                    index=index-1+ordinalNum;//今月の初日をindexが指しているから、-1してordinalNum足せば対象の日となる
                    tmp_res[tmp_res.length]=cal[index][valDay];
                }else{
                    // day:mon,tue,...
                    var valDay=dayDic[val.toLowerCase()];
                    var dayCount=0;
                    _.some(cal,function(week){
                        if(week[valDay]!==''){
                            tmp_res[tmp_res.length]=week[valDay];
                        }
                    });
                }//}}}
            }else if(key==='year'){//{{{
                if(val==='leap-year'||val==='leap_year'||val==='うるう年'||val==='閏年'){
                    //year: leap-year
                    if(isLeapYear(year)){
                        tmp_res=all_days();
                    }else{
                        tmp_res=[];
                    }
                }else if(toInt(val)!==year){
                    // year:Int
                    tmp_res=[];//違う年
                }else tmp_res=all_days();//}}}
            }else{
                throw myError('undefined key "'+key+'".');
            }
            while(last(tmp_res)===OVER_MONTH) tmp_res.pop();//来月分を排除
            if(key==='day'){
                //not,from,toは不可能、date、month,yearはメモ化するほうが無駄だから
                GHLMemo[year-MEMO_LIMIT][month][nowSelector]=_.clone(tmp_res);
            }
            return tmp_res;
        }//}}}
        if(stack.length!=1){
            console.log(stack,selectors);
            throw myError('unexpected error in execSelectors().');
        }
        return stack.pop();
    }//}}}
    function splitSelector(selector){//{{{
        //演算子はand or && || かつ または スペース(アンド区切り)
        if(SSMemo[selector]) return SSMemo[selector];
        function resPush(obj){if(obj[0]!=='') res[res.length]=obj;};
        var res=[];
        var isInString=false;
        var start=0;
        for(var i=0,j=selector.length;i<j;i++){
            var nowChar=selector.charAt(i);
            if(isInString){
                if(nowChar==='"'){
                    isInString=false;
                }else if(nowChar==='\\'){
                    i+=1;
                }
            }else{
                //文字列中でない
                if(nowChar==='"'){
                    //文字列に入った
                    isInString=true;
                }else if(nowChar===' '){
                    resPush([selector.substring(start,i),OTHERS]);
                    var operator={' and ':'&&', ' かつ ':'&&', ' && ':'&&', ' or ':'||', ' または ':'||', ' || ':'||'};
                    var added=false;
                    operatorLoop:for(var key in operator){
                        if(selector.substr(i,key.length)===key){
                            resPush([operator[key],OPERATOR]);
                            start=i+key.length;
                            i+=key.length;
                            added=true;
                            break operatorLoop;
                        }
                    }
                    if(!added){
                        resPush(['&&',OPERATOR]);
                        start=i+1;
                        i+=1;
                    }
                }else if(nowChar==='('||nowChar===')'){
                    resPush([selector.substring(start,i),OTHERS]);
                    resPush([nowChar,nowChar==='('?LPARENTHESES:RPARENTHESES]);
                    start=i+1;
                }
            }
        };
        if(selector.substring(start)!==''){
            resPush([selector.substring(start),OTHERS]);
        }
        return SSMemo[selector]=res;
    }//}}}
    function shuntingYard(formula){//{{{
        var stack=[];
        var output=[];
        var priority={
            '||':0,
            '&&':1
        };
        for(var i=0,j=formula.length;i<j;i++){
            if(formula[i][1]===OTHERS){
                output[output.length]=formula[i].concat();
            }else if(formula[i][1]===OPERATOR){
                var o1=formula[i][0];
                if(last(stack)){
                    var o2=last(stack)[0];
                    if(priority[o1]<=priority[o2]){
                        output[output.length]=stack.pop();
                    }
                }
                stack[stack.length]=formula[i];
            }else if(formula[i][1]===LPARENTHESES){
                stack[stack.length]=formula[i];
            }else if(formula[i][1]===RPARENTHESES){
                while(last(stack)[1]!=LPARENTHESES){
                    output[output.length]=stack.pop();
                    if(stack.length===0){
                        throw myError('found mismatched parentheses');
                    }
                }
                stack.pop();//左括弧を捨てる
            }
        }
        while(stack.length>0){
            //反転させて挿入しても速度に大差はでなかった
            if(last(stack)[1]===LPARENTHESES){
                throw myError('found mismatched parentheses.');
            }
            output[output.length]=stack.pop();
        }
        return output;
    }//}}}
    return {
        eventCalendar:eventCalendar,
        splitSelector:splitSelector,
        execSelectors:execSelectors//テスト用
    };
}])//}}}
.run(['calF','$timeout',function(calF,$timeout){//{{{
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
        calF.today.year=today.getFullYear();
        calF.today.month=today.getMonth();
        calF.today.date=today.getDate();
        $timeout(setTomorrow,tomorrow-(new Date()));
    }
    $timeout(setTomorrow,tomorrow-(new Date()));
}])//}}}
;//factoryとか追加するときに便利なようにここにセミコロン
