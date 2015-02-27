function calendar(OVER_MONTH,MEMO_LIMIT,IS_SMART_PHONE){
    if(OVER_MONTH===undefined) OVER_MONTH=64;
    if(MEMO_LIMIT===undefined) MEMO_LIMIT=1950;
    if(IS_SMART_PHONE===undefined) IS_SMART_PHONE=false;
    var today=new Date();
    var memo=[];
    function calendar(year,month,isFlatten){
        isFlatten=isFlatten||false;
        //ここでのmonthはnew Dateを使用するため実際-1されている(=0月から始まっている)
        if(!isFlatten){
            if(memo[year-MEMO_LIMIT]){
                if(memo[year-MEMO_LIMIT][month]){
                    return memo[year-MEMO_LIMIT][month];
                }
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
        }else{
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
        }
        if(row.length>0) res[res.length]=row;
        row=null;
        if(isFlatten){
            return res;
        }else{
            return memo[year-MEMO_LIMIT][month]=res;
        }
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
        disableHoverEvent:IS_SMART_PHONE
    };
    return res;
};
