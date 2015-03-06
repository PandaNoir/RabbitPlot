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
