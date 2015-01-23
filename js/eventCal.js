angular.module(appName)
.factory('eventCal',['group','user','calF','$mdToast',function(group,user,calF,$mdToast){
    var constDic=['OPERATOR','OTHERS','LPARENTHESES','RPARENTHESES'];
    var OPERATOR=0;
    var OTHERS=1;
    var LPARENTHESES=2;
    var RPARENTHESES=3;
    function sortByNumber(a,b){return a-b;};
    function last(arr){return arr[arr.length-1];};
    function error(mes){
        $mdToast.show($mdToast.simple().content(mes).position('top right'));
        console&&console.error&&console.error(mes);
    };
    var GHLMemo=[];//getHabitListMemo;
    var SSMemo={};//splitSelectorMemo;
    function eventCalendar(date){//{{{
        var error={'split':'split error!'};
        var events=[];
        var eventCalendar=[]//日付と対応させているイベントカレンダー.フォーマットはcalendar()とは違うから注意
        var groups=_.difference(user.following,user.hiddenGroup);
        for(var i=0,i2=groups.length;i<i2;i++){
            events[events.length]=getEvents(groups[i],calF.year,calF.month);
        }
        if(!user.isHiddenGroup(-1)){
            //privateがhiddenに設定されていない
            events[events.length]=getEvents('private',calF.year,calF.month);
        }
        for(var i=0,i2=events.length;i<i2;i++){
            for(var j=0,j2=events[i].length;j<j2;j++){
                if(!eventCalendar[events[i][j].date]){
                    eventCalendar[events[i][j].date]=[];
                }
                eventCalendar[events[i][j].date][eventCalendar[events[i][j].date].length]=events[i][j].id+':'+events[i][j].group+':'+events[i][j].type;
            }
        }
        return eventCalendar[date]||[];
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
        function execSelectors(selectors,year,month){//{{{
            //セレクタを適応させて返す
            //year,monthはexecSelectorをメモ化するため
            var stack=[];
            var ALL_DAYS=_.flatten(calF.calendar(year,month));
            var from=null;
            var to=null;
            var setTo=null;//setToは、toをセッティングするという意味。set toという意味ではない。fromが設定されていないのにfromが必要な時に呼び出す
            _.each(selectors,function(nowSelector){//{{{
                if(nowSelector[1]===OTHERS){
                    //セレクタの時
                    stack[stack.length]=execSelector(nowSelector[0],year,month);
                }else if(nowSelector[1]===OPERATOR){
                    //演算子の時
                    if(nowSelector[0]==='&&') //セレクタのand処理部分
                        stack.push(_.intersection(stack.pop(),stack.pop()));//!!!stack.pop()しているため、stack.pushを直してはいけない
                    else if(nowSelector[0]==='||')
                        stack.push(_.union(stack.pop(),stack.pop()));//同上
                    else error('undefined operator '+nowSelector[0]);
                }
            });//}}}
            function execSelector(nowSelector,year,month){//{{{
                var all_days=function(){
                    return _.clone(ALL_DAYS);
                };
                var cal=calF.calendar(year,month);
                var day={
                    'sunday':0,'sun':0,'日曜日':0,
                    'monday':1,'mon':1,'月曜日':1,
                    'tuesday':2,'tue':2,'火曜日':2,
                    'wednesday':3,'wed':3,'水曜日':3,
                    'thursday':4,'thu':4,'木曜日':4,
                    'friday':5,'fri':5,'金曜日':5,
                    'saturday':6,'sat':6,'土曜日':6
                };
                var monthDic={
                    'January':0,'Jan':0,'睦月':0,
                    'February':1,'Feb':1,'如月':1,
                    'March':2,'Mar':2,'弥生':2,
                    'April':3,'Apr':3,'卯月':3,
                    'May':4,'皐月':4,
                    'June':5,'Jun':5,'水無月':5,
                    'July':6,'Jul':6,'文月':6,
                    'August':7,'Aug':7,'葉月':7,
                    'September':8,'Sep':8, '長月':8,
                    'October':9,'Oct':9,'神無月':9,
                    'November':10,'Nov':10,'霜月':10,
                    'December':11,'Dec':11,'師走':11
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
                if(key==='not'){
                    tmp_res=all_days();
                    if(val==='public-holiday'||val==='祝日'){
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
                    }
                }else if(key==='from'){
                    //from:year/month/date という形
                    val=val.split('/');
                    from=new Date(parseInt(val[0],10),parseInt(val[1],10)-1,parseInt(val[2],10));
                    if(from.getFullYear()>year||from.getFullYear()==year&&from.getMonth()>month){
                        //fromよりも明らかに以前
                        tmp_res=[];
                    }else if(from.getFullYear()==year&&from.getMonth()==month){
                        //fromの境目あたり。
                        tmp_res=all_days();
                        tmp_res=_.filter(tmp_res,function(n){
                            return n>=from.getDate();
                        });
                    }else tmp_res=all_days();
                    if(setTo!=null){
                        setTo();
                    }
                }else if(key==='to'){
                    //to:year/month/date もしくは to:xweek to:xyear to:xmonth のいずれか
                    tmp_res=all_days();
                    if(val.indexOf('/')!==-1){
                        // 2014/1/1 のように区切れている
                        //こっちはfromの設定とあまり関係ない
                        val=val.split('/');
                        to=new Date(parseInt(val[0],10),parseInt(val[1],10)-1,parseInt(val[2],10));//これでtoが生成できる
                        if(to.getFullYear()<year || to.getFullYear()==year && to.getMonth()<month){
                            //明らかにto以降だからtmp_resは空
                            tmp_res=[];
                        }else if(to.getFullYear()==year&&to.getMonth()==month){
                            //toがかぶっているであろう時
                            tmp_res=all_days();
                            tmp_res=_.filter(tmp_res,function(n){
                                return n<=to.getDate();//toより前であることが条件
                            });
                        }else tmp_res=all_days();
                    }else{
                        tmp_res=all_days();
                        setTo=(function(val){
                            return function(){
                                var top4=val.substr(val.length-4,4);//最後の4文字を取り出す。理由はto:4weekのようになっているから
                                if(top4==='date'||top4==='week'||top4==='year'){
                                    val=parseInt(val.substring(0,val.length-4),10);//to:4weekの4の部分
                                    to=new Date(from.getTime());
                                    if(top4==='date')
                                        to.setDate(to.getDate()+val);
                                    else if(top4==='week')
                                        to.setDate(to.getDate()+7*val);
                                    else if(top4==='year')
                                        to.setFullYear(to.getFullYear()+val);
                                }
                                if(to.getFullYear()<year || to.getFullYear()==year && to.getMonth()<month){
                                    //明らかにto以降だからtmp_resは空
                                    tmp_res=[];
                                }else if(to.getFullYear()==year && to.getMonth()==month){
                                    //toがかぶっているであろう時
                                    tmp_res=all_days();
                                    tmp_res=_.filter(tmp_res,function(n){
                                        return n<=to.getDate();//toより前であることが条件
                                    });
                                }else tmp_res=all_days();
                            };
                        })(val);
                        if(from!==null){
                            setTo();
                            setTo=null;
                        }
                    }
                }else if(key==='date'){
                    tmp_res[tmp_res.length]=parseInt(val,10);
                }else if(key==='month'){
                    if(!monthDic[val] && parseInt(val,10)!=month+1 || monthDic[val] && monthDic[val]!=month)
                        tmp_res=[];//違う月の時
                    else if(!monthDic[val] && parseInt(val,10)==month+1 || monthDic[val] && monthDic[val]==month)
                        tmp_res=all_days();//同じ月の時
                }else if(key==='day'){
                    if(val.match(/^\d/)){
                        //valが1st-wedといった具合になっている
                        val=val.match(/^(\d+)(?:st|nd|rd|th)-?(.+)$/);
                        var ordinalNum=parseInt(val[1],10);
                        var valDay=day[val[2]];
                        var dayCount=0;
                        var index=0;
                        while(cal[index][valDay]==='') index++;//今月に入るまでループ回す
                        index=index-1+ordinalNum;//今月の初日をindexが指しているから、-1してordinalNum足せば対象の日となる
                        tmp_res[tmp_res.length]=cal[index][valDay];
                    }else{
                        var valDay=day[val];
                        var dayCount=0;
                        _.some(cal,function(week){
                            if(week[valDay]!==''){
                                tmp_res[tmp_res.length]=week[valDay];
                            }
                        });
                    }
                }else if(key==='year'){
                    if(val==='leap-year'||val==='leap_year'||val==='うるう年'||val==='閏年'){
                        console.log('leap year');
                        if(year%400===0||year%4===0&&year%100!==0){
                            tmp_res=all_days();
                        }else{
                            tmp_res=[];
                        }
                    }else if(parseInt(val,10)!==year){
                        tmp_res=[];//違う年
                    }else tmp_res=all_days();
                }else error('undefined key "'+key+'".');
                if(key==='day'){
                    //not,from,toは不可能、date、month,yearはメモ化するほうが無駄だから
                    GHLMemo[year-MEMO_LIMIT][month][nowSelector]=_.clone(tmp_res);
                }
                return tmp_res;
            }//}}}
            if(stack.length!=1){
                console.log(stack);
                error('unexpected error in execSelectors().');
            }
            return stack.pop();
        }//}}}
        for(var i=0,i2=arr.length;i<i2;i++){
            arr[i].type='habit';
            arr[i].group=groupID;
            var tmp_res=execSelectors(splitSelector(arr[i].selector),year,month);
            _.each(tmp_res,function(item,index){
                tmp_res[index]={year:year,month:month,date:item,name:arr[i].name,group:groupID,id:i,type:'habit'};
            });
            res=res.concat(tmp_res);
        }
        return res;
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
        return SSMemo[selector]=shuntingYard(res);
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
                        error('found mismatched parentheses');
                    }
                }
                stack.pop();//左括弧を捨てる
            }
        }
        while(stack.length>0){
            //反転させて挿入しても速度に大差はでなかった
            if(last(stack)[1]===LPARENTHESES){
                error('found mismatched parentheses.');
            }
            output[output.length]=stack.pop();
        }
        return output;
    }//}}}
    return {
        eventCalendar:eventCalendar,
        splitSelector:splitSelector
    };
}]);
