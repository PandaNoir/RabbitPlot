'use strict';
describe('',function(){
    beforeEach(module('rabbit'));
    var MainCtrl,scope;
    beforeEach(inject(function($controller,$rootScope){
        scope=$rootScope.$new();
        MainCtrl=$controller('mainCtrl',{
            $scope:scope
        });
    }));
    it('execSelector',inject(function(eventCal,calF){
        var year=2012,month=2-1;// 2012/2
        var OVER_MONTH=64;
        var all_days=_.without(_.flatten(calF.calendar(year,month)),OVER_MONTH);
        // selectors list:'date', 'day', 'is', 'month', 'not', 'range', 'year', 'yesterday'
        var testCase=[
            {selector:'date:29',answer:[29]},
            {selector:'day:wed',answer:[1,8,15,22,29]},
            {selector:'is:public-holiday and month:2',answer:[11]},
            {selector:'month:2',answer:all_days},
            {selector:'month:3',answer:[]},
            {selector:'range:'+(year+1)+'/2/11..'+(year+1)+'/2/14',answer:[]},
            {selector:'range:'+year+'/2/11..'+year+'/2/14',answer:[11,12,13,14]},
            {selector:'range:2/11...2/14',answer:[11,12,13,14]},
            {selector:'range:2/11..2/14',answer:[11,12,13,14]},
            {selector:'year:'+(year+1),answer:[]},
            {selector:'year:'+year,answer:all_days},
            {selector:'year:leap-year',answer:all_days},
            {selector:'year:leap-year',year:year+1,answer:[]},
            {selector:'yesterday:date:4',answer:[5]},
        ];
        for(var i=0,j=testCase.length;i<j;i++){
            expect(eventCal.execSelectors(testCase[i].selector,testCase[i].year||year,testCase[i].month||month)).toEqual(testCase[i].answer);
        }
    }));
});
