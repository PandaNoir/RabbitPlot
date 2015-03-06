(function(window,undefined){

function calendar(OVER_MONTH,MEMO_LIMIT,IS_SMART_PHONE,ATTRIBUTE,myError){
    if(OVER_MONTH===undefined) OVER_MONTH=64;
    if(MEMO_LIMIT===undefined) MEMO_LIMIT=1950;
    if(IS_SMART_PHONE===undefined) IS_SMART_PHONE=false;
    if(ATTRIBUTE===undefined){
        ATTRIBUTE={
            OPERATOR:0,
            OTHERS:1,
            LPARENTHESES:2,
            RPARENTHESES:3
        };
    }
    if(myError===undefined){
        myError=(function(){
            var ErrorConstructor = ErrorConstructor || Error;
            return function(mes){
                return new ErrorConstructor(mes);
            };
        });
    }
    if(toInt===undefined) var toInt=function(n){return parseInt(n,10)};
    if(isLeapYear===undefined) var isLeapYear=function(year){return year%400===0||year%4===0&&year%100!==0;};
    if(isValidDate===undefined) var isValidDate=function(y,m,d){var date=new Date(y,m,d);return date.getFullYear()===toInt(y)&&date.getMonth()===toInt(m)&&date.getDate()===toInt(d);};
    var holiday={//{{{
        event:[],
        habit:[
            {name:'[mes]元旦',selector:'range:1948/7/20.. month:1 date:1'},
            {name:'[mes]成人の日',selector:'range:1948/7/20..1999/12/31 month:1 date:15'},
            {name:'[mes]成人の日',selector:'range:2000/1/1.. month:1 day:2nd-mon'},
            {name:'[mes]建国記念の日',selector:'range:1967/1/1.. month:2 date:11'},
            {name:'[mes]天皇誕生日',selector:'range:1948/7/20..1988/12/31 month:4 date:29'},
            {name:'[mes]みどりの日',selector:'range:1989/1/1..2006/12/31 month:4 date:29'},
            {name:'[mes]昭和の日',selector:'range:2007/1/1.. month:4 date:29'},
            {name:'[mes]憲法記念日',selector:'range:1948/7/20.. month:5 date:3'},
            {name:'[mes]みどりの日',selector:'range:2007/1/1.. month:5 date:4'},
            {name:'[mes]こどもの日',selector:'range:1948/7/20.. month:5 date:5'},
            {name:'[mes]海の日',selector:'range:1996/1/1..2002/12/31 month:7 date:20'},
            {name:'[mes]海の日',selector:'range:2003/1/1.. month:7 day:3rd-mon'},
            {name:'[mes]山の日',selector:'range:2016/1/1.. month:8 date:11'},
            {name:'[mes]敬老の日',selector:'range:1966/1/1..2002/12/31 month:9 date:15'},
            {name:'[mes]敬老の日',selector:'range:2003/1/1.. month:9 day:3rd-mon'},
            {name:'[mes]体育の日',selector:'range:1966/1/1..1999/12/31 month:10 date:10'},
            {name:'[mes]体育の日',selector:'range:2000/1/1.. month:10 day:2nd-mon'},
            {name:'[mes]文化の日',selector:'range:1948/7/20.. month:11 date:3'},
            {name:'[mes]勤労感謝の日',selector:'range:1948/7/20.. month:11 date:23'},
            {name:'[mes]天皇誕生日',selector:'range:1989/1/1.. month:12 date:23'},
            {name:'[mes]春分の日',selector:'range:1949/1/1.. date:vernal-equinox-day'},
            {name:'[mes]秋分の日',selector:'range:1948/1/1.. date:autumnal-equinox-day'},
            {name:'[mes]十五夜',selector:'range:1901/1/1.. date:full-moon-night'}
        ]
    };//}}}
    var today=new Date();
    var memo=[];
    var constDic=[];
    var SSMemo={};//splitSelectorMemo;
    for(var key in ATTRIBUTE){
        constDic[ATTRIBUTE[key]]=key;
    }
    var OPERATOR=ATTRIBUTE.OPERATOR;
    var OTHERS=ATTRIBUTE.OTHERS;
    var LPARENTHESES=ATTRIBUTE.LPARENTHESES;
    var RPARENTHESES=ATTRIBUTE.RPARENTHESES;
    function last(arr){return arr[arr.length-1];};
    function getHolidays(y,m){//{{{
        var res=[];
        for(var i=0,j=holiday.event.length;i<j;i++){
            if(holiday.event[i].year===y && holiday.event[i].month===m){
                res[res.length]=holiday.event[i].date;
            }
        }
        for(var i=0,i2=holiday.habit.length;i<i2;i++){
            res.push.apply(res,execSelectors(holiday.habit[i].selector,y,m,res));
        }
        if(!(y<1973||y==1973&&m<4)){
            //振替休日が制定されたあと
            var sundayHoliday=_.intersection(res,execSelectors('day:sun',y,m,[]));//日曜かつ祝日
            res.push.apply(res,_.map(sundayHoliday,function(n){
                var k=1;
                while(_.indexOf(res,n+k,true)!==-1) k+=1;//振替先が祝日でなくなるまで進める
                return n+k;
            }));
            res.sort();
        }
        if(y>=1985||y==1985&&m==12&&d>=27){
            //国民の休日が制定されたあと
            var beforeDay=0;
            _.each(res,function(n){
                if(n-beforeDay===2) res.push(n-1);
                beforeDay=n;
            });
            res.sort();
        }
        return res;
    };//}}}
    function calendar(year,month,isFlatten){//{{{
        isFlatten=isFlatten||false;
        //ここでのmonthはnew Dateを使用するため実際-1されている(=0月から始まっている)
        if(!isFlatten){
            if(memo[year-MEMO_LIMIT]){
                if(memo[year-MEMO_LIMIT][month]) return memo[year-MEMO_LIMIT][month];
            }else{
                memo[year-MEMO_LIMIT]=[];
            }
        }
        var lastDate=[31,28,31,30,31,30,31,31,30,31,30,31][month];//来月の1日の1日前という算出方法をとる
        if(month===1 && isLeapYear(year)){
            //month===1は、monthが(実際の数字-1)月だから2月の判定部分となっている
            lastDate=29;//うるう年だから
        }

        var res=[];//カレンダー用配列
        var i=0;
        var day=(new Date(year,month,1)).getDay();
        var row=[];
        if(isFlatten){
            for(var i=1;i<=lastDate;i++){
                res[res.length]=i;
            }
            return res;
        }

        //!isFlatten
        for(var i=day;i>0;i--){
            row[row.length]=0;
        }
        for(var i=1;i<=lastDate;i++){
            if(day>6){
                day=0;
                res[res.length]=row;
                row=[];
            }
            row[row.length]=i;//日付が今月の範囲に収まっている
            day++;
        }
        for(var i=day;i<7;i++){
            row[row.length]=OVER_MONTH;
        }
        if(row.length>0) res[res.length]=row;
        row=null;
        return memo[year-MEMO_LIMIT][month]=res;
    };//}}}
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
                if(nowSelector[0]==='&&') stack.push(_.intersection(stack.pop(),stack.pop()));//[重要]stack.pop()しているため、stack.pushを直してはいけない
                else if(nowSelector[0]==='||') stack.push(_.union(stack.pop(),stack.pop()));//同上
                else throw myError('undefined operator '+nowSelector[0]);
            }
        });//}}}
        function execSelector(nowSelector,year,month,eventListRes){//{{{
            var allDays=function(){
                return calendar(year,month,true);
            };
            var meansPublicHoliday=function(s){
                //sが祝日を表しているか判定
                // publicHoliday || public-holiday || 祝日を想定
                s=s.toLowerCase();
                return s==='public-holiday'||s==='publicholiday'||s==='祝日';
            };
            var meansVernalEquinoxDay=function(s){
                //sが春分の日を表しているか判定
                s=s.toLowerCase();
                return s==='vernal-equinox-day'||s==='vernalequinoxday'||s==='春分'||s==='春分の日';
            };
            var meansAutumnalEquinoxDay=function(s){
                //sが秋分の日を表しているか判定
                s=s.toLowerCase();
                return s==='autumnal-equinox-day'||s==='autumnalequinoxday'||s==='秋分'||s==='秋分の日';
            };
            var meansFullMoonNight=function(s){
                //sが十五夜を表しているか判定
                s=s.toLowerCase();
                return s==='full-moon-night'||s==='fullmoonnight'||s==='十五夜'||s==='中秋の名月';
            };
            var cal=calendar(year,month);
            var dayDic={
                'sunday':0,'sun':0,'日曜日':0,'日':0,
                'monday':1,'mon':1,'月曜日':1,'月':1,
                'tuesday':2,'tue':2,'火曜日':2,'火':2,
                'wednesday':3,'wed':3,'水曜日':3,'水':3,
                'thursday':4,'thu':4,'木曜日':4,'木':4,
                'friday':5,'fri':5,'金曜日':5,'金':5,
                'saturday':6,'sat':6,'土曜日':6,'土':6
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
            var key=nowSelector.split(':')[0];
            var val=nowSelector.split(':').slice(1).join(':');
            var tmpRes=[];
            var fromRes=[],toRes=[];
            var fromReses=[];
            var from,to;
            var top4,top5,froms=[];//month/dateを処理するときにfromが2つでてくるから使用
            if(key==='not'){//{{{
                tmpRes=allDays();
                if(meansPublicHoliday(val)){
                    //祝日を除くフィルタ
                    tmpRes=_.difference(tmpRes,getHolidays(year,month));
                }else if(val.indexOf('year')===0||val.indexOf('month')===0||val.indexOf('date')===0||val.indexOf('day')===0){
                    //not:month=3 もしくは not:month:3
                    val=val.replace(/=/,':');//not:month=3をnot:month:3に揃える
                    tmpRes=_.difference(allDays(),execSelector(val,year,month));//month:3を実行してその結果を返す
                }else{
                    var nameKey=val.split('=')[0];//not:name='なんとか'みたいにしてるから
                    var nameVal=val.replace(/^.+?=/,'');//not:name='なんとか'みたいにしてるから
                    nameVal=nameVal.replace(/^"(.+)"$/,'$1');//name="なんとか"としていて valが"なんとか"になっている
                    _.each(eventListRes,function(resItem){
                        if(resItem[nameKey]===nameVal || resItem[nameKey].indexOf('[mes]')===0 && resItem[nameKey].slice(5)===nameVal){
                            //eventListResはnot:name="自主練なし"みたいな指定をしたいから使う
                            //多分反例が出てくるからそのうち直したい
                            tmpRes=_.without(tmpRes,resItem.date);
                        }
                    });
                }//}}}
            }else if(key==='is'){//{{{
                // is:public-holidayと言った感じ
                if(meansPublicHoliday(val)){
                    tmpRes=_.intersection(allDays(),getHolidays(year,month));
                }else if(val==='last'){
                    //======================
                    var lastDate=[31,28,31,30,31,30,31,31,30,31,30,31][month];
                    if(isLeapYear(year)&&month===1){
                        lastDate=29;
                    }
                    return [lastDate];
                }else{
                    throw myError('unexpected a value of a yesterday selector.'+val);
                }
                //}}}
            }else if(key==='yesterday'){//{{{
                tmpRes=allDays();
                var key2=val.split(':')[0];
                var val2=val.split(':').slice(1).join(':');
                if(meansPublicHoliday(val)){
                    tmpRes=_.intersection(tmpRes,_.map(execSelector('is:'+val,year,month),function(n){return n+1;}));
                    // 12/32日みたいな日があるかもしれないからこういう処理
                }else if(key2==='day'||key2==='date'){
                    //この辺は代用できる気がするし、いらないとおもう。一応つけるけど
                    tmpRes=_.intersection(allDays(),_.map(execSelector(val,year,month),function(n){return n+1;}));//month:3を実行してその結果を返す
                }else{
                    throw myError('unexpected a value of a yesterday selector.'+val);
                }
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
                    // 2014/1/1 のように区切れている
                    //こっちはfromの設定とあまり関係ない
                    val=_.map(val.split('/'),toInt);
                    to=new Date(val[0],val[1]-1,val[2]);//これでtoが生成できる
                    if(!isValidDate(val[0],val[1]-1,val[2])){
                        throw myError('invalid range selector.'+key+':'+val);
                    }
                    if(to.getFullYear()<year || to.getFullYear()==year && to.getMonth()<month){
                        //明らかにto以降だからtmpResは空
                        tmpRes=[];
                    }else if(to.getFullYear()==year && to.getMonth()==month){
                        //toがかぶっているであろう時
                        tmpRes=allDays();
                        tmpRes=tmpRes.slice(0,_.lastIndexOf(tmpRes,to.getDate(),true)+1);
                    }else tmpRes=allDays();//}}}
                }else if(val.slice(-2)==='..'){//{{{
                    //20xx/xx/xx..という形式、つまりfromのみ指定
                    //必ずyear/month/date という形。year,month,dateはいづれも省略不可。month/dateとはとれない
                    if(val.slice(-3)==='...'){
                        val=val.slice(0,-3);//...をカット
                    }else{
                        val=val.slice(0,-2);//..をカット
                    }
                    val=_.map(val.split('/'),toInt);
                    from=new Date(val[0],val[1]-1,val[2]);
                    if(!isValidDate(val[0],val[1]-1,val[2])){
                        throw myError('invalid range selector.'+key+':'+val);
                    }
                    if(from.getFullYear()>year || from.getFullYear()==year && from.getMonth()>month){
                        //fromよりも明らかに以前
                        tmpRes=[];
                    }else if(from.getFullYear()==year && from.getMonth()==month){
                        //fromの境目あたり。
                        tmpRes=allDays();
                        tmpRes=tmpRes.slice(_.indexOf(tmpRes,from.getDate(),true));
                    }else tmpRes=allDays();//}}}
                }else if(val.indexOf('..')!==-1){//{{{
                    //20xx/xx/xx..20xx/xx/xxという形式
                    //month/date..month/dateも可能(例:12/29..1/3)
                    tmpRes=[];
                    val=val.split('...');//下で..の時の処理もしてる
                    if(val.length===1){
                        //...がなかった = ..があった
                        val=val[0].split('..');
                    }
                    fromRes=[];
                    toRes=[];
                    fromReses=[];
                    from=val[0];
                    froms=[];//month/dateを処理するときにfromが2つでてくるから使用
                    to=val[1];
                    top4=to.substr(to.length-4,4);//最後の4文字を取り出す。to:4weekのようになっているから
                    top5=to.substr(to.length-5,5);//最後の5文字を取り出す。to:4weeksのようになっているから
                    //from処理
                    from=_.map(from.split('/'),toInt);
                    if(from.length===3){
                        // year/month/dateと記述されている
                        froms.push(new Date(from[0],from[1]-1,from[2]));
                    }else if(from.length===2){
                        // month/date yearがないから、すべてのyearに当てはまる。ただし、去年及び今年のもの以外は重要でない。
                        froms.push(new Date(year-1,from[0]-1,from[1]),new Date(year,from[0]-1,from[1]));
                    }
                    _.each(froms,function(fromItem){
                        if(fromItem.getFullYear()>year || fromItem.getFullYear()==year && fromItem.getMonth()>month){
                            //fromよりも明らかに以前
                            fromRes=[];
                        }else if(fromItem.getFullYear()==year&&fromItem.getMonth()==month){
                            //fromの境目あたり。
                            fromRes=allDays();
                            fromRes=fromRes.slice(_.indexOf(fromRes,fromItem.getDate(),true));

                        }else fromRes=allDays();
                        fromReses.push(fromRes);
                    });
                    froms=_.zip(froms,fromReses);// [[from,fromRes],[from,fromRes], ...]
                    _.each(froms,function(item){
                        var from=item[0];
                        var fromRes=item[1];
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
                            //明らかにto以降だからtoResは空
                            toRes=[];
                        }else if(nowTo.getFullYear()==year && nowTo.getMonth()==month){
                            //toがかぶっているであろう時
                            toRes=allDays();
                            toRes=toRes.slice(0,_.lastIndexOf(toRes,nowTo.getDate(),true)+1);//toより前
                        }else toRes=allDays();
                        if(!_.isEmpty(_.intersection(fromRes,toRes))){
                            tmpRes=_.intersection(fromRes,toRes);
                        }
                    });//}}}
                }else{//{{{
                    throw myError('invalid selector "'+key+':'+val);
                }//}}}//}}}
            }else if(key==='date'){//{{{
                if(meansAutumnalEquinoxDay(val)){
                    //1948年以降の秋分
                    //1948年以前は祝日ではなかった
                    if(year<1948||year>2030||year>=1948&&year<=2030&&month!==8){
                        tmpRes=[];
                    }else{
                        tmpRes=[[
                            23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,23,23,23,23,23,23,
                            23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23
                        ][year-1948]];
                    }
                }else if(meansVernalEquinoxDay(val)){
                    //1949年以降の春分の日
                    //1949年以前は祝日ではなかった
                    if(year<1949||year>2030||year>=1949&&year<=2030&&month!==2){
                        tmpRes=[];
                    }else{
                        tmpRes=[[
                            21,21,21,21,21,21,21,21,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,
                            21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,20,21,20,20,20
                        ][year-1949]];
                    }
                }else if(meansFullMoonNight(val)){
                    var Meigetsu=[
                        {date:27},{date:16},{month:9,date:5},{date:24},{date:13},{month:9,date:2},{date:22},{date:10},{date:29},
                        {date:18},{month:9,date:6},{date:25},{date:15},{month:9,date:4},{date:23},{date:12},{date:30},{date:19},
                        {month:9,date:8},{date:26},{date:16},{month:9,date:5},{date:25},{date:13},{month:9,date:2},{date:21},{date:10},
                        {date:28},{date:17},{month:9,date:6},{date:26},{date:15},{month:9,date:4},{date:23},{date:12},{date:30},
                        {date:19},{month:9,date:8},{date:27},{date:16},{month:9,date:5},{date:25},{date:14},{month:9,date:1},{date:20},
                        {date:10},{date:29},{date:17},{month:9,date:6},{date:26},{date:15},{month:9,date:3},{date:22},{date:11},
                        {date:30},{date:19},{date:8},{date:27},{date:17},{month:9,date:5},{date:24},{date:13},{month:9,date:2},
                        {date:20},{date:10},{date:29},{date:18},{month:9,date:6},{date:26},{date:15},{month:9,date:3},{date:22},
                        {date:11},{date:30},{date:20},{date:8},{date:27},{date:17},{month:9,date:5},{date:23},{date:12},
                        {month:9,date:1},{date:21},{date:10},{date:29},{date:18},{month:9,date:7},{date:25},{date:14},{month:9,date:3},
                        {date:22},{date:11},{date:30},{date:20},{date:9},{date:27},{date:16},{month:9,date:5},{date:24},
                        {date:12},{month:9,date:1},{date:21},{date:11},{date:28},{date:18},{month:9,date:6},{date:25},{date:14},
                        {month:9,date:3},{date:22},{date:12},{date:30},{date:19},{date:8},{date:27},{date:15},{month:9,date:4},
                        {date:24},{date:13},{month:9,date:1},{date:21},{date:10},{date:29},{date:17},{month:9,date:6},{date:25},
                        {date:15},{month:9,date:3},{date:22},{date:12}
                    ];
                    if(year<1901||year>2030){
                        tmpRes=[];
                    }else{
                        if((!Meigetsu[year-1901].month&&month===8) || (Meigetsu[year-1901].month===month)){
                            tmpRes=[Meigetsu[year-1901].date];
                        }else{
                            tmpRes=[];
                        }
                    }
                }else{
                    tmpRes=[toInt(val)];
                }
                //}}}
            }else if(key==='month'){//{{{
                if(!monthDic[val.toLowerCase()] && toInt(val)!==month+1 || monthDic[val.toLowerCase()] && monthDic[val.toLowerCase()]!=month)
                    tmpRes=[];//違う月の時
                else
                    tmpRes=allDays();//同じ月の時//}}}
            }else if(key==='day'){//{{{
                if(val.match(/^\d/)){
                    // day:3rd-wed
                    //valが1st-wedといった具合になっている
                    val=val.toLowerCase().match(/^(\d+)(?:st|[nr]d|th)-?(.+)$/);
                    var ordinalNum=toInt(val[1]);
                    tmpRes=[(execSelector('day:'+val[2],year,month)||[])[ordinalNum-1]];
                }else if(val.slice(0,4).toLowerCase()==='last'){
                    // day:last-wed
                    val=val.toLowerCase();
                    var valDay=val.slice(4);//valのlast以降の文字列
                    if(valDay.charAt(0)==='-') valDay=valDay.slice(1);//last-wedの-を取り除く
                    tmpRes=[_.last(execSelector('day:'+valDay,year,month))];
                }else{
                    // day:mon,tue,...
                    var valDay=dayDic[val.toLowerCase()];
                    var dayCount=0;
                    _.some(cal,function(week){
                        if(week[valDay]!==''){
                            tmpRes[tmpRes.length]=week[valDay];
                        }
                    });
                }//}}}
            }else if(key==='year'){//{{{
                if(val==='leap-year'||val==='leap_year'||val==='うるう年'||val==='閏年'){
                    //year: leap-year
                    if(isLeapYear(year)){
                        tmpRes=allDays();
                    }else{
                        tmpRes=[];
                    }
                }else if(toInt(val)!==year){
                    // year:Int
                    tmpRes=[];//違う年
                }else tmpRes=allDays();//}}}
            }else{
                throw myError('undefined key "'+key+'".');
            }
            return tmpRes;
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
                    var operator={' ':'&&', ' and ':'&&', ' かつ ':'&&', ' && ':'&&', ' or ':'||', ' または ':'||', ' || ':'||'};
                    var matchedOperator=selector.substr(i).match(/^ (?:and|&&|かつ|or|\|\||または) |^ /)[0];
                    resPush([operator[matchedOperator],OPERATOR]);
                    start=i+matchedOperator.length;
                    i+=matchedOperator.length;
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
        holiday:holiday,
        disableHoverEvent:IS_SMART_PHONE,
        splitSelector:splitSelector,
        execSelectors:execSelectors
    };
    return res;
};

