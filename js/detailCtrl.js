angular.module(appName)
.controller('detailCtrl',['$scope','eventCal','calF','group','user','mode','db',function($scope,eventCal,calF,group,user,mode,db){
    $scope.mode=mode;
    $scope.calF=calF;
    $scope.eventCalendar=eventCal.eventCalendar;
    $scope.user=user;
    $scope.deleteEvent=function(event){
        var eventID=event.split(':')[0];
        var groupID=event.split(':')[1];
        var type=event.split(':')[2];
        if(user.hasPermission(groupID)){
            if(groupID==='private'){
                user['private'][type].splice(eventID,1);
                user.save();
            }else{
                group[groupID][type].splice(eventID,1);
                db.post(group[groupID],groupID,'update');
            }
        }else{
            return;
        }
    };
    $scope.isToday=function(){
        return calF.selected===calF.today.date && calF.month===calF.today.month && calF.year===calF.today.year;
    };
}]);
