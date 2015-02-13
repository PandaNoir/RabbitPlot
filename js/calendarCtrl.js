angular.module(appName)
.controller('calendarCtrl',['$scope','calF','mode',function($scope,calendar,mode){//{{{
    $scope.calF=calendar;
    $scope.nextMonth=function(){//{{{
        $scope.calF.month++;
        $scope.calF.selected=null;
        if($scope.calF.month+1>12){
            $scope.calF.year+=1;
            $scope.calF.month-=12;
        }
        mode.editsEventForm=false;
    };//}}}
    $scope.lastMonth=function(){//{{{
        $scope.calF.month--;
        $scope.calF.selected=null;
        if($scope.calF.month+1<1){
            //1月より前==前年の12月だから繰り下げ
            if($scope.calF.year-1<MEMO_LIMIT){
                alert(MEMO_LIMIT+'年より以前はパフォーマンスの関係で表示できません。');
                //calendar()関数のメモ化の関係
                $scope.calF.month+=1;
            }else{
                $scope.calF.month+=12;
                $scope.calF.year-=1;
            }
        }
        mode.editsEventForm=false;
    };//}}}
    $scope.nextYear=function(){//{{{
        $scope.calF.year++;
        $scope.calF.selected=null;
        mode.editsEventForm=false;
    };//}}}
    $scope.lastYear=function(){//{{{
        if($scope.calF.year-1<MEMO_LIMIT){
            alert(MEMO_LIMIT+'年より以前はパフォーマンスの関係で表示できません。');
        }else{
            $scope.calF.year--;
            $scope.calF.selected=null;
        }
        mode.editsEventForm=false;
    };//}}}
    $scope.dates=['日','月','火','水','木','金','土'];
}])//}}}
.directive('appDate',function(){//{{{
    return {
        scope:{'row':'=appRow'},
        restrict:'A',
        template:'<span class="date"></span>',
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
            if(!(date===0 || date===OVER_MONTH || date===undefined)){
                elm.append(angular.element('<span>').addClass('inner').text(date));
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
});//}}}
