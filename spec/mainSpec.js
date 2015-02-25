'use strict';
describe('test',function(){
    beforeEach(module('rabbit'));
    describe('execSelector()',function(){//{{{
        var year,month;
        var f;
        var eventCal,calendar,OVER_MONTH;
        beforeEach(inject(function(_eventCal_,_calendar_,_OVER_MONTH_){
            eventCal=_eventCal_;
            calendar=_calendar_;
            OVER_MONTH=_OVER_MONTH_;
            // selectors list:'date', 'day', 'is', 'month', 'not', 'range', 'year', 'yesterday'
            year=2012;
            month=2-1;// 2012/2
        }));
        it('date selector',function(){
            expect(eventCal.execSelectors('date:3',year,month)).toEqual([3]);
        });
        it('day selector',function(){
            expect(eventCal.execSelectors('day:wed',year,month)).toEqual([1,8,15,22,29]);
            expect(eventCal.execSelectors('day:2nd-wed',year,month)).toEqual([8]);
            expect(eventCal.execSelectors('day:last-wed',year,month)).toEqual([29]);
        });
        it('is selector',function(){
            expect(eventCal.execSelectors('is:public-holiday',year,month)).toEqual([11]);
        });
        it('month selector',function(){
            var all_days=calendar.calendar(year,month,true);
            expect(eventCal.execSelectors('month:2',year,month)).toEqual(all_days);
            expect(eventCal.execSelectors('month:3',year,month)).toEqual([]);
        });
        it('range selector',function(){
            expect(eventCal.execSelectors('range:'+year+'/2/11..'+year+'/2/14',year,month)).toEqual([11,12,13,14]);//range:y/m/d...y/m/d
            expect(eventCal.execSelectors('range:'+(year+1)+'/2/11..'+(year+1)+'/2/14',year,month)).toEqual([]);//range:y/m/d...y/m/d
            expect(eventCal.execSelectors('range:2/11...2/14',year,month)).toEqual([11,12,13,14]);
            expect(eventCal.execSelectors('range:2/11..2/14',year,month)).toEqual([11,12,13,14]);
            expect(eventCal.execSelectors('range:12/29...1/3',year,12-1)).toEqual([29,30,31]);
            expect(eventCal.execSelectors('range:12/29...1/3',year,1-1)).toEqual([1,2,3]);
        });
        it('year selector',function(){
            var all_days=calendar.calendar(year,month,true);
            expect(eventCal.execSelectors('year:'+(year+1),year,month)).toEqual([]);
            expect(eventCal.execSelectors('year:'+year,year,month)).toEqual(all_days);
            expect(eventCal.execSelectors('year:leap-year',year,month)).toEqual(all_days);
            expect(eventCal.execSelectors('year:leap-year',year+1,month)).toEqual([]);
        });
        it('yesterday selector',function(){
            expect(eventCal.execSelectors('yesterday:date:4',year,month)).toEqual([5]);
        });
    });//}}}
    describe('splitSelector()',function(){//{{{
        var OPERATOR;
        var OTHERS;
        var LPARENTHESES;
        var RPARENTHESES;
        var eventCal;
        beforeEach(inject(function(_eventCal_,_ATTRIBUTE_){
            OPERATOR=_ATTRIBUTE_.OPERATOR;
            OTHERS=_ATTRIBUTE_.OTHERS;
            LPARENTHESES=_ATTRIBUTE_.LPARENTHESES;
            RPARENTHESES=_ATTRIBUTE_.RPARENTHESES;
            eventCal=_eventCal_;
        }));
        it('should attach OTHERS to "key:value"',function(){
            expect(eventCal.splitSelector('key:value')).toEqual([['key:value',OTHERS]]);
        });
        it('should attach OPERATOR to "and"',function(){
            expect(eventCal.splitSelector('key:value かつ key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value && key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value and key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
        });
        it('should attach OPERATOR to "or"',function(){
            expect(eventCal.splitSelector('key:value または key:value')).toEqual([['key:value',OTHERS],['||',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value || key:value')).toEqual([['key:value',OTHERS],['||',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value or key:value')).toEqual([['key:value',OTHERS],['||',OPERATOR],['key:value',OTHERS]]);
        });
        it('should attach LPARENTHESES to "(" and attach RPARENTHESES to ")"',function(){
            expect(eventCal.splitSelector('(key:value and key:value) and key:value')).toEqual([['(',LPARENTHESES],['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS],[')',RPARENTHESES],['&&',OPERATOR],['key:value',OTHERS]]);
        });
    });//}}}
    describe('calendar.calendar()',function(){//{{{

        it('should be real calendar.',inject(function(calendar,OVER_MONTH){
            var c=calendar.calendar(2014,2-1);
            var exp=[[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,OVER_MONTH]];
            expect(c).toEqual(exp);
            expect(JSON.stringify(calendar.calendar(2014,2-1))).toEqual(JSON.stringify([[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,OVER_MONTH]]));
            expect(_.flatten(calendar.calendar(2014,2-1))).toEqual([0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,OVER_MONTH]);
        }));
    });//}}}
    describe('switchToEdit()',function(){//{{{
        it('should initialize eventForm correctly when switching to edit with add mode with date.',inject(function(mode,eventForm){
            mode.switchToEdit(2015,1,14);
            expect(eventForm).toEqual({
                name : '',
                year : 2015,
                month : 2,
                date : 14,
                type : 'event',
                rule : '',
                mode : 'add',
                id : 0
            });
        }));
        it('should initialize eventForm correctly when switching to edit mode with edit event mode.',inject(function(mode,eventForm,group){
            mode.switchToEdit('0:0:event');
            expect(eventForm).toEqual({
                name: group[0].event[0].name.replace(/^\[mes\]/,''),
                year: group[0].event[0].year,
                month: group[0].event[0].month+1,
                date: group[0].event[0].date,
                type: 'event',
                rule: '',
                mode: 'edit',
                id: 0,
                selectedGroup: 0,
                isMessage: true
            });
        }));
        it('should initialize eventForm correctly when switching to edit mode with edit event mode.',inject(function(mode,eventForm,group){
            mode.switchToEdit('0:0:event',true);
            expect(eventForm).toEqual({
                name: group[0].event[0].name.replace(/^\[mes\]/,''),
                year: group[0].event[0].year,
                month: group[0].event[0].month+1,
                date: group[0].event[0].date,
                type: 'event',
                rule: '',
                mode: 'add',
                id: 0,
                selectedGroup: 0,
                isMessage: true
            });
        }));
    });//}}}
    describe('add group',function(){
        var settingScope,groupScope,SettingCtrl,GroupEditorCtrl,$httpBackend;
        beforeEach(inject(function($controller,$rootScope,_$httpBackend_){
            $httpBackend = _$httpBackend_;
            var database='http://www40.atpages.jp/chatblanc/genderC/database.php';

            $httpBackend.whenPOST(database,function(s){return s.indexOf('type=list')!==-1})
            .respond('[{"name":"\\"test group\\"","event":"[]","habit":"[]","id":"1"}]');

            $httpBackend.whenPOST(database,function(s){return s.indexOf('id=2')!==-1;})
            .respond(201,'');

            $httpBackend.whenPOST(database,'type=namelist')
            .respond('[["\\"test group\\"","\\"test group2\\""]]');

            settingScope=$rootScope.$new();
            SettingCtrl=$controller('settingCtrl',{
                $scope:settingScope
            });
            groupScope=$rootScope.$new();
            GroupEditorCtrl=$controller('groupEditorCtrl',{
                $scope:groupScope
            });
        }));
        it('start group making.',inject(function(mode,groupForm,group){
            $httpBackend.flush();
            expect(group.length).toBe(2);

            settingScope.makeAGroup();
            expect(mode.editsGroup).toBe(true);

            groupForm.name='hoge';
            groupScope.addGroup();

            expect(group.length).toBe(3);
            expect(group[2].name).toBe('hoge');
        }));
    });
});