var appName='rabbit';
function sortByNumber(a,b){
    return a-b;
};
function isValidDate(y,m,d){
    var date=new Date(y,m,d);
    return date.getFullYear()===toInt(y)&&
        date.getMonth()===toInt(m)&&
        date.getDate()===toInt(d);
};
function toInt(n){
    return parseInt(n,10);
};
function toOneByte(str){
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};
function toHiragana(str){
    //配列を用意する
    var hankaku=['ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ','ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾊﾟ','ﾋﾞ','ﾋﾟ','ﾌﾞ','ﾌﾟ','ﾍﾞ','ﾍﾟ','ﾎﾞ','ﾎﾟ','ｳﾞ','ｧ','ｱ','ｨ','ｲ','ｩ','ｳ','ｪ','ｴ','ｫ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ','ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ｯ','ﾂ','ﾃ','ﾄ','ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ','ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ｬ','ﾔ','ｭ','ﾕ','ｮ','ﾖ','ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ','｡','｢','｣','､','･','ｰ','ﾞ','ﾟ'];
    var zenkaku=['ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','パ','ビ','ピ','ブ','プ','ベ','ペ','ボ','ポ','ヴ','ァ','ア','ィ','イ','ゥ','ウ','ェ','エ','ォ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ッ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ャ','ヤ','ュ','ユ','ョ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン','。','「','」','、','・','ー','゛','゜'];
    //変換開始
    str=toOneByte(str);
    for (var i=0;i<=88;i++){//89文字あるのでその分だけ繰り返す
        if(str.indexOf(hankaku[i])>=0){
            str=str.replace(new RegExp(hankaku[i],'g'),zenkaku[i]); //半角カナに対応する全角カナに置換する
        }
    }
    str = str.replace(/[ァ-ン]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });
    return str;
};
function isLeapYear(year){
    return year%400===0||year%4===0&&year%100!==0;
};
function uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
};
angular.module('lodash',[])
.factory('_',function(){
    return _;
});

