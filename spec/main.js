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
    it('execSelector',inject(function(eventCal){
        expect(eventCal.execSelectors('is:public-holiday and month:2',2012,1)).toEqual([11]);
    }));
});
