'use strict';
describe('test',function(){
    beforeEach(module('rabbit'));
    describe('execSelector()',function(){
        var year,month;
        var OVER_MONTH=64;
        var f;
        beforeEach(inject(function(){
            // selectors list:'date', 'day', 'is', 'month', 'not', 'range', 'year', 'yesterday'
            year=2012;
            month=2-1;// 2012/2
        }));
        it('date selector',inject(function(eventCal){
            expect(eventCal.execSelectors('day:wed',year,month)).toEqual([1,8,15,22,29]);
        }));
        it('is selector',inject(function(eventCal){
            expect(eventCal.execSelectors('is:public-holiday',year,month)).toEqual([11]);
        }));
        it('month selector',inject(function(eventCal,calF){
            var all_days=_.without(_.flatten(calF.calendar(year,month)),OVER_MONTH);
            expect(eventCal.execSelectors('month:2',year,month)).toEqual(all_days);
            expect(eventCal.execSelectors('month:3',year,month)).toEqual([]);
        }));
        it('range selector',inject(function(eventCal){
            expect(eventCal.execSelectors('range:'+year+'/2/11..'+year+'/2/14',year,month)).toEqual([11,12,13,14]);//range:y/m/d...y/m/d
            expect(eventCal.execSelectors('range:'+(year+1)+'/2/11..'+(year+1)+'/2/14',year,month)).toEqual([]);//range:y/m/d...y/m/d
            expect(eventCal.execSelectors('range:2/11...2/14',year,month)).toEqual([11,12,13,14]);
            expect(eventCal.execSelectors('range:2/11..2/14',year,month)).toEqual([11,12,13,14]);
            expect(eventCal.execSelectors('range:12/29...1/3',year,12-1)).toEqual([29,30,31]);
            expect(eventCal.execSelectors('range:12/29...1/3',year,1-1)).toEqual([1,2,3]);
        }));
        it('year selector',inject(function(eventCal,calF){
            var all_days=_.without(_.flatten(calF.calendar(year,month)),OVER_MONTH);
            expect(eventCal.execSelectors('year:'+(year+1),year,month)).toEqual([]);
            expect(eventCal.execSelectors('year:'+year,year,month)).toEqual(all_days);
            expect(eventCal.execSelectors('year:leap-year',year,month)).toEqual(all_days);
            expect(eventCal.execSelectors('year:leap-year',year+1,month)).toEqual([]);
        }));
        it('yesterday selector',inject(function(eventCal){
            expect(eventCal.execSelectors('yesterday:date:4',year,month)).toEqual([5]);
        }));
    });
    describe('splitSelector()',function(){
        var OPERATOR=0;
        var OTHERS=1;
        var LPARENTHESES=2;
        var RPARENTHESES=3;
        it('should attach OTHERS to "key:value"',inject(function(eventCal){
            expect(eventCal.splitSelector('key:value')).toEqual([['key:value',OTHERS]]);
        }));
        it('should attach OPERATOR to "and"',inject(function(eventCal){
            expect(eventCal.splitSelector('key:value かつ key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value && key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value and key:value')).toEqual([['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS]]);
        }));
        it('should attach OPERATOR to "or"',inject(function(eventCal){
            expect(eventCal.splitSelector('key:value または key:value')).toEqual([['key:value',OTHERS],['||',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value || key:value')).toEqual([['key:value',OTHERS],['||',OPERATOR],['key:value',OTHERS]]);
            expect(eventCal.splitSelector('key:value or key:value')).toEqual([['key:value',OTHERS],['||',OPERATOR],['key:value',OTHERS]]);
        }));
        it('should attach LPARENTHESES to "(" and attach RPARENTHESES to ")"',inject(function(eventCal){
            expect(eventCal.splitSelector('(key:value and key:value) and key:value')).toEqual([['(',LPARENTHESES],['key:value',OTHERS],['&&',OPERATOR],['key:value',OTHERS],[')',RPARENTHESES],['&&',OPERATOR],['key:value',OTHERS]]);
        }));
    });
    describe('calendar.calendar()',function(){
        var OVER_MONTH=64;

        it('should be real calendar.',inject(function(calF){
            var c=calF.calendar(2014,2-1);
            var exp=[[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,OVER_MONTH]];
            exp.year=2014;
            exp.month=1;
            expect(c).toEqual(exp);
            expect(JSON.stringify(calF.calendar(2014,2-1))).toEqual(JSON.stringify([[0,0,0,0,0,0,1],[2,3,4,5,6,7,8],[9,10,11,12,13,14,15],[16,17,18,19,20,21,22],[23,24,25,26,27,28,OVER_MONTH]]));
            expect(_.flatten(calF.calendar(2014,2-1))).toEqual([0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,OVER_MONTH]);
        }));
    });
});