angular.module(appName,['ngTouch','ngAnimate','ngMaterial','ngMessages','LocalStorageModule','lodash'])
.constant('OVER_MONTH',64)//calendar.calendar()で来月の範囲に入った時に代入される値
.constant('MEMO_LIMIT',1950)//メモを高速化するために添字から引く値。2015よりも65を添え字としたほうが高速。
.constant('IS_SMART_PHONE',(navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0)
.constant('ATTRIBUTE',{
    OPERATOR:0,
    OTHERS:1,
    LPARENTHESES:2,
    RPARENTHESES:3
});

angular.module(appName)
.controller('mainCtrl',['$scope','_','calendar','eventCal','mode','$mdSidenav',function($scope,_,calendar,eventCal,mode,$mdSidenav){//{{{
    $scope._=_;
    $scope.mode=mode;
    mode.editsEvent=false;
    mode.editsGroup=false;
    $scope.splitSelector=calendar.splitSelector;
    $scope.openNav=function(){
        $mdSidenav('left').toggle();
    };
    calendar.selected=calendar.date;
    $scope.eventCalendar=eventCal.eventCalendar;
}])//}}}
.config(['$httpProvider',function ($httpProvider) {//{{{
    $httpProvider.defaults.transformRequest = function(data){
        function serializeData(data) { 
            // If this is not an object, defer to native stringification.
            if (! angular.isObject(data)) {return((data == null) ? "" : data.toString());}
            var buffer = [];
            // Serialize each key in the object.
            for (var name in data) { 
                if (!data.hasOwnProperty(name)) {continue;}
                var value = data[name];
                buffer[buffer.length]=encodeURIComponent(name)+"="+encodeURIComponent((value == null) ? "" : value); 
            }
            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join("&").replace(/%20/g, "+"); 
            return source; 
        }
        if (data === undefined) {return data;}
        return serializeData(data);
    }
    $httpProvider.defaults.headers.post={'Content-Type': 'application/x-www-form-urlencoded'};
}])//}}}
.filter('format',['group','user',function(group,user){//{{{
    return function(event,removeMes){
        event=event.split(':');
        //event[2]はhabit or eventだからこれでok
        var res='';
        if(event[1]=='private'){
            res=user['private'][event[2]][event[0]].name;
        }else{
            if(toInt(event[1])===0&&toInt(event[0])===-1){
                res='[mes]振替休日';
            }else if(toInt(event[1])===0&&toInt(event[0])===-2){
                res='[mes]国民の休日';
            }else{
                res=group[event[1]][event[2]][event[0]].name;
            }
        }
        if(removeMes!==false && res.indexOf('[mes]')===0){
            res=res.replace(/^\[mes\]/,'');
        }
        return res;
    };
}])//}}}
;

angular.module(appName)
.controller('calendarCtrl',['$scope','calendar','mode','MEMO_LIMIT',function($scope,calendar,mode,MEMO_LIMIT){//{{{
    $scope.calendar=calendar;
    $scope.nextMonth=function(){//{{{
        calendar.month++;
        calendar.selected=null;
        if(calendar.month+1>12){
            calendar.year+=1;
            calendar.month-=12;
        }
        mode.editsEvent=false;
    };//}}}
    $scope.lastMonth=function(){//{{{
        calendar.month--;
        calendar.selected=null;
        if(calendar.month+1<1){
            //1月より前==前年の12月だから繰り下げ
            if(calendar.year-1<MEMO_LIMIT){
                alert(MEMO_LIMIT+'年より以前はパフォーマンスの関係で表示できません。');
                //calendar()関数のメモ化の関係
                calendar.month+=1;
            }else{
                calendar.month+=12;
                calendar.year-=1;
            }
        }
        mode.editsEvent=false;
    };//}}}
    $scope.nextYear=function(){//{{{
        calendar.year++;
        calendar.selected=null;
        mode.editsEvent=false;
    };//}}}
    $scope.lastYear=function(){//{{{
        if(calendar.year-1<MEMO_LIMIT){
            alert(MEMO_LIMIT+'年より以前はパフォーマンスの関係で表示できません。');
        }else{
            calendar.year--;
            calendar.selected=null;
        }
        mode.editsEvent=false;
    };//}}}
    $scope.dates=['日','月','火','水','木','金','土'];
}])//}}}
;

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
        if(type==='event' && !isValidDate(eventForm.year,eventForm.month-1,eventForm.date) ){
            $mdToast.show($mdToast.simple().content('入力が不適切です').position('top right').hideDelay(3000));
            //2014/12/32のような時の排除と、null/undefined/'hoge'のようなでたらめな日付を排除するためにこうなっている
            //正常範囲に入っていない
            return;
        }
        if(eventForm.isMessage){
            eventForm.name='[mes]'+eventForm.name;
        }
        var targetGroup;
        if(groupID==='private'){
            if(!user['private'][type][eventID])
                user['private'][type][eventID]={};//eventIDがない==新規追加の時対策
            targetGroup=user['private'][type][eventID];
            user.updated=true;
        }else{
            if(!group[eventForm.selectedGroup][type][eventID])
                group[eventForm.selectedGroup][type][eventID]={};//eventIDがない==新規追加の時対策
            targetGroup=group[eventForm.selectedGroup][type][eventID];
            group[eventForm.selectedGroup].updated=true;
        }
        if(type==='event'){
            targetGroup.year=eventForm.year;
            targetGroup.month=eventForm.month-1;
            targetGroup.date=eventForm.date;
            targetGroup.name=eventForm.name;
        }else if(type==='habit'){
            targetGroup.selector=eventForm.rule;
            targetGroup.name=eventForm.name;
        }
        $mdToast.show($mdToast.simple().content('イベントを追加しました').position('top right').hideDelay(3000));
        mode.editsEvent=false;
        save(eventForm.selectedGroup);
    };//}}}
    $scope.cancel=function(){//{{{
        mode.editsEvent=false;
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

angular.module(appName)
.controller('groupEditorCtrl',['$scope','group','user','groupForm','db','$mdToast','mode',function($scope,group,user,groupForm,db,$mdToast,mode){
    $scope.groupForm=groupForm;
    $scope.user=user;
    groupForm.parentGroup=[null];
    groupForm.mode='add';
    $scope.group=group;
    $scope.finishMakingGroup=function(){mode.editsGroup=false;};
    $scope.addGroup=function(){
        var parentGroup=groupForm.parentGroup.reduce(function(a,b){
            if(a.indexOf(b)===-1) a[a.length]=angular.isNumber(b)?toInt(b):'';
            return a;
        },[]);
        var ele={
            event:[],
            habit:[],
            name:groupForm.name,
            description:groupForm.description,
            updated:true
        }
        if(parentGroup.join('')!==''){
            ele.parents=parentGroup;
        }
        group[group.length]=ele;
        db.post(ele,group.length-1,'insert').success($scope.finishMakingGroup);
        $mdToast.show($mdToast.simple().content('グループ '+groupForm.name+' を作成しました').position('top right').hideDelay(3000));

        groupForm.name='';
        groupForm.description='';
    };
    $scope.cancel=function(){
        mode.editsGroup=false;
    };
}]);

angular.module(appName)
.controller('detailCtrl',['$scope','eventCal','calendar','user','mode',function($scope,eventCal,calendar,user,mode){
    $scope.mode=mode;
    $scope.calendar=calendar;
    $scope.eventCalendar=eventCal.eventCalendar;
    $scope.user=user;
    $scope.isToday=function(){
        return calendar.selected===calendar.today.date && calendar.month===calendar.today.month && calendar.year===calendar.today.year;
    };
}]);

angular.module(appName)
.controller('settingCtrl',['$scope','_','group','user','db','eventListToEdit','groupForm','mode','$mdSidenav','$mdToast','$mdDialog',function($scope,_,group,user,db,eventListToEdit,groupForm,mode,$mdSidenav,$mdToast,$mdDialog){//{{{
    $scope.group=group;
    $scope.user=user;
    $scope.groupForm=groupForm;
    $scope.search_keyword='';
    $scope.searchResult=[];
    $scope.hide=function(id){//{{{
        user.hiddenGroup[user.hiddenGroup.length]=id;
        user.hiddenGroup.sort(sortByNumber);
        user.save();
    };//}}}
    $scope.show=function(id){//{{{
        user.hiddenGroup=_.without($scope.user.hiddenGroup,id);
        user.save();
    };//}}}
    $scope.followsParent=function followsParent(groupID){//{{{
        var parents=parentsList(groupID);
        for(var i=0,j=parents.length;i<j;i++){
            if(!follows(parents[i])){
                return parents[i];
            }
        }
        return true;
    };//}}}
    $scope.toggleNav=function(){
        $mdSidenav('left').close();
    };
    function follows(id){return $scope.user.following.indexOf(id)!==-1;};
    $scope.follows=follows;
    $scope.follow=function(id){//{{{
        //フォロー処理。一応ソートかけておく
        $scope.user.following[$scope.user.following.length]=id;
        $scope.user.following.sort(sortByNumber);
        user.save();
        $mdToast.show($mdToast.simple().content(group[id].name+'をフォローしました').position('top right').hideDelay(3000));


    };//}}}
    $scope.unfollow=function(id){//{{{
        //フォロー解除する。親グループが解除されそうになったら、確認取る。確認取れたら子グループも解除する。確認取れなかったら親の解除もキャンセル
        var unfollowList=[];
        unfollowList[unfollowList.length]=$scope.user.following.indexOf(id);
        for(var i=0,j=$scope.user.following.length;i<j;i++){
            //フォローしているものを回す
            if(group[$scope.user.following[i]].parents){
                //親要素がある
                if(parentsList($scope.user.following[i]).indexOf(id)!=-1){
                    //親にidが含まれている
                    if(!confirm('このグループの子グループ('+group[$scope.user.following[i]].name+')をフォローしています。このグループをフォロー解除するとこちらも解除になります。よろしいですか?')){
                        return;
                    }
                    unfollowList[unfollowList.length]=i;
                }
            }
        }
        unfollowList.sort(function(a,b){return (b-a);});
        for(var i=0,j=unfollowList.length;i<j;i++){
            $scope.user.following.splice(unfollowList[i],1);
        }
        user.save();
    };//}}}
    $scope.showEventList=function(id){
        eventListToEdit.id=id;
        mode.showsEventList=true;
    };
    function parentsList(groupID){
        if(!group[groupID].parents) return [];
        var res=group[groupID].parents;
        for(var i=0,j=group[groupID].parents.length;i<j;i++){
            res=parentsList(group[groupID].parents[i]).concat(res);
        }
        return res;
    }
    $scope.makeGroup=function(){
        mode.editsGroup=true;
        $mdSidenav('left').close();
    };
    $scope.search=function(){//{{{
        //キーワードで検索する。例えば「新潟」で新潟高校がでるみたいな
        var res=[];
        if($scope.search_keyword==''){
            return res;
        }
        if(!group){
            return res;
        }
        var keyword=toHiragana($scope.search_keyword);
        for(var i=0,j=group.length;i<j;i++){
            if(res.length>30) break;
            if(group[i] && (group[i].name && toHiragana(group[i].name).indexOf(keyword)!==-1 || group[i].description && toHiragana(group[i].description).indexOf(keyword)!==-1)){
                res[res.length]=i;
            }
        }
        $scope.searchResult=res;
    };//}}}
    $scope.randomSearch=function(){//{{{
        //ランダム検索
        var res=[];
        if(group.length<5){
            res.push.apply(res,group);
        }else{
            while(res.length<5){
                var elm=(Math.random()*group.length)|0;
                if(_.indexOf(res,elm)===-1){
                    res[res.length]=elm;
                }
            }
        }
        $scope.searchResult=res;
    };//}}}
    $scope.hideAll=function(){//{{{
        user.hiddenGroup.length=0;
        user.hiddenGroup=_.clone(user.following);
        user.hiddenGroup[user.hiddenGroup.length]=-1;//privateのidが-1
        user.hiddenGroup.sort(sortByNumber);
        user.save();
    };//}}}
    $scope.showAll=function(){//{{{
        user.hiddenGroup=[];
        user.save();
    };//}}}
    $scope.importSetting=function(){//{{{
       $mdDialog.show({
           controller:['$scope','$mdDialog',function($scope,$mdDialog){
               $scope.text='';
               $scope.answer=function(answer){
                   $mdDialog.hide(answer);
               };
           }],
           template:'<md-dialog><md-content>コピーしたデータを貼り付けてください。<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'
       }).then(function(value){
           value=JSON.parse(value);
           for(var key in value){
               user[key]=value[key];
           }
           user.save();
       });
    };//}}}
    $scope.exportSetting=function(){
        $mdDialog.show($mdDialog.alert().title('').content('これをコピーして移行先で貼り付けてください。'+angular.toJson(user)).ok('ok'))
    };
}]);//}}}

angular.module(appName)
.controller('eventListCtrl',['$scope','group','user','eventListToEdit','mode',function($scope,group,user,eventListToEdit,mode){//{{{
    $scope.eventListToEdit=eventListToEdit;
    $scope.group=group;
    $scope.user=user;
    if(eventListToEdit.id!=='private'&&eventListToEdit.id!==''){
        $scope.habitList=group[eventListToEdit.id].habit;
        $scope.eventList=group[eventListToEdit.id].event;
    }else{
        $scope.habitList=user['private'].habit;
        $scope.eventList=user['private'].event;
    }
    $scope.mode=mode;
}]);

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
        var res=[]//日付と対応させているイベントカレンダー.フォーマットはcalendar()とは違うから注意
        var groups=_.difference(user.following,user.hiddenGroup);
        if(calendar.year!==yearOfEC||calendar.month!==monthOfEC){
            yearOfEC=calendar.year;
            monthOfEC=calendar.month;
            ECMemo=[];
        }else{
            if(groups.join(',')===beforeGroups && !user.updated && _.every(groups,function(id){return group[id].updated===false;})){
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

angular.module(appName)
.directive('appDate',function(){//{{{
    return {
        scope:{'row':'=appRow'},
        restrict:'A',
        template:'<span class="date"></span>',
        replace:true,
        controller:['$scope','calendar','eventCal','$filter','OVER_MONTH','IS_SMART_PHONE',function($scope,calendar,eventCal,$filter,OVER_MONTH,IS_SMART_PHONE){
            $scope.OVER_MONTH=OVER_MONTH;
            $scope.IS_SMART_PHONE=IS_SMART_PHONE;
            $scope.calendar=calendar;
            var countEvents=function(date){
                var tmpCalendar=eventCal.eventCalendar(date);
                var len=0;
                for(var i=0,i2=tmpCalendar.length;i<i2;i++){
                    if($filter('format')(tmpCalendar[i],false).indexOf('[mes]')!==0){
                        len++;
                    }
                }
                return len<5?len:5;
            };
            $scope.dateClass=function(date){
                if(date!==0&&date!==32){
                    var res=[];
                    if(calendar.selected===date) res[res.length]='selected';
                    res[res.length] = 'booked-' + countEvents(date);
                    if(date===calendar.today.date && calendar.month===calendar.today.month && calendar.year===calendar.today.year){
                        res[res.length]='today';
                    }
                    return res;
                }
                return [];
            };
        }],
        link:function(scope,elm,attrs){
            var date=scope.row[attrs['appDate']];
            function updateClass(){
                elm.removeClass('selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today');
                elm.addClass(scope.dateClass(date).join(' '));
            };
            if(!(date===0 || date===scope.OVER_MONTH || date===undefined)){
                elm.append(angular.element('<span>').addClass('inner').text(date));
                scope.$on('updated',updateClass);
                updateClass();
                elm.on('mouseenter',function(){
                    if(!scope.calendar.disableHoverEvent){
                        if(date){
                            scope.calendar.selected=date;
                            angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                            updateClass();
                            scope.$apply();
                        }
                    }
                });
                elm.on('mouseleave',function(){
                    if(!scope.calendar.disableHoverEvent){
                        scope.calendar.selected=null;
                        angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                        scope.$apply();
                    }
                });
                elm.on('click',function(){
                    if(!scope.IS_SMART_PHONE){
                        if(scope.calendar.selected===date){
                            scope.calendar.disableHoverEvent=!scope.calendar.disableHoverEvent;
                        }else{
                            scope.calendar.disableHoverEvent=true;
                        }
                    }
                    scope.calendar.selected=date;
                    angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                    updateClass();
                    scope.$apply();
                });
            }
        }
    };
})//}}}
.directive('eventItem',function(){//{{{
    return {
        restrict: 'A',
        scope: {event:'=appEvent'},
        template: '<div class="md-item-content event-item" layout="row"><div flex>{{event|format}}</div><div flex><md-button ng-click="mode.switchToEdit(event)">編集</md-button><md-button ng-click="mode.switchToEdit(event,true)">コピー</md-button><md-button ng-click="deleteEvent(event)" ng-if="user.hasPermission(event.split(\':\')[1])">削除</md-button></div></div>',
        replace:true,
        controller: ['$scope','mode','user','db',function($scope,mode,user,db){
            $scope.mode=mode;
            $scope.user=user;
            $scope.deleteEvent=function(event){
                var eventID=event.split(':')[0];
                var groupID=event.split(':')[1];
                var type=event.split(':')[2];
                if(user.hasPermission(groupID)){
                    if(groupID==='private'){
                        user['private'][type].splice(eventID,1);
                        user.updated=true;
                        user.save();
                    }else{
                        group[groupID][type].splice(eventID,1);
                        group[groupID].updated=true;
                        db.post(group[groupID],groupID,'update');
                    }
                }else{
                    return;
                }
            };
        }],
        link: function(scope,elm,attrs){
        }
    };
})//}}}
;

})(window);
