angular.module(appName)
.factory('eventCal',['group','user','calF',function(group,user,calF){
    var constDic=[];
    ['OPERATOR','OTHERS','LPARENTHESES','RPARENTHESES'].reduce(function(a,b){
        window[b]=a;
        constDic[a]=b;
        a++;
        return a;
    },0);
    function sortByNumber(a,b){
        return a-b;
    }
    function last(arr){
        return arr[arr.length-1];
    }
    /* to make new selector//{{{
    var arr=['FROM','TO','MONTH','DAY','DATE'];
    var SELECTORS={};
    for(var i=0,j=arr.length;i<j;i++){
        SELECTORS[arr[i]]=i;
    }
    SELECTORS['曜日']=SELECTORS['DAY'];
    SELECTORS['月']=SELECTORS['MONTH'];
    SELECTORS['日']=SELECTORS['DATE'];
    *///}}}
    var SELECTORS={"FROM":0,"TO":1,"MONTH":2,"DAY":3,"DATE":4,"曜日":3,"月":2,"日":4}
    var beforeHiddenGroup=angular.toJson(user.hiddenGroup);
    function eventCalendar(date){//{{{
        var error={
            'split':'split error!'
        };
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
    function firstIndexOf(){//{{{
        //2番目以降の引数を1番目の引数(=文字列)の中から探し、一番出るのが早い文字の位置を返す
        arguments=Array.prototype.slice.call(arguments);
        var str=arguments.shift();
        var index=arguments.shift();
        var res=-1;
        for(var i=0,j=arguments.length;i<j;i++){
            var tmp_res=str.indexOf(arguments[i],index);
            if(tmp_res!==-1){
                if(res===-1){
                    res=tmp_res;
                }else{
                    res=res>=tmp_res?tmp_res:res;
                }
            }
        }
        return res;
    }//}}}
    function filter(arr,year,month,groupID){//{{{
        var res=[];
        if(!arr) return res;
        for(var i=0,j=arr.length;i<j;i++){
            if(arr[i].month===month&&arr[i].year===year){
                var tmp_res=_.clone(arr[i]);
                tmp_res.group=groupID;
                tmp_res.type='event';
                tmp_res.id=i;
                res[res.length]=tmp_res;
            }
        }
        return res;
    }//}}}
    function getEvents(groupID,year,month){//{{{
        if(groupID!=='private' && !group[groupID]) return [];//まだデータベースからデータ取得できてない場合などに返す
        var res=[];
        var parent_res=[];
        if(groupID==='private'){
            for(var i=0,i2=user.following.length;i<i2;i++){
                parent_res=parent_res.concat(getEvents(user.following[i],year,month));
            }
            res=res.concat(filter(user['private'].event,year,month,'private'));
            parent_res=parent_res.concat(res);
            res=res.concat(habit(user['private'].habit,year,month,'private',parent_res));
            user.updated=false;
        }else{
            if(group[groupID].parents){
                for(var i=0,i2=group[groupID].parents.length;i<i2;i++){
                    parent_res=parent_res.concat(getEvents(group[groupID].parents[i],year,month));
                }
            }
            res=res.concat(filter(group[groupID].event,year,month,groupID));
            parent_res=parent_res.concat(res);
            res=res.concat(habit(group[groupID].habit,year,month,groupID,parent_res));
            group[groupID].updated=false;
        }
        return res;
    };//}}}
    function habit(arr,year,month,groupID,eventListRes){//{{{
        //arrは習慣の一覧,year,monthはそのまま
        //毎週何曜日、毎月20日みたいな処理をする
        //返り値は指定された月の具体的な日付がくっついた配列
        if(!arr) return [];
        var all_res=[];
        var res=[];
        var cal=calF.calendar(year,month);
        var day={//{{{
            'sunday':0,'sun':0,'日曜日':0,
            'monday':1,'mon':1,'月曜日':1,
            'tuesday':2,'tue':2,'火曜日':2,
            'wednesday':3,'wed':3,'水曜日':3,
            'thursday':4,'thu':4,'木曜日':4,
            'friday':5,'fri':5,'金曜日':5,
            'saturday':6,'sat':6,'土曜日':6
        };//}}}
        var monthDic={//{{{
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
        };//}}}
        function execSelector(selectors){//{{{
            var stack=[];
            var all_days=(function(){
                var res=_.flatten(calF.calendar(year,month));
                return function(){
                    return res;
                }
            })();
            var from=null;
            var to=null;
            var setTo=null;//setToは、toをセッティングするという意味。set toという意味ではない。fromが設定されていないのにfromが必要な時に呼び出す
            var exceptions=[];
            _.each(selectors,function(nowSelector){
                if(nowSelector[1]===OTHERS){
                    var key=nowSelector[0].split(':')[0];
                    var val=nowSelector[0].split(':').slice(1).join(':');
                    var tmp_res=[];
                    res=[];
                    //or_iはselectors[or_i]。selectorsはorで分けられ、さらにandで分けられた配列になっているから
                    if(key==='not'){
                        tmp_res=all_days();
                        if(val==='public-holiday'||val==='祝日'){
                            //祝日を除くフィルタ
                            var events=getEvents(0,year,month);
                            tmp_res=all_days();
                            for(var k=0,k2=events.length;k<k2;k++){
                                tmp_res=_.without(tmp_res,events[k].date);
                            }
                        }else if(val.indexOf('month')===0){
                            //not:month=3 もしくは not:month:3
                            if(val.indexOf(':')!=-1){
                                if(month+1==val.split(':')[1]){
                                    tmp_res=[];
                                }
                            }else{
                                if(month+1==val.split('=')[1]){
                                    tmp_res=[];
                                }
                            }
                        }else if(val.indexOf('date')===0){
                            if(val.indexOf(':')!=-1) tmp_res=_.without(tmp_res,parseInt(val.split(':')[1],10));
                            else if(val.indexOf('=')!=-1) tmp_res=_.without(tmp_res,parseInt(val.split('=')[1],10));
                        }else{
                            var nameKey=val.split('=')[0];//not:name='なんとか'みたいにしてるから
                            var nameVal=val.replace(/^.+?=/,'');//not:name='なんとか'みたいにしてるから
                            nameVal=nameVal.replace(/^"(.+)"$/,'$1');//name="なんとか"としていて valが"なんとか"になっている
                            for(var k=0,k2=eventListRes.length;k<k2;k++){
                                if(eventListRes[k][nameKey]===nameVal||eventListRes[k][nameKey].indexOf('[mes]')===0&&eventListRes[k][nameKey].replace('[mes]','')===nameVal){
                                    //除外対象リストの構築
                                    //ここのリストを用いて除外対象リストを構築する。
                                    //eventListResなのは、not:name="自主練なし"みたいな指定するから
                                    tmp_res=_.without(tmp_res,eventListRes[k].date);
                                }
                            }
                        }
                    }
                    if(key==='from'){
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
                        tmp_res=all_days();
                        if(val.indexOf('/')!==-1){
                            //こっちはfromの設定とあまり関係ない
                            val=val.split('/');
                            to=new Date(parseInt(val[0],10),parseInt(val[1],10)-1,parseInt(val[2],10));
                            if(to.getFullYear()<year||to.getFullYear()==year&&to.getMonth()<month){
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
                                    if(val.substr(val.length-4,4)==='date'){
                                        val=parseInt(val.substring(0,val.length-4),10);
                                        to=new Date(from.getTime());
                                        to.setDate(to.getDate()+val);
                                    }else if(val.substr(val.length-4,4)==='week'){
                                        val=parseInt(val.substring(0,val.length-4),10);
                                        to=new Date(from.getTime());
                                        to.setDate(to.getDate()+7*val);
                                    }else if(val.substr(val.length-4,4)==='year'){
                                        val=parseInt(val.substring(0,val.length-4),10);
                                        to=new Date(from.getTime());
                                        to.setFullYear(to.getFullYear()+val);
                                    }
                                    if(to.getFullYear()<year||to.getFullYear()==year&&to.getMonth()<month){
                                        //明らかにto以降だからtmp_resは空
                                        tmp_res=[];
                                    }else if(to.getFullYear()==year&&to.getMonth()==month){
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
                        tmp_res.push(parseInt(val,10));
                    }else if(key==='month'){
                        if(monthDic[val]){
                            if(monthDic[val]!=month){
                                tmp_res=[];
                                //一致する日なし
                            }else{
                                tmp_res=all_days();
                            }
                        }else{
                            if(parseInt(val,10)!=month+1){
                                tmp_res=[];
                                //一致する日なし
                            }else{
                                tmp_res=all_days();
                            }
                        }
                    }else if(key==='day'){
                        if(val.match(/^\d/)){
                            val=val.match(/^(\d+)(?:st|nd|rd|th)-?(.+)$/);
                            var ordinalNum=parseInt(val[1],10);
                            var valDay=day[val[2]];
                            var dayCount=0;
                            var index=0;
                            while(!cal[index][valDay]) index++;
                            index=index-1+ordinalNum;
                            if(_.indexOf(exceptions,cal[index][valDay],true)===-1){
                                tmp_res.push(cal[index][valDay]);
                            }
                        }else{
                            val=val.match(/^(.+)$/);
                            var valDay=day[val[1]];
                            var dayCount=0;
                            _.some(cal,function(week){
                                if(week[valDay]){
                                    if(_.indexOf(exceptions,week[valDay],true)===-1){
                                        tmp_res.push(week[valDay]);
                                    }
                                }
                            });
                        }
                    }
                    stack.push(tmp_res);
                }else if(nowSelector[1]===OPERATOR){
                    if(nowSelector[0]==='&&'){
                        stack.push(_.intersectionObjects(stack.pop(),stack.pop()));
                        //セレクタのand処理部分
                    }else if(nowSelector[0]==='||'){
                        stack.push(_.unionObjects(stack.pop(),stack.pop()));
                    }
                }
            });
            return stack.pop();
        }//}}}
        for(var i=0,i2=arr.length;i<i2;i++){
            arr[i].type='habit';
            arr[i].group=groupID;
            var tmp_res=execSelector(splitSelector(arr[i].selector));
            _.each(tmp_res,function(item,index){
                tmp_res[index]={year:year,month:month,date:item,name:arr[i].name,group:groupID,id:i,type:'habit'};
            });
            all_res=all_res.concat(tmp_res);
        }
        return all_res;
    }//}}}
    function splitSelector(selector){//{{{
        //演算子はand or && || かつ または スペース(アンド区切り)
        function resPush(obj){
            if(obj[0]!==''){
                res.push(obj);
            }
        }
        var res=[];
        var isInString=false;
        var start=0;
        for(var i=0;i<selector.length;i++){
            nowChar=selector.charAt(i);
            if(isInString){
                if(nowChar==='"'){
                    isInString=false;
                }
            }else{
                //文字列中でない
                if(nowChar==='"'){
                    isInString=true;
                }else if(nowChar===' '){
                    resPush([selector.substring(start,i),OTHERS]);
                    var operator={'and':'&&','かつ':'&&','&&':'&&','or':'||','または':'||','||':'||'};
                    var added=false;
                    operatorLoop:for(var key in operator){
                        if(selector.substr(i,key.length+2)===' '+key+' '){
                            resPush([operator[key],OPERATOR]);
                            start=i+key.length+2;
                            i+=key.length+1;
                            added=true;
                            break operatorLoop;
                        }
                    }
                    if(!added){
                        resPush(['&&',OPERATOR]);
                        start=i+1;
                    }
                }else if(nowChar==='('){
                    resPush([selector.substring(start,i),OTHERS]);
                    resPush(['(',LPARENTHESES]);
                    start=i+1;
                }else if(nowChar===')'){
                    resPush([selector.substring(start,i),OTHERS]);
                    resPush([')',RPARENTHESES]);
                    start=i+1;
                }
            }
        }
        if(selector.substring(start)!==''){
            resPush([selector.substring(start),OTHERS]);
        }
        return shuntingYard(res);
    }//}}}
    function shuntingYard(formula){//{{{
        var stack=[];
        var output=[];
        var priority={
            '||':0,
            '&&':1
        }
        for(var i=0,j=formula.length;i<j;i++){
            if(formula[i][1]===OTHERS){
                output.push(formula[i].concat());
            }else if(formula[i][1]===OPERATOR){
                var o1=formula[i][0];
                if(last(stack)){
                    var o2=last(stack)[0];
                    if(priority[o1]<=priority[o2]){
                        output.push(stack.pop());
                    }
                }
                stack.push(formula[i]);
            }else if(formula[i][1]===LPARENTHESES){
                stack.push(formula[i]);
            }else if(formula[i][1]===RPARENTHESES){
                while(last(stack)[1]!=LPARENTHESES){
                    output.push(stack.pop());
                    if(stack.length===0){
                        error('found mismatched parentheses');
                    }
                }
                stack.pop();//左括弧を捨てる
            }
        }
        while(stack.length>0){
            if(last(stack)[1]===LPARENTHESES){
                error('found mismatched parentheses.');
            }
            output.push(stack.pop());
        }
        return output;
    }//}}}
    /*var timer={},stopper={};//{{{
    function time(name){
        if(!timer[name]){
            console.time(name);
            timer[name]=0;
        }
        timer[name]++;
    }
    function timeEnd(name){
        if(!stopper[name]){
            stopper[name]=1;
            return;
        }
        if(stopper[name]<10){
            stopper[name]++;
            if(stopper[name]==10){
                console.timeEnd(name);
                console.log(timer[name],stopper[name]);
            }
        }
    }*///}}}
    return {
        eventCalendar:eventCalendar,
        filter:filter,
        getEvents:getEvents,
        habit:habit,
        splitSelector:splitSelector
    };
}]);
