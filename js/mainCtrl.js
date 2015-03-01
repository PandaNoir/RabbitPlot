angular.module(appName)
.controller('mainCtrl',['$scope','_','calendar','eventCal','mode','$mdSidenav',function($scope,_,calendar,eventCal,mode,$mdSidenav){//{{{
    $scope._=_;
    $scope.mode=mode;
    mode.editsEvent=false;
    mode.editsGroup=false;
    $scope.splitSelector=calendar.splitSelector;
    $scope.openNav=function(){
        $mdSidenav('left').toggle();
    };
    calendar.selected=calendar.date;
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
            if(toInt(event[1])===0&&toInt(event[0])===-1){
                res='[mes]振替休日';
            }else if(toInt(event[1])===0&&toInt(event[0])===-2){
                res='[mes]国民の休日';
            }else{
                res=group[event[1]][event[2]][event[0]].name;
            }
        }
        if(removeMes!==false && res.indexOf('[mes]')===0){
            res=res.replace(/^\[mes\]/,'');
        }
        return res;
    };
}])//}}}
;
