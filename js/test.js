describe('mainController', function() {
    var mainScope, $controller,eventScope,detailScope,$filter;

    beforeEach(module(appName));
    beforeEach(inject(['$rootScope','$controller','$filter','$httpBackend',function ($rootScope, $controller,_$filter_,_$httpBackend_) {//{{{
        $httpBackend = _$httpBackend_;
$httpBackend.expectPOST('http://www40.atpages.jp/chatblanc/genderC/database.php',{type:'list'}).respond('[{"id": "2","event": "[{\"name\":\"自主練なし\",\"year\":2014,\"month\":8,\"date\":24,\"group\":2,\"type\":\"event\",\"id\":0},{\"year\":2014,\"month\":10,\"date\":8,\"name\":\"第6回県内審査(無指定)\"},{\"year\":2014,\"month\":9,\"date\":22,\"name\":\"自主練なし\"}]","habit": "[{\"selector\":\"day:wednesday and not:public-holiday and not:name=\\\"自主練なし\\\" and not:name=\\\"前期期末テスト\\\"\",\"name\":\"自主練あり\",\"type\":\"habit\",\"group\":2}]","name": "\"弓道部\"","parents": "[1]","permission": "[]"},{"id": "1","event": "[{\"name\":\"前期期末テスト\",\"year\":2014,\"month\":8,\"date\":24},{\"name\":\"前期期末テスト\",\"year\":2014,\"month\":8,\"date\":26},{\"name\":\"前期期末テスト\",\"year\":2014,\"month\":8,\"date\":29},{\"name\":\"前期期末テスト\",\"year\":2014,\"month\":8,\"date\":30},{\"year\":2014,\"month\":9,\"date\":27,\"name\":\"下越地区弓道大会\",\"group\":1,\"type\":\"event\",\"id\":4},{\"year\":2014,\"month\":9,\"date\":19,\"name\":\"test\",\"group\":1,\"type\":\"event\",\"id\":5},{\"year\":2014,\"month\":9,\"date\":24,\"name\":\"青山祭\",\"group\":1,\"type\":\"event\",\"id\":6},{\"year\":2014,\"month\":9,\"date\":25,\"name\":\"青山祭 (一般公開)\",\"group\":1,\"type\":\"event\",\"id\":7},{\"year\":2014,\"month\":9,\"date\":21,\"name\":\"前振り授業\",\"group\":1,\"type\":\"event\",\"id\":8},{\"year\":2014,\"month\":10,\"date\":8,\"name\":\"進研模試\",\"group\":1,\"type\":\"event\",\"id\":9},{\"year\":2014,\"month\":10,\"date\":7,\"name\":\"後期小中間考査\"}]","habit": "[{\"selector\":\"date;Wednesday\",\"name\":\"LHR\",\"type\":\"habit\",\"group\":1}]","name": "\"新潟高校\"","permission": "[]"},{"id": "0","event": "[{\"name\":\"春分の日\",\"year\":2000,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2000,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2001,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2001,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2002,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2002,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2003,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2003,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2004,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2004,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2005,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2005,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2006,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2006,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2007,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2007,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2008,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2008,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2009,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2009,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2010,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2010,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2011,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2011,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2012,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2012,\"month\":8,\"date\":22},{\"name\":\"春分の日\",\"year\":2013,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2013,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2014,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2014,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2015,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2015,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2016,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2016,\"month\":8,\"date\":22},{\"name\":\"春分の日\",\"year\":2017,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2017,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2018,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2018,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2019,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2019,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2020,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2020,\"month\":8,\"date\":22},{\"name\":\"春分の日\",\"year\":2021,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2021,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2022,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2022,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2023,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2023,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2024,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2024,\"month\":8,\"date\":22},{\"name\":\"春分の日\",\"year\":2025,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2025,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2026,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2026,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2027,\"month\":2,\"date\":21},{\"name\":\"秋分の日\",\"year\":2027,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2028,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2028,\"month\":8,\"date\":22},{\"name\":\"春分の日\",\"year\":2029,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2029,\"month\":8,\"date\":23},{\"name\":\"春分の日\",\"year\":2030,\"month\":2,\"date\":20},{\"name\":\"秋分の日\",\"year\":2030,\"month\":8,\"date\":23},{\"name\":\"十五夜\",\"year\":2000,\"month\":8,\"date\":12},{\"name\":\"十五夜\",\"year\":2001,\"month\":9,\"date\":1},{\"name\":\"十五夜\",\"year\":2002,\"month\":8,\"date\":21},{\"name\":\"十五夜\",\"year\":2003,\"month\":8,\"date\":11},{\"name\":\"十五夜\",\"year\":2004,\"month\":8,\"date\":28},{\"name\":\"十五夜\",\"year\":2005,\"month\":8,\"date\":18},{\"name\":\"十五夜\",\"year\":2006,\"month\":9,\"date\":6},{\"name\":\"十五夜\",\"year\":2007,\"month\":8,\"date\":25},{\"name\":\"十五夜\",\"year\":2008,\"month\":8,\"date\":14},{\"name\":\"十五夜\",\"year\":2009,\"month\":9,\"date\":3},{\"name\":\"十五夜\",\"year\":2010,\"month\":8,\"date\":22},{\"name\":\"十五夜\",\"year\":2011,\"month\":8,\"date\":12},{\"name\":\"十五夜\",\"year\":2012,\"month\":8,\"date\":30},{\"name\":\"十五夜\",\"year\":2013,\"month\":8,\"date\":19},{\"name\":\"十五夜\",\"year\":2014,\"month\":8,\"date\":8},{\"name\":\"十五夜\",\"year\":2015,\"month\":8,\"date\":27},{\"name\":\"十五夜\",\"year\":2016,\"month\":8,\"date\":15}]","habit": "[{\"name\":\"元旦\",\"selector\":\"month:1,date:1\"},{\"name\":\"成人の日\",\"selector\":\"month:1,day:2nd-mon\"},{\"name\":\"昭和の日\",\"selector\":\"month:4,date:29\"},{\"name\":\"建国記念日\",\"selector\":\"month:2,date:11\"},{\"name\":\"憲法記念日\",\"selector\":\"month:5,date:3\"},{\"name\":\"みどりの日\",\"selector\":\"month:5,date:4\"},{\"name\":\"こどもの日\",\"selector\":\"month:5,date:5\"},{\"name\":\"海の日\",\"selector\":\"month:7,day:3rd-mon\"},{\"name\":\"敬老の日\",\"selector\":\"month:9,day:3rd-mon\"},{\"name\":\"体育の日\",\"selector\":\"month:10,day:2nd-mon\"},{\"name\":\"文化の日\",\"selector\":\"month:11,date:3\"},{\"name\":\"勤労感謝の日\",\"selector\":\"month:11,date:23\"},{\"name\":\"天皇誕生日\",\"selector\":\"month:12,date:23\"}]","name": "\"休日\"","permission": "[]"}]');//{{{//}}}
$httpBackend.expectPOST('http://www40.atpages.jp/chatblanc/genderC/database.php',{type:'namelist'}).respond('[["\"休日\"","\"新潟高校\"","\"弓道部\"","\"弓道部男子\"","\"繰繰れ! コックリさん\"","\"デンキ街の本屋さん\"","\"旦那が何を言っているかわからない件\"","\"曇天に笑う\"","\"新潟高校2年5組\""],["","","[1]","[2]","","","","","[1]"]]');//{{{//}}}
        mainScope=$rootScope.$new();
        $controller('mainController',{'$scope':mainScope});
        eventScope=mainScope.$new();
        $controller('eventEditor',{'$scope':eventScope});
        detailScope=mainScope.$new();
        $controller('detail',{'$scope':detailScope});
        $filter=_$filter_;
        eventScope.user.following=[0,1,2];
    }]));//}}}

    it('split selectors', function() {//{{{
        expect(mainScope.splitSelector('month:10,day:fri,date:13 day:wed,date:2')[0]).toEqual(mainScope.splitSelector('month:10,day:fri and date:13 or day:wed,date:2')[0]);
        expect(mainScope.splitSelector('month:10 かつ day:fri かつ date:13 または day:wed かつ date:2')[0]).toEqual(mainScope.splitSelector('month:10,day:fri and date:13 or day:wed,date:2')[0]);
    });//}}}

    it('event editor test',function(){//{{{
        detailScope.switchToEdit(mainScope.calF.year,mainScope.calF.month,mainScope.calF.selected);//clicked "+" button.
        expect(eventScope.eventForm.isEditMode).toBe(true);

        eventScope.eventForm.year=2014;
        eventScope.eventForm.month=12;//これはフォームに入力されたと想定されているため、プログラム内とは違い実際と同じ数字。そのため12月となる
        eventScope.eventForm.date=20;
        eventScope.eventForm.name='test'+(0|Math.random()*100);
        eventScope.eventForm.selectedGroup='private';
        eventScope.eventForm.type='event';
        eventScope.addEvent();

        eventScope.calF.year=eventScope.eventForm.year;
        eventScope.calF.month=eventScope.eventForm.month-1;
        var eventList=eventScope.eventCalendar(eventScope.eventForm.date);
        for(var i=0,j=eventList.length;i<j;i++){
            console.log($filter('format')(eventList[i]));
        }
        localStorage.clear();
    });//}}}
    it('春分の日',function(){//{{{
        eventScope.calF.year=2000;
        eventScope.calF.month=2;
        var eventList=eventScope.eventCalendar(20);
        testEvent('春分の日',[
            {year:2000,month:2,date:20},{year:2001,month:2,date:20},
            {year:2002,month:2,date:21},{year:2003,month:2,date:21},
            {year:2004,month:2,date:20},{year:2005,month:2,date:20},
            {year:2006,month:2,date:21},{year:2007,month:2,date:21},
            {year:2008,month:2,date:20},{year:2009,month:2,date:20},
            {year:2010,month:2,date:21},{year:2011,month:2,date:21},
            {year:2012,month:2,date:20},{year:2013,month:2,date:20},
            {year:2014,month:2,date:21},{year:2015,month:2,date:21},
            {year:2016,month:2,date:20},{year:2017,month:2,date:20},
            {year:2018,month:2,date:21},{year:2019,month:2,date:21},
            {year:2020,month:2,date:20},{year:2021,month:2,date:20},
            {year:2022,month:2,date:21},{year:2023,month:2,date:21},
            {year:2024,month:2,date:20},{year:2025,month:2,date:20},
            {year:2026,month:2,date:20},{year:2027,month:2,date:21},
            {year:2028,month:2,date:20},{year:2029,month:2,date:20},
            {year:2030,month:2,date:20}
        ]);
    });//}}}
    it('秋分の日',function(){//{{{
        testEvent('秋分の日',[
            {year:2000,month:8,date:23},{year:2001,month:8,date:23},
            {year:2002,month:8,date:23},{year:2003,month:8,date:23},
            {year:2004,month:8,date:23},{year:2005,month:8,date:23},
            {year:2006,month:8,date:23},{year:2007,month:8,date:23},
            {year:2008,month:8,date:23},{year:2009,month:8,date:23},
            {year:2010,month:8,date:23},{year:2011,month:8,date:23},
            {year:2012,month:8,date:22},{year:2013,month:8,date:23},
            {year:2014,month:8,date:23},{year:2015,month:8,date:23},
            {year:2016,month:8,date:22},{year:2017,month:8,date:23},
            {year:2018,month:8,date:23},{year:2019,month:8,date:23},
            {year:2020,month:8,date:22},{year:2021,month:8,date:23},
            {year:2022,month:8,date:23},{year:2023,month:8,date:23},
            {year:2024,month:8,date:22},{year:2025,month:8,date:23},
            {year:2026,month:8,date:23},{year:2027,month:8,date:23},
            {year:2028,month:8,date:22},{year:2029,month:8,date:23},
            {year:2030,month:8,date:23}
        ]);
    });//}}}
    it('十五夜',function(){//{{{
        testEvent('十五夜',[
            {name:'十五夜',year:2000,month:8,date:12},{name:'十五夜',year:2001,month:9,date:1},
            {name:'十五夜',year:2002,month:8,date:21},{name:'十五夜',year:2003,month:8,date:11},
            {name:'十五夜',year:2004,month:8,date:28},{name:'十五夜',year:2005,month:8,date:18},
            {name:'十五夜',year:2006,month:9,date:6},{name:'十五夜',year:2007,month:8,date:25},
            {name:'十五夜',year:2008,month:8,date:14},{name:'十五夜',year:2009,month:9,date:3},
            {name:'十五夜',year:2010,month:8,date:22},{name:'十五夜',year:2011,month:8,date:12},
            {name:'十五夜',year:2012,month:8,date:30},{name:'十五夜',year:2013,month:8,date:19},
            {name:'十五夜',year:2014,month:8,date:8},{name:'十五夜',year:2015,month:8,date:27},
            {name:'十五夜',year:2016,month:8,date:15}
        ]);
    });//}}}
    it('元旦',function(){//{{{
        testHabitByDate('元旦',{month:1,date:1});
    });
    it('昭和の日',function(){
        testHabitByDate('昭和の日',{month:4,date:29})
    });
    it('建国記念日',function(){
        testHabitByDate('建国記念日',{month:2,date:11});
    });
    it('憲法記念日',function(){
        testHabitByDate('憲法記念日',{month:5,date:3});
    });
    it('みどりの日',function(){
        testHabitByDate('みどりの日',{month:5,date:4});
    });
    it('こどもの日',function(){
        testHabitByDate('こどもの日',{month:5,date:5});
    });
    it('文化の日',function(){
        testHabitByDate('文化の日',{month:11,date:3});
    });
    it('勤労感謝の日',function(){
        testHabitByDate('勤労感謝の日',{month:11,date:23});
    });
    it('天皇誕生日',function(){
        testHabitByDate('天皇誕生日',{month:12,date:23});
    });
    it('成人の日',function(){
        testHabitByDay('成人の日',{month:1,ordinal:2,day:'mon'});
    });
    it('海の日',function(){
        testHabitByDay('海の日',{month:7,ordinal:3,day:'mon'});
    });
    it('敬老の日',function(){
        testHabitByDay('敬老の日',{month:9,ordinal:3,day:'mon'});
    });
    it('体育の日',function(){
        testHabitByDay('体育の日',{month:10,ordinal:2,day:'mon'});
    });//}}}
    function testEvent(name,date){
        for(var ii=0,jj=date.length;ii<jj;ii++){
            eventScope.calF.year=date[ii].year;
            eventScope.calF.month=date[ii].month;
            var eventList=eventScope.eventCalendar(date[ii].date);
            var flag='bad';
            syunbun:for(var i=0,j=eventList.length;i<j;i++){
                eventList[i]=$filter('format')(eventList[i]);
                if(eventList[i]===name){
                    flag='ok';
                    break syunbun;
                }
            }
            expect(flag).toBe('ok');
        }
    }
    function testHabitByDate(name,date){
        for(var ii=1970;ii<2100;ii++){
            eventScope.calF.year=ii;
            eventScope.calF.month=date.month-1;
            var eventList=eventScope.eventCalendar(date.date);
            var flag='bad';
            syunbun:for(var i=0,j=eventList.length;i<j;i++){
                if($filter('format')(eventList[i])===name){
                    flag='ok';
                    break syunbun;
                }
            }
            expect(flag).toBe('ok');
        }
    }
    function testHabitByDay(name,date){
        //{month:1,ordinal:2,day:'mon'}
        date.day={'sunday':0,'sun':0,'日曜日':0,'monday':1,'mon':1,'月曜日':1,'tuesday':2,'tue':2,'火曜日':2,'wednesday':3,'wed':3,'水曜日':3,'thursday':4,'thu':4,'木曜日':4,'friday':5,'fri':5,'金曜日':5,'saturday':6,'sat':6,'土曜日':6}[date.day];
        for(var year=1970;year<2100;year++){
            eventScope.calF.year=year;
            eventScope.calF.month=date.month-1;
            var cal=mainScope.calF.calendar(year,date.month-1);
            for(var week=0,count=0;cal[week]&&cal[week][date.day]||week==0;week++){
                if(cal[week][date.day]){
                    count++;
                }
                var eventList=eventScope.eventCalendar(cal[week][date.day]);
                var flag='bad';
                syunbun:for(var i=0,j=eventList.length;i<j;i++){
                    if($filter('format')(eventList[i])===name){
                        flag='ok';
                        break syunbun;
                    }
                }
                if(count==date.ordinal){
                    expect(flag).toBe('ok');
                }else{
                    expect(flag).toBe('bad');
                }
            }
        }
    }
});
