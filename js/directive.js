angular.module(appName)
.directive('appDate',function(){//{{{
    return {
        scope:{'row':'=appRow'},
        restrict:'A',
        template:'<span class="date"></span>',
        replace:true,
        controller:function($scope,calendar,eventCal,$filter,OVER_MONTH,IS_SMART_PHONE){
            $scope.OVER_MONTH=OVER_MONTH;
            $scope.IS_SMART_PHONE=IS_SMART_PHONE;
            $scope.calendar=calendar;
            var countEvents=function(date){
                var tmpCalendar=eventCal.eventCalendar(date);
                var len=0;
                for(var i=0,i2=tmpCalendar.length;i<i2;i++){
                    if($filter('format')(tmpCalendar[i],false).indexOf('[mes]')!==0){
                        len++;
                    }
                }
                return len<5?len:5;
            };
            $scope.dateClass=function(date){
                if(date!==0&&date!==32){
                    var res=[];
                    if(calendar.selected===date) res[res.length]='selected';
                    res[res.length] = 'booked-' + countEvents(date);
                    if(date===calendar.today.date && calendar.month===calendar.today.month && calendar.year===calendar.today.year){
                        res[res.length]='today';
                    }
                    return res;
                }
                return [];
            };
        },
        link:function(scope,elm,attrs){
            var date=scope.row[attrs['appDate']];
            function updateClass(){
                elm.removeClass('selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today');
                elm.addClass(scope.dateClass(date).join(' '));
            };
            if(!(date===0 || date===scope.OVER_MONTH || date===undefined)){
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
                    if(!scope.IS_SMART_PHONE){
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
})//}}}
.directive('eventItem',function(){//{{{
    return {
        restrict: 'A',
        scope: {event:'=appEvent'},
        template: '<div class="md-item-content event-item" layout="row"><div flex>{{event|format}}</div><div flex><md-button ng-click="mode.switchToEdit(event)">編集</md-button><md-button ng-click="mode.switchToEdit(event,true)">コピー</md-button><md-button ng-click="deleteEvent(event)" ng-if="user.hasPermission(event.split(\':\')[1])">削除</md-button></div></div>',
        replace:true,
        controller: function($scope,mode,user,db){
            $scope.mode=mode;
            $scope.user=user;
            $scope.deleteEvent=function(event){
                var eventID=event.split(':')[0];
                var groupID=event.split(':')[1];
                var type=event.split(':')[2];
                if(user.hasPermission(groupID)){
                    if(groupID==='private'){
                        user['private'][type].splice(eventID,1);
                        user.updated=true;
                        user.save();
                        db.updateUser();
                    }else{
                        group[groupID][type].splice(eventID,1);
                        group[groupID].updated=true;
                        db.post(group[groupID],groupID,'update');
                    }
                }else{
                    return;
                }
            };
        },
        link: function(scope,elm,attrs){
        }
    };
})//}}}
;
