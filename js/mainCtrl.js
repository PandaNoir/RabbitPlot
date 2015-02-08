var appName='rabbit';
var MEMO_LIMIT=1950;//メモを高速化するために添字から引く値。2015よりも65を添え字としたほうが高速。
var isSmartPhone=((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0);
function sortByNumber(a,b){
    return a-b;
};
function toInt(n){
    return parseInt(n,10);
};
function toOneByte(str){
    str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};

angular.module(appName,['ngTouch','ngAnimate','ngMaterial','ngMessages'])
.controller('mainCtrl',['$scope','_','calF','eventCal','mode','$mdSidenav',function($scope,_,calF,eventCal,mode,$mdSidenav){//{{{
    console.log(mode,$mdSidenav);
    $scope._=_;
    $scope.mode=mode;
    mode.editsEventForm=false;
    mode.editsGroupForm=false;
    $scope.splitSelector=eventCal.splitSelector;
    $scope.openNav=function(){
        $mdSidenav('left').toggle();
    };
    calF.selected=calF.date;
    $scope.eventCalendar=eventCal.eventCalendar;
}])//}}}
.config(['$httpProvider',function ($httpProvider) {//{{{
    $httpProvider.defaults.transformRequest = function(data){
        function serializeData(data) { 
            // If this is not an object, defer to native stringification.
            if (! angular.isObject(data)) {return((data == null) ? "" : data.toString());}
            var buffer = [];
            // Serialize each key in the object.
            for (var name in data) { 
                if (!data.hasOwnProperty(name)) {continue;}
                var value = data[name];
                buffer[buffer.length]=encodeURIComponent(name)+"="+encodeURIComponent((value == null) ? "" : value); 
            }
            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join("&").replace(/%20/g, "+"); 
            return source; 
        }
        if (data === undefined) {return data;}
        return serializeData(data);
    }
    $httpProvider.defaults.headers.post={'Content-Type': 'application/x-www-form-urlencoded'};
}])//}}}
.filter('format',['group','user',function(group,user){//{{{
    return function(event,removeMes){
        event=event.split(':');
        //event[2]はhabit or eventだからこれでok
        var res='';
        if(event[1]=='private'){
            res=user['private'][event[2]][event[0]].name;
        }else{
            res=group[event[1]][event[2]][event[0]].name;
        }
        if(removeMes!==false && res.indexOf('[mes]')===0){
            res=res.replace(/^\[mes\]/,'');
        }
        return res;
    };
}])//}}}
.run(['db','group','$rootScope',function(db,group,$rootScope){//{{{
    var o=_.clone(group)[0];
    if(localStorage&&localStorage.getItem('group')){
        group.length=0;
        Array.prototype.push.apply(group,angular.fromJson(localStorage.getItem('group')));
        group[0]=_.clone(o);
    }
    db.list().then(function(mes){
        mes=mes.data;
        for(var i=0,i2=mes.length;i<i2;i++){
            for(var key in mes[i]){
                mes[i][key]=angular.fromJson(mes[i][key]);
            }
            mes[i].updated=true;
        }
        mes.sort(function(a,b){return a.id-b.id});
        group.length=0;
        for(var i=0,i2=mes.length;i<i2;i++){
            group[mes[i].id]=mes[i];
        }
        group[0]=_.clone(o);
        $rootScope.$broadcast('updated');
        localStorage.setItem('group',angular.toJson(group));
        db.getNameList().then(function(mes){
            for(var i=0,i2=mes.data[0].length;i<i2;i++){
                if(!group[i]){
                    group[i]={
                        name:angular.fromJson(mes.data[0][i])
                    };
                    if(mes.data[1][i]){
                        group[i].parents=angular.fromJson(mes.data[1][i]);
                    }
                }
            }
            group[0]=_.clone(o);
            localStorage.setItem('group',angular.toJson(group));
        });
    });
}])//}}}
.directive('appDate',[function(){//{{{
    return {
        scope:{'row':'=appRow'},
        restrict:'A',
        template:'<span class="date" ng-transclude></span>',
        transclude:true,
        replace:true,
        controller:['$scope','calF','eventCal','$filter',function($scope,calendar,eventCal,$filter){
            $scope.calendar=calendar;
            $scope.bookedClass=function(date){
                var tmpCalendar=eventCal.eventCalendar(date);
                var len=0;
                for(var i=0,i2=tmpCalendar.length;i<i2;i++){
                    if($filter('format')(tmpCalendar[i],false).indexOf('[mes]')!==0){
                        len++;
                    }
                }
                if(len<5){
                    return 'booked-'+len;
                }else{
                    return 'booked-5';
                }
            };
            $scope.dateClass=function(date){
                if(date!==0&&date!==32){
                    var calendar=$scope.calendar;
                    var res=[];
                    if(calendar.selected===date) res[res.length]='selected';
                    res[res.length]=$scope.bookedClass(date);
                    if(date===calendar.today.date && calendar.month===calendar.today.month && calendar.year===calendar.today.year){
                        res[res.length]='today';
                    }
                    return res;
                }
                return [];
            };
        }],
        link:function(scope,elm,attrs){
            var date=scope.row[attrs['appDate']];
            function updateClass(){
                elm.removeClass('selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today');
                elm.addClass(scope.dateClass(date).join(' '));
            };
            if(date!==''&&date!==undefined){
                scope.$on('updated',updateClass);
                updateClass();
                elm.on('mouseenter',function(){
                    if(!scope.calendar.disableHoverEvent){
                        if(date){
                            scope.calendar.selected=date;
                            angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                            updateClass();
                            scope.$apply();
                        }
                    }
                });
                elm.on('mouseleave',function(){
                    if(!scope.calendar.disableHoverEvent){
                        scope.calendar.selected=null;
                        angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                        scope.$apply();
                    }
                });
                elm.on('click',function(){
                    if(!isSmartPhone){
                        if(scope.calendar.selected===date){
                            scope.calendar.disableHoverEvent=!scope.calendar.disableHoverEvent;
                        }else{
                            scope.calendar.disableHoverEvent=true;
                        }
                    }
                    scope.calendar.selected=date;
                    angular.element(document.querySelectorAll('.selected')).removeClass('selected');
                    updateClass();
                    scope.$apply();
                });
            }
        }
    };
}])//}}}
;
