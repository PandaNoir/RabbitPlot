angular.module(appName)
.factory('group',function(){
    return [{
        eventList:[
            {name:'春分の日',year:'2000',month:'3',date:'20'},{name:'秋分の日',year:'2000',month:'9',date:'23'},
            {name:'春分の日',year:'2001',month:'3',date:'20'},{name:'秋分の日',year:'2001',month:'9',date:'23'},
            {name:'春分の日',year:'2002',month:'3',date:'21'},{name:'秋分の日',year:'2002',month:'9',date:'23'},
            {name:'春分の日',year:'2003',month:'3',date:'21'},{name:'秋分の日',year:'2003',month:'9',date:'23'},
            {name:'春分の日',year:'2004',month:'3',date:'20'},{name:'秋分の日',year:'2004',month:'9',date:'23'},
            {name:'春分の日',year:'2005',month:'3',date:'20'},{name:'秋分の日',year:'2005',month:'9',date:'23'},
            {name:'春分の日',year:'2006',month:'3',date:'21'},{name:'秋分の日',year:'2006',month:'9',date:'23'},
            {name:'春分の日',year:'2007',month:'3',date:'21'},{name:'秋分の日',year:'2007',month:'9',date:'23'},
            {name:'春分の日',year:'2008',month:'3',date:'20'},{name:'秋分の日',year:'2008',month:'9',date:'23'},
            {name:'春分の日',year:'2009',month:'3',date:'20'},{name:'秋分の日',year:'2009',month:'9',date:'23'},
            {name:'春分の日',year:'2010',month:'3',date:'21'},{name:'秋分の日',year:'2010',month:'9',date:'23'},
            {name:'春分の日',year:'2011',month:'3',date:'21'},{name:'秋分の日',year:'2011',month:'9',date:'23'},
            {name:'春分の日',year:'2012',month:'3',date:'20'},{name:'秋分の日',year:'2012',month:'9',date:'22'},
            {name:'春分の日',year:'2013',month:'3',date:'20'},{name:'秋分の日',year:'2013',month:'9',date:'23'},
            {name:'春分の日',year:'2014',month:'3',date:'21'},{name:'秋分の日',year:'2014',month:'9',date:'23'},
            {name:'春分の日',year:'2015',month:'3',date:'21'},{name:'秋分の日',year:'2015',month:'9',date:'23'},
            {name:'春分の日',year:'2016',month:'3',date:'20'},{name:'秋分の日',year:'2016',month:'9',date:'22'},
            {name:'春分の日',year:'2017',month:'3',date:'20'},{name:'秋分の日',year:'2017',month:'9',date:'23'},
            {name:'春分の日',year:'2018',month:'3',date:'21'},{name:'秋分の日',year:'2018',month:'9',date:'23'},
            {name:'春分の日',year:'2019',month:'3',date:'21'},{name:'秋分の日',year:'2019',month:'9',date:'23'},
            {name:'春分の日',year:'2020',month:'3',date:'20'},{name:'秋分の日',year:'2020',month:'9',date:'22'},
            {name:'春分の日',year:'2021',month:'3',date:'20'},{name:'秋分の日',year:'2021',month:'9',date:'23'},
            {name:'春分の日',year:'2022',month:'3',date:'21'},{name:'秋分の日',year:'2022',month:'9',date:'23'},
            {name:'春分の日',year:'2023',month:'3',date:'21'},{name:'秋分の日',year:'2023',month:'9',date:'23'},
            {name:'春分の日',year:'2024',month:'3',date:'20'},{name:'秋分の日',year:'2024',month:'9',date:'22'},
            {name:'春分の日',year:'2025',month:'3',date:'20'},{name:'秋分の日',year:'2025',month:'9',date:'23'},
            {name:'春分の日',year:'2026',month:'3',date:'20'},{name:'秋分の日',year:'2026',month:'9',date:'23'},
            {name:'春分の日',year:'2027',month:'3',date:'21'},{name:'秋分の日',year:'2027',month:'9',date:'23'},
            {name:'春分の日',year:'2028',month:'3',date:'20'},{name:'秋分の日',year:'2028',month:'9',date:'22'},
            {name:'春分の日',year:'2029',month:'3',date:'20'},{name:'秋分の日',year:'2029',month:'9',date:'23'},
            {name:'春分の日',year:'2030',month:'3',date:'20'},{name:'秋分の日',year:'2030',month:'9',date:'23'}
        ],
        habit:[
            {name:'元旦',selector:'month:1,date:1'},
            {name:'成人の日',selector:'month:1,day:2nd-mon'},
            {name:'昭和の日',selector:'month:4,date:29'},
            {name:'建国記念日',selector:'month:2,date:11'},
            {name:'憲法記念日',selector:'month:5,date:3'},
            {name:'みどりの日',selector:'month:5,date:4'},
            {name:'こどもの日',selector:'month:5,date:5'},
            {name:'海の日',selector:'month:7,day:3rd-mon'},
            {name:'敬老の日',selector:'month:9,day:3rd-mon'},
            {name:'体育の日',selector:'month:10,day:2nd-mon'},
            {name:'文化の日',selector:'month:11,date:3'},
            {name:'勤労感謝の日',selector:'month:11,date:23'},
            {name:'天皇誕生日',selector:'month:12,date:23'},
            {name:'13日の金曜日',selector:'day:fri,date:13'}
        ],
        name:'休日',
        updpated:true
    },
    {
        eventList:[{name:'前期期末テスト',year:2014,month:8,date:24},{name:'前期期末テスト',year:2014,month:8,date:26}, {name:'前期期末テスト',year:2014,month:8,date:29}, {name:'前期期末テスト',year:2014,month:8,date:30}],
        habit:[],
        name:'新潟高校',
        updpated:true
    },
    {
        eventList:[{name:'自主練なし',year:2014,month:8,date:24}],
        habit:[{selector:'day:wednesday,not:public-holiday,not:name="自主練なし",not:name="前期期末テスト"',name:'自主練あり'}],
        name:'弓道部',
        parents:[1],
        updpated:true
    },
    {
        eventList:[],
        habit:[],
        name:'弓道部男子',
        parents:[2],
        updpated:true
    }];
})
.factory('user',function(){
    function getCookie(c_name){
        var st="";
        var ed="";
        if(document.cookie.length>0){
            // クッキーの値を取り出す
            st=document.cookie.indexOf(c_name + "=");
            if(st!=-1){
                st=st+c_name.length+1;
                ed=document.cookie.indexOf(";",st);
                if(ed==-1) ed=document.cookie.length;
                // 値をデコードして返す
                return unescape(document.cookie.substring(st,ed));
            }
        }
        return "";
    }
    if(getCookie('private')){
        return JSON.parse(getCookie('private'));
    }
    return {
        name:'クロパンダ',
        following:[0,1,2,3],
        private:{
            eventList:[],
            habit:[],
            name:'プライベート'
        }
    };
})
.factory('eventForm',function(){
    return {
        isEditMode:false,
        name:'',
        year:(new Date()).getFullYear(),
        month:(new Date()).getMonth()+1,
        date:(new Date()).getDate(),
        type:'event',
        rule:''
    };
})
.factory('groupForm',function(){
    return {
        name:''
    };
});
