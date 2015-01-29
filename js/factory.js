angular.module(appName)
.factory('user',['$rootScope',function($rootScope){//{{{
    if(localStorage&&angular.fromJson(localStorage.getItem('private'))){
        var user=angular.fromJson(localStorage.getItem('private'));
        user.isHiddenGroup=function(id){
            return _.indexOf(this.hiddenGroup,id,true)!==-1;
        };
        user.save=function(){
            $rootScope.$broadcast('updated');
            localStorage.setItem('private',angular.toJson(this));
        };
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
            isHiddenGroup:function(id){
                return _.indexOf(this.hiddenGroup,id,true)!==-1;
            },
            save:function(){
                $rootScope.$broadcast('updated');
                localStorage.setItem('private',angular.toJson(this));
            }
        };
    }
    user.save();
    return user;
}])//}}}
.factory('eventForm',function(){//{{{
    return {
        isEditMode:false,
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
        isEditMode:false,
        name:''
    };
})//}}}
.factory('group',['$http',function($http){//{{{
    var o=[{//{{{
        id:0,
        event:[
            {name:'[mes]春分の日',year:2000,month:2,date:20},{name:'[mes]秋分の日',year:2000,month:8,date:23},
            {name:'[mes]春分の日',year:2001,month:2,date:20},{name:'[mes]秋分の日',year:2001,month:8,date:23},
            {name:'[mes]春分の日',year:2002,month:2,date:21},{name:'[mes]秋分の日',year:2002,month:8,date:23},
            {name:'[mes]春分の日',year:2003,month:2,date:21},{name:'[mes]秋分の日',year:2003,month:8,date:23},
            {name:'[mes]春分の日',year:2004,month:2,date:20},{name:'[mes]秋分の日',year:2004,month:8,date:23},
            {name:'[mes]春分の日',year:2005,month:2,date:20},{name:'[mes]秋分の日',year:2005,month:8,date:23},
            {name:'[mes]春分の日',year:2006,month:2,date:21},{name:'[mes]秋分の日',year:2006,month:8,date:23},
            {name:'[mes]春分の日',year:2007,month:2,date:21},{name:'[mes]秋分の日',year:2007,month:8,date:23},
            {name:'[mes]春分の日',year:2008,month:2,date:20},{name:'[mes]秋分の日',year:2008,month:8,date:23},
            {name:'[mes]春分の日',year:2009,month:2,date:20},{name:'[mes]秋分の日',year:2009,month:8,date:23},
            {name:'[mes]春分の日',year:2010,month:2,date:21},{name:'[mes]秋分の日',year:2010,month:8,date:23},
            {name:'[mes]春分の日',year:2011,month:2,date:21},{name:'[mes]秋分の日',year:2011,month:8,date:23},
            {name:'[mes]春分の日',year:2012,month:2,date:20},{name:'[mes]秋分の日',year:2012,month:8,date:22},
            {name:'[mes]春分の日',year:2013,month:2,date:20},{name:'[mes]秋分の日',year:2013,month:8,date:23},
            {name:'[mes]春分の日',year:2014,month:2,date:21},{name:'[mes]秋分の日',year:2014,month:8,date:23},
            {name:'[mes]春分の日',year:2015,month:2,date:21},{name:'[mes]秋分の日',year:2015,month:8,date:23},
            {name:'[mes]春分の日',year:2016,month:2,date:20},{name:'[mes]秋分の日',year:2016,month:8,date:22},
            {name:'[mes]春分の日',year:2017,month:2,date:20},{name:'[mes]秋分の日',year:2017,month:8,date:23},
            {name:'[mes]春分の日',year:2018,month:2,date:21},{name:'[mes]秋分の日',year:2018,month:8,date:23},
            {name:'[mes]春分の日',year:2019,month:2,date:21},{name:'[mes]秋分の日',year:2019,month:8,date:23},
            {name:'[mes]春分の日',year:2020,month:2,date:20},{name:'[mes]秋分の日',year:2020,month:8,date:22},
            {name:'[mes]春分の日',year:2021,month:2,date:20},{name:'[mes]秋分の日',year:2021,month:8,date:23},
            {name:'[mes]春分の日',year:2022,month:2,date:21},{name:'[mes]秋分の日',year:2022,month:8,date:23},
            {name:'[mes]春分の日',year:2023,month:2,date:21},{name:'[mes]秋分の日',year:2023,month:8,date:23},
            {name:'[mes]春分の日',year:2024,month:2,date:20},{name:'[mes]秋分の日',year:2024,month:8,date:22},
            {name:'[mes]春分の日',year:2025,month:2,date:20},{name:'[mes]秋分の日',year:2025,month:8,date:23},
            {name:'[mes]春分の日',year:2026,month:2,date:20},{name:'[mes]秋分の日',year:2026,month:8,date:23},
            {name:'[mes]春分の日',year:2027,month:2,date:21},{name:'[mes]秋分の日',year:2027,month:8,date:23},
            {name:'[mes]春分の日',year:2028,month:2,date:20},{name:'[mes]秋分の日',year:2028,month:8,date:22},
            {name:'[mes]春分の日',year:2029,month:2,date:20},{name:'[mes]秋分の日',year:2029,month:8,date:23},
            {name:'[mes]春分の日',year:2030,month:2,date:20},{name:'[mes]秋分の日',year:2030,month:8,date:23},

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
        if(month===1 && (year%400==0 || year%100!=0 && year%4==0)){
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
                        res[row][res[row].length]=32;//来月の範囲
                    }
                }else{
                    res[row][res[row].length]=0;//今月の範囲
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
.run(['$timeout',function($timeout){//{{{
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
        $scope.calF.today.year=today.getFullYear();
        $scope.calF.today.month=today.getMonth();
        $scope.calF.today.date=today.getDate();
        $timeout(setTomorrow,tomorrow-(new Date()));
    }
    $timeout(setTomorrow,tomorrow-(new Date()));
}])//}}}
.factory('db',['group','user','$http','$rootScope',function(group,user,$http,$rootScope){//{{{
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
        for(var key in o) o[key]=angular.toJson(o[key]);
        o.type=type;
        $rootScope.$broadcast('updated');
        return $http.post(database,o).success(function(mes){
            console.log('updated');
            console.log(mes);
        }).error(function(mes){
            console.log(mes);
        });
    };
    function list(){
        //データベースから指定idのデータを取得する
        return $http.post(database,{type:'list',groupID:user.following.join(',')}).success(function(data){return data}).error(function(mes){
            console.log(mes);
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
}]);//}}}
