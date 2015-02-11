'use strict';
describe('execSelector',function(){
    beforeEach(module('rabbit'));
    var MainCtrl,scope;
    var year,month;
    var OVER_MONTH=64;
    beforeEach(inject(function($controller,$rootScope){
        // selectors list:'date', 'day', 'is', 'month', 'not', 'range', 'year', 'yesterday'
        scope=$rootScope.$new();
        MainCtrl=$controller('mainCtrl',{
            $scope:scope
        });
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
    it('date selector',inject(function(eventCal){
        expect(eventCal.execSelectors('yesterday:date:4',year,month)).toEqual([5]);
    }));
});
