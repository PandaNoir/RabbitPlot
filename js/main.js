'use strict';(function(L,B){function C(a,d){return a-d}function g(a){return parseInt(a,10)}var K=0<navigator.userAgent.indexOf("iPhone")&&-1==navigator.userAgent.indexOf("iPad")||0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android");angular.module("rabbit",["ngTouch","ngAnimate","ngMaterial","ngMessages"]).controller("mainCtrl",["$scope","_","calF","eventCal","mode","$mdSidenav",function(a,d,b,c,f,e){console.log(f,e);a._=d;a.mode=f;f.editsEventForm=!1;f.editsGroupForm=!1;
a.splitSelector=c.splitSelector;a.openNav=function(){e("left").toggle()};b.selected=b.date;a.eventCalendar=c.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=function(a){if(a===B)return a;if(angular.isObject(a)){var b=[],c;for(c in a)if(a.hasOwnProperty(c)){var f=a[c];b[b.length]=encodeURIComponent(c)+"="+encodeURIComponent(null==f?"":f)}a=b.join("&").replace(/%20/g,"+")}else a=null==a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",
["group","user",function(a,d){return function(b,c){b=b.split(":");var f="",f="private"==b[1]?d["private"][b[2]][b[0]].name:a[b[1]][b[2]][b[0]].name;!1!==c&&0===f.indexOf("[mes]")&&(f=f.replace(/^\[mes\]/,""));return f}}]).run(["db","group","$rootScope",function(a,d,b){var c=_.clone(d)[0];localStorage&&localStorage.getItem("group")&&(d.length=0,Array.prototype.push.apply(d,angular.fromJson(localStorage.getItem("group"))),d[0]=_.clone(c));a.list().then(function(f){f=f.data;for(var e=0,k=f.length;e<
k;e++){for(var m in f[e])f[e][m]=angular.fromJson(f[e][m]);f[e].updated=!0}f.sort(function(a,c){return a.id-c.id});e=d.length=0;for(k=f.length;e<k;e++)d[f[e].id]=f[e];d[0]=_.clone(c);b.$broadcast("updated");localStorage.setItem("group",angular.toJson(d));a.getNameList().then(function(a){for(var f=0,b=a.data[0].length;f<b;f++)d[f]||(d[f]={name:angular.fromJson(a.data[0][f])},a.data[1][f]&&(d[f].parents=angular.fromJson(a.data[1][f])));d[0]=_.clone(c);localStorage.setItem("group",angular.toJson(d))})})}]).directive("appDate",
[function(){return{scope:{row:"=appRow"},restrict:"A",template:'<span class="date" ng-transclude></span>',transclude:!0,replace:!0,controller:["$scope","calF","eventCal","$filter",function(a,d,b,c){a.calendar=d;a.bookedClass=function(a){a=b.eventCalendar(a);for(var d=0,k=0,m=a.length;k<m;k++)0!==c("format")(a[k],!1).indexOf("[mes]")&&d++;return 5>d?"booked-"+d:"booked-5"};a.dateClass=function(c){if(0!==c&&32!==c){var b=a.calendar,d=[];b.selected===c&&(d[d.length]="selected");d[d.length]=a.bookedClass(c);
c===b.today.date&&b.month===b.today.month&&b.year===b.today.year&&(d[d.length]="today");return d}return[]}}],link:function(a,d,b){function c(){d.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");d.addClass(a.dateClass(f).join(" "))}var f=a.row[b.appDate];""!==f&&f!==B&&(a.$on("updated",c),c(),d.on("mouseenter",function(){!a.calendar.disableHoverEvent&&f&&(a.calendar.selected=f,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),c(),a.$apply())}),
d.on("mouseleave",function(){a.calendar.disableHoverEvent||(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),a.$apply())}),d.on("click",function(){K||(a.calendar.disableHoverEvent=a.calendar.selected===f?!a.calendar.disableHoverEvent:!0);a.calendar.selected=f;angular.element(document.querySelectorAll(".selected")).removeClass("selected");c();a.$apply()}))}}}]);angular.module("rabbit").controller("calendarCtrl",["$scope","calF","mode",function(a,
d,b){a.calF=d;a.nextMonth=function(){a.calF.month++;a.calF.selected=null;12<a.calF.month+1&&(a.calF.year+=1,a.calF.month-=12);b.editsEventForm=!1};a.lastMonth=function(){a.calF.month--;a.calF.selected=null;1>a.calF.month+1&&(1950>a.calF.year-1?(alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),a.calF.month+=1):(a.calF.month+=12,--a.calF.year));b.editsEventForm=!1};a.nextYear=function(){a.calF.year++;
a.calF.selected=null;b.editsEventForm=!1};a.lastYear=function(){1950>a.calF.year-1?alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(a.calF.year--,a.calF.selected=null);b.editsEventForm=!1}}]);angular.module("rabbit").controller("eventEditorCtrl",["$scope","group","user","eventForm","calF","db","mode","$mdToast",function(a,d,b,c,f,e,k,m){function I(c){"private"===c?b.save():e.post(a.group[c],
c,"update")}var p=[],q=[];a.mode=k;a.group=d;a.user=b;a.eventForm=c;a.calF=f;a.ruleWriterFase="";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.addEvent=function(){var b=a.eventForm.type;if(""!==c.name&&c.selectedGroup!==B&&null!==c.selectedGroup){var d=new Date(c.year,c.month-1,c.date);if(d.getFullYear()===g(c.year)&&d.getMonth()===g(c.month)-1&&d.getDate()===g(c.date)){if("event"==b)var f={year:c.year,month:c.month-1,date:c.date,name:c.name};else"habit"==b&&(f={selector:c.rule,name:c.name});
"private"===c.selectedGroup?(a.user["private"][b][a.user["private"][b].length]=f,a.user.updated=!0):null!==c.selectedGroup&&(a.group[c.selectedGroup][b][a.group[c.selectedGroup][b].length]=f,a.group[c.selectedGroup].updated=!0);m.show(m.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));k.editsEventForm=!1;I(c.selectedGroup)}}};a.saveEvent=function(){var b=c.type;if(null!==c.year&&null!==c.month&&null!==c.date&&""!==c.name){var d=
new Date(c.year,c.month-1,c.date);if(d.getFullYear()===g(c.year)&&d.getMonth()===g(c.month)-1&&d.getDate()===g(c.date)){if("private"===c.selectedGroup)var f=a.user["private"][b][c.id];else null!==c.selectedGroup&&(f=a.group[c.selectedGroup][b][c.id],a.group[c.selectedGroup].updated=!0);"event"==b?(f.year=c.year,f.month=c.month-1,f.date=c.date,f.name=c.name):"habit"==b&&(f.selector=c.rule,f.name=c.name);k.editsEventForm=!1;I(c.selectedGroup)}}};a.cancel=function(){k.editsEventForm=!1};a.goFase=function(b,
d){p[p.length]=a.ruleWriterFase;q[q.length]=d||b;a.ruleWriterFase=b;c.rule=q.join("")};a.cancelFase=function(){a.ruleWriterFase=p.pop();q.pop();c.rule=q.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";p=[];c.rule=q.join("");q=[]};a.startWritingRule=function(){a.ruleWriterFase="selector";p=[];q=[]}}]);angular.module("rabbit").controller("groupEditorCtrl",["$scope","group","groupForm","db","$mdToast","mode",function(a,d,b,c,f,e){a.groupForm=b;a.groupForm.parentGroup=[null];a.groupForm.mode=
"add";a.group=d;a.finishMakingAGroup=function(){e.editsGroupForm=!1};a.addGroup=function(){var b=a.groupForm.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?g(b):"");return a},[]),e={event:[],habit:[],name:a.groupForm.name,updated:!0};""!==b.join("")&&(e.parents=b);d[d.length]=e;c.post(e,a.group.length-1,"insert").success(a.finishMakingAGroup);f.show(f.simple().content("\u30b0\u30eb\u30fc\u30d7 "+a.groupForm.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));
a.groupForm.name=""}}]);angular.module("rabbit").controller("detailCtrl",["$scope","eventCal","calF","mode",function(a,d,b,c){a.mode=c;a.calF=b;a.eventCalendar=d.eventCalendar}]);angular.module("rabbit").controller("settingCtrl",["$scope","group","user","db","eventListToEdit","groupForm","mode","$mdSidenav","$mdToast","$mdDialog",function(a,d,b,c,f,e,k,m,g,p){function q(b){return-1!==a.user.following.indexOf(b)}function t(a){if(!d[a].parents)return[];for(var b=d[a].parents,c=0,f=d[a].parents.length;c<
f;c++)b=t(d[a].parents[c]).concat(b);return b}a.group=d;a.user=b;a.groupForm=e;a.search_keyword="";a.searchResult=[];a.hide=function(a){b.hiddenGroup[b.hiddenGroup.length]=a;b.hiddenGroup.sort(C);b.save()};a.show=function(c){b.hiddenGroup=_.without(a.user.hiddenGroup,c);b.save()};a.followsParent=function(a){a=t(a);for(var b=0,c=a.length;b<c;b++)if(!q(a[b]))return a[b];return!0};a.toggleNav=function(){console.log("called");m("left").close()};a.follows=q;a.follow=function(c){a.user.following[a.user.following.length]=
c;a.user.following.sort(C);b.save();g.show(g.simple().content(d[c].name+"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};a.unfollow=function(c){var f=[];f[f.length]=a.user.following.indexOf(c);for(var l=0,e=a.user.following.length;l<e;l++)if(d[a.user.following[l]].parents&&-1!=t(a.user.following[l]).indexOf(c)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+d[a.user.following[l]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;
f[f.length]=l}f.sort(function(a,b){return b-a});l=0;for(e=f.length;l<e;l++)a.user.following.splice(f[l],1);b.save()};a.showEventList=function(a){f.id=a;k.showsEventList=!0};a.makeAGroup=function(){e.isEditMode=!0;m("left").close()};a.search=function(){var b=[];if(""==a.search_keyword||!d)return b;for(var c=0,f=d.length;c<f&&!(30<b.length);c++)d[c]&&d[c].name&&-1!==d[c].name.indexOf(a.search_keyword)&&(b[b.length]=c);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>d.length)Array.prototype.push.apply(b,
d);else for(;5>b.length;){var c=Math.random()*d.length|0;-1===_.indexOf(b,c)&&(b[b.length]=c)}a.searchResult=b};a.hideAll=function(){b.hiddenGroup.length=0;b.hiddenGroup=_.clone(b.following);b.hiddenGroup[b.hiddenGroup.length]=-1;b.hiddenGroup.sort(C);b.save()};a.showAll=function(){b.hiddenGroup=[];b.save()};a.importSetting=function(){p.show({controller:["$scope","$mdDialog",function(a,b){a.text="";a.answer=function(a){b.hide(a)}}],template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(a){a=
JSON.parse(a);for(var c in a)b[c]=a[c];b.save()})};a.exportSetting=function(){p.show(p.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(b)).ok("ok"))}}]).directive("autoFocus",function(){return{link:function(a,d,b){a.$watch("focus",function(b){!0===a.focus&&d[0].focus()})}}});angular.module("rabbit").controller("eventListCtrl",["$scope","group","user","eventListToEdit","eventForm",
"mode","$log",function(a,d,b,c,f,e,k){a.eventListToEdit=c;a.group=d;a.user=b;k.log("eventListToEdit.id===",c.id);"private"!==c.id&&""!==c.id?(a.habitList=d[c.id].habit,a.eventList=d[c.id].event):(a.habitList=b["private"].habit,a.eventList=b["private"].event);a.mode=e}]);angular.module("rabbit").factory("_",function(){return _}).factory("user",["$rootScope",function(a){if(localStorage&&angular.fromJson(localStorage.getItem("private"))){var d=angular.fromJson(localStorage.getItem("private"));d.isHiddenGroup=
function(a){return-1!==_.indexOf(this.hiddenGroup,a,!0)};d.save=function(){a.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))};d.updated=!0}else d={following:[],"private":{event:[],habit:[],name:"\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8"},hiddenGroup:[],isHiddenGroup:function(a){return-1!==_.indexOf(this.hiddenGroup,a,!0)},save:function(){a.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))}};d.save();return d}]).factory("eventForm",function(){return{name:"",
year:(new Date).getFullYear(),month:(new Date).getMonth()+1,date:(new Date).getDate(),type:"event",rule:""}}).factory("groupForm",function(){return{name:""}}).factory("group",["$http",function(a){return[{id:0,event:[{name:"[mes]\u6625\u5206\u306e\u65e5",year:2E3,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2E3,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2001,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2001,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2002,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2002,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2003,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2003,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2004,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2004,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2005,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2005,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2006,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2006,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2007,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2007,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2008,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2008,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2009,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2009,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2010,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2010,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2011,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2011,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2012,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2012,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2013,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2013,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2014,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2014,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2015,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2015,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2016,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2016,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2017,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2017,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2018,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2018,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2019,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2019,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2020,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2020,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2021,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2021,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2022,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2022,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2023,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2023,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2024,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2024,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2025,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2025,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2026,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2026,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2027,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2027,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2028,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2028,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2029,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2029,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2030,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2030,month:8,date:23},{name:"[mes]\u5341\u4e94\u591c",year:2E3,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2001,month:9,date:1},{name:"[mes]\u5341\u4e94\u591c",year:2002,month:8,date:21},{name:"[mes]\u5341\u4e94\u591c",year:2003,month:8,date:11},{name:"[mes]\u5341\u4e94\u591c",year:2004,month:8,date:28},{name:"[mes]\u5341\u4e94\u591c",year:2005,month:8,date:18},{name:"[mes]\u5341\u4e94\u591c",year:2006,month:9,date:6},
{name:"[mes]\u5341\u4e94\u591c",year:2007,month:8,date:25},{name:"[mes]\u5341\u4e94\u591c",year:2008,month:8,date:14},{name:"[mes]\u5341\u4e94\u591c",year:2009,month:9,date:3},{name:"[mes]\u5341\u4e94\u591c",year:2010,month:8,date:22},{name:"[mes]\u5341\u4e94\u591c",year:2011,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2012,month:8,date:30},{name:"[mes]\u5341\u4e94\u591c",year:2013,month:8,date:19},{name:"[mes]\u5341\u4e94\u591c",year:2014,month:8,date:8},{name:"[mes]\u5341\u4e94\u591c",
year:2015,month:8,date:27},{name:"[mes]\u5341\u4e94\u591c",year:2016,month:8,date:15}],habit:[{name:"[mes]\u5143\u65e6",selector:"month:1 date:1"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"month:1 day:2nd-mon"},{name:"[mes]\u662d\u548c\u306e\u65e5",selector:"month:4 date:29"},{name:"[mes]\u5efa\u56fd\u8a18\u5ff5\u65e5",selector:"month:2 date:11"},{name:"[mes]\u61b2\u6cd5\u8a18\u5ff5\u65e5",selector:"month:5 date:3"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"month:5 date:4"},{name:"[mes]\u3053\u3069\u3082\u306e\u65e5",
selector:"month:5 date:5"},{name:"[mes]\u6d77\u306e\u65e5",selector:"month:7 day:3rd-mon"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"month:9 day:3rd-mon"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",selector:"month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"month:12 date:23"}],name:"\u795d\u65e5",updated:!0}]}]).factory("calF",
function(){var a=new Date,d=[];return{year:a.getFullYear(),month:a.getMonth(),date:a.getDate(),calendar:function(a,c){if(d[a-1950]){if(d[a-1950][c])return d[a-1950][c]}else d[a-1950]=[];var f=(new Date(a,c,1)).getDay(),e=[31,28,31,30,31,30,31,31,30,31,30,31][c];1===c&&(0==a%400||0!=a%100&&0==a%4)&&(e=29);var k=[];k.year=a;k.month=c;var m=0;for(;;){k[m]=[];for(var g=1;7>=g;g++)k[m][k[m].length]=0<7*m+g-f?7*m+g-f<=e?7*m+g-f:32:0;if(k[m][k[m].length-1]>=e)break;m++}return d[a-1950][c]=k},today:{year:a.getFullYear(),
month:a.getMonth(),date:a.getDate()},selected:a.getDate(),selectedDay:function(){return null==this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,this.month,this.selected)).getDay()]},disableHoverEvent:K}}).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var d=d||Error;return function(b){a.show(a.simple().content(b).position("top right").hideDelay(3E3));return new d(b)}}]).factory("mode",["eventForm","$mdSidenav",
"user","group",function(a,d,b,c){return{editsEventForm:!1,editsGroupForm:!1,showsEventList:!1,switchToEdit:function(){var f=Array.prototype.slice.call(arguments);if(1===f.length||2===f.length&&!0===f[1]){var e=f[0];a.mode=1===f.length?"edit":"add";e=e.split(":");_.extend(a,{type:e[2],id:1===f.length?e[0]:0});a.selectedGroup="private"!==e[1]?g(e[1]):e[1];"event"===e[2]?(_.map(["year","month","date","name"],function(f){a[f]="private"===e[1]?b["private"].event[e[0]][f]:c[e[1]].event[e[0]][f]}),a.month+=
1):"habit"===e[2]&&("private"===e[1]?(a.rule=b["private"].habit[e[0]].selector,a.name=b["private"].habit[e[0]].name):(a.rule=c[e[1]].habit[e[0]].selector,a.name=c[e[1]].habit[e[0]].name))}else 3===f.length&&_.extend(a,{mode:"add",type:"event",rule:"",id:0,name:"",year:f[0],month:f[1]+1,date:f[2]});this.editsEventForm=!0;d("left").close()}}}]).run(["calF","$timeout",function(a,d){function b(){var c=new Date;c.setDate(c.getDate()+1);c.setHours(0);c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0);
var e=new Date;a.today.year=e.getFullYear();a.today.month=e.getMonth();a.today.date=e.getDate();d(b,c-new Date)}var c=new Date;c.setDate(c.getDate()+1);c.setHours(0);c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0);d(b,c-new Date)}]).factory("db",["group","user","$http","$rootScope",function(a,d,b,c){return{post:function(a,d,k){a=_.clone(a);a.id=d;a.permission=a.permission||[];a.parents=a.parents||"";delete a.updated;for(var g in a)a[g]=angular.toJson(a[g]);a.type=k;c.$broadcast("updated");return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",
a).success(function(a){console.log("updated");console.log(a)}).error(function(a){console.log(a)})},list:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:d.following.join(",")}).success(function(a){return a}).error(function(a){console.log(a)})},getNameList:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"namelist"}).success(function(a){return a})}}}]);angular.module("rabbit").factory("eventCal",["group","user",
"calF","error",function(a,d,b,c){function f(c,b,g){if("private"!==c&&!a[c])return[];var x=[],z=[];"private"===c?(_.each(d.following,function(a){z=z.concat(f(a,b,g))}),x=x.concat(e(d["private"].event,b,g,"private")),z=z.concat(x),x=x.concat(k(d["private"].habit,b,g,"private",z)),d.updated=!1):(a[c].parents&&_.each(a[c].parents,function(a){z=z.concat(f(a,b,g))}),x=x.concat(e(a[c].event,b,g,c)),z=z.concat(x),x=x.concat(k(a[c].habit,b,g,c,z)),a[c].updated=!1);return x}function e(a,c,b,d){var f=[];if(!a)return f;
for(var e=0,g=a.length;e<g;e++)if(a[e].year===c&&a[e].month===b){var k=_.clone(a[e]);k.group=d;k.type="event";k.id=e;f[f.length]=k}return f}function k(d,e,k,x,z){function y(d,e,v){function k(d,e,l){var v=function(){return _.clone(m)},y=b.calendar(e,l),u={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,monday:1,mon:1,"\u6708\u66dc\u65e5":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,thursday:4,thu:4,"\u6728\u66dc\u65e5":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,saturday:6,sat:6,
"\u571f\u66dc\u65e5":6},q={January:0,Jan:0,"\u7766\u6708":0,February:1,Feb:1,"\u5982\u6708":1,March:2,Mar:2,"\u5f25\u751f":2,April:3,Apr:3,"\u536f\u6708":3,May:4,"\u7690\u6708":4,June:5,Jun:5,"\u6c34\u7121\u6708":5,July:6,Jul:6,"\u6587\u6708":6,August:7,Aug:7,"\u8449\u6708":7,September:8,Sep:8,"\u9577\u6708":8,October:9,Oct:9,"\u795e\u7121\u6708":9,November:10,Nov:10,"\u971c\u6708":10,December:11,Dec:11,"\u5e2b\u8d70":11};if(p[e-1950])if(p[e-1950][l]){if(p[e-1950][l][d])return _.clone(p[e-1950][l][d])}else p[e-
1950][l]={};else p[e-1950]=[],p[e-1950][l]={};var E=d.split(":")[0],h=d.split(":").slice(1).join(":"),n=[],t=[],A=[],B=[],r,w,D,G,F=[];if("not"===E)if(n=v(),"public-holiday"===h||"\u795d\u65e5"===h){y=f(0,e,l);u=0;for(h=y.length;u<h;u++)y[u]=y[u].date;n=_.difference(n,y);p[e-1950][l][d]=_.clone(n)}else if(0===h.indexOf("year")||0===h.indexOf("month")||0===h.indexOf("date")||0===h.indexOf("day"))h=h.replace(/=/,":"),n=_.difference(v(),k(h,e,l));else{var C=h.split("=")[0],J=h.replace(/^.+?=/,""),J=
J.replace(/^"(.+)"$/,"$1");_.each(z,function(a){if(a[C]===J||0===a[C].indexOf("[mes]")&&a[C].slice(5)===J)n=_.without(n,a.date)})}else if("range"===E)if(".."===h.slice(0,2))h="..."===h.slice(0,3)?h.slice(3):h.slice(2),n=v(),h=h.split("/"),h=_.map(h,g),w=new Date(h[0],h[1]-1,h[2]),w.getFullYear()<e||w.getFullYear()==e&&w.getMonth()<l?n=[]:w.getFullYear()==e&&w.getMonth()==l?(n=v(),n=_.filter(n,function(a){return a<=w.getDate()})):n=v();else if(".."===h.slice(-2))h="..."===h.slice(-3)?h.slice(0,-3):
h.slice(0,-2),h=h.split("/"),h=_.map(h,g),r=new Date(h[0],h[1]-1,h[2]),r.getFullYear()>e||r.getFullYear()==e&&r.getMonth()>l?n=[]:r.getFullYear()==e&&r.getMonth()==l?(n=v(),n=_.filter(n,function(a){return a>=r.getDate()})):n=v();else if(-1!==h.indexOf(".."))n=[],h=h.split("..."),1===h.length&&(h=h[0].split("..")),t=[],A=[],B=[],r=h[0],w=h[1],D=w.substr(w.length-4,4),G=w.substr(w.length-5,5),F=[],r=r.split("/"),r=_.map(r,g),3===r.length?(y=new Date(r[0],r[1]-1,r[2]),F.push(y)):2===r.length&&(y=new Date(e-
1,r[0]-1,r[1]),F.push(y,new Date(e,r[0]-1,r[1]))),_.each(F,function(a){a.getFullYear()>e||a.getFullYear()==e&&a.getMonth()>l?t=[]:a.getFullYear()==e&&a.getMonth()==l?(t=v(),t=_.filter(t,function(c){return c>=a.getDate()})):t=v();B.push(t)}),F=_.zip(F,B),_.each(F,function(a){var c=a[0];a=a[1];var b;if("date"===D||"week"===D||"year"===D||"dates"===G||"weeks"===G||"years"===G){var d;d="date"===D||"week"===D||"year"===D?g(w.substring(0,w.length-4)):g(w.substring(0,w.length-5));b=new Date(c.getTime());
"date"===D||"dates"===G?b.setDate(b.getDate()+d):"week"===D||"weeks"===G?b.setDate(b.getDate()+7*d):"year"!==D&&"years"!==G||b.setFullYear(b.getFullYear()+d)}else b=w.split("/"),b=_.map(b,g),3===b.length?b=new Date(b[0],b[1]-1,b[2]):(b=new Date(c.getFullYear(),b[0]-1,b[1]),b.getTime()<c.getTime()&&b.setFullYear(b.getFullYear()+1));b.getFullYear()<e||b.getFullYear()==e&&b.getMonth()<l?A=[]:b.getFullYear()==e&&b.getMonth()==l?(A=v(),A=_.filter(A,function(a){return a<=b.getDate()})):A=v();_.isEmpty(_.intersection(a,
A))||(n=_.intersection(a,A))});else throw c('invalid selector "'+E+":"+h+'" in '+a[x].name+".");else if("date"===E)n[n.length]=g(h);else if("month"===E)if(!q[h]&&g(h)!=l+1||q[h]&&q[h]!=l)n=[];else{if(!q[h]&&g(h)==l+1||q[h]&&q[h]==l)n=v()}else if("day"===E)if(h.match(/^\d/)){for(var h=h.match(/^(\d+)(?:st|nd|rd|th)-?(.+)$/),F=g(h[1]),H=u[h[2]],u=0;""===y[u][H];)u++;n[n.length]=y[u-1+F][H]}else H=u[h],_.some(y,function(a){""!==a[H]&&(n[n.length]=a[H])});else if("year"===E)n="leap-year"===h||"leap_year"===
h||"\u3046\u308b\u3046\u5e74"===h||"\u958f\u5e74"===h?0===e%400||0===e%4&&0!==e%100?v():[]:g(h)!==e?[]:v();else throw c('undefined key "'+E+'".');"day"===E&&(p[e-1950][l][d]=_.clone(n));return n}var l=[],m=_.flatten(b.calendar(e,v));_.each(d,function(a){if(1===a[1])l[l.length]=k(a[0],e,v);else if(0===a[1])if("&&"===a[0])l.push(_.intersection(l.pop(),l.pop()));else if("||"===a[0])l.push(_.union(l.pop(),l.pop()));else throw c("undefined operator "+a[0]);});if(1!=l.length)throw c("unexpected error in execSelectors().");
return l.pop()}if(!d)return[];for(var q=[],u=0,t=d.length;u<t;u++){d[u].type="habit";d[u].group=x;var A=y(m(d[u].selector),e,k);_.each(A,function(a,b){A[b]={year:e,month:k,date:a,name:d[u].name,group:x,id:u,type:"habit"}});q=q.concat(A)}return q}function m(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(q[a])return q[a];for(var c=[],d=!1,e=0,f=0,k=a.length;f<k;f++){var g=a.charAt(f);if(d)'"'===g?d=!1:"\\"===g&&(f+=1);else if('"'===g)d=!0;else if(" "===g){b([a.substring(e,f),1]);var g={" and ":"&&",
" \u304b\u3064 ":"&&"," && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"},m=!1,p;a:for(p in g)if(a.substr(f,p.length)===p){b([g[p],0]);e=f+p.length;f+=p.length;m=!0;break a}m||(b(["&&",0]),e=f+1,f+=1)}else if("("===g||")"===g)b([a.substring(e,f),1]),b([g,"("===g?2:3]),e=f+1}""!==a.substring(e)&&b([a.substring(e),1]);return q[a]=I(c)}function I(a){for(var b=[],d=[],f={"||":0,"&&":1},e=0,g=a.length;e<g;e++)if(1===a[e][1])d[d.length]=a[e].concat();else if(0===a[e][1]){var k=a[e][0];b[b.length-
1]&&f[k]<=f[b[b.length-1][0]]&&(d[d.length]=b.pop());b[b.length]=a[e]}else if(2===a[e][1])b[b.length]=a[e];else if(3===a[e][1]){for(;2!=b[b.length-1][1];)if(d[d.length]=b.pop(),0===b.length)throw c("found mismatched parentheses");b.pop()}for(;0<b.length;){if(2===b[b.length-1][1])throw c("found mismatched parentheses.");d[d.length]=b.pop()}return d}var p=[],q={},t=[],B=-1,C=-1;return{eventCalendar:function(a){var c=[],e=[],g=_.difference(d.following,d.hiddenGroup);if(b.year!==B||b.month!==C)B=b.year,
C=b.month,t=[];else if(_.any(g,function(a){return!0===a.updated})||d.updated)t=[];else return t[a]||[];for(var k=0,m=g.length;k<m;k++)c[c.length]=f(g[k],b.year,b.month);d.isHiddenGroup(-1)||(c[c.length]=f("private",b.year,b.month));k=0;for(m=c.length;k<m;k++)for(var g=0,p=c[k].length;g<p;g++)e[c[k][g].date]||(e[c[k][g].date]=[]),e[c[k][g].date][e[c[k][g].date].length]=c[k][g].id+":"+c[k][g].group+":"+c[k][g].type;t=_.clone(e);return t[a]||[]},splitSelector:m}}])})(window);
