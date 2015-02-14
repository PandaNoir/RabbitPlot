'use strict';(function(Q,E){function D(a,d){return a-d}function r(a){return parseInt(a,10)}function N(a){a.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248)})}function K(a){return 0===a%400||0===a%4&&0!==a%100}function L(){var a="",d,c;for(d=0;32>d;d++){c=16*Math.random()|0;if(8==d||12==d||16==d||20==d)a+="-";a+=(12==d?4:16==d?c&3|8:c).toString(16)}return a}var M=0<navigator.userAgent.indexOf("iPhone")&&-1==navigator.userAgent.indexOf("iPad")||
0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android"),O=Array.prototype.slice;angular.module("rabbit",["ngTouch","ngAnimate","ngMaterial","ngMessages"]).controller("mainCtrl",["$scope","_","calF","eventCal","mode","$mdSidenav",function(a,d,c,b,f,h){a._=d;a.mode=f;f.editsEventForm=!1;f.editsGroupForm=!1;a.splitSelector=b.splitSelector;a.openNav=function(){h("left").toggle()};c.selected=c.date;a.eventCalendar=b.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=
function(a){if(a===E)return a;if(angular.isObject(a)){var c=[],b;for(b in a)if(a.hasOwnProperty(b)){var f=a[b];c[c.length]=encodeURIComponent(b)+"="+encodeURIComponent(null==f?"":f)}a=c.join("&").replace(/%20/g,"+")}else a=null==a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",["group","user",function(a,d){return function(c,b){c=c.split(":");var f="",f="private"==c[1]?d["private"][c[2]][c[0]].name:0===r(c[1])&&-1===r(c[0])?
"[mes]\u632f\u66ff\u4f11\u65e5":a[c[1]][c[2]][c[0]].name;!1!==b&&0===f.indexOf("[mes]")&&(f=f.replace(/^\[mes\]/,""));return f}}]).run(["_","db","group","$rootScope",function(a,d,c,b){var f=a.clone(c)[0];localStorage&&localStorage.getItem("group")&&(c.length=0,Array.prototype.push.apply(c,angular.fromJson(localStorage.getItem("group"))),c[0]=a.clone(f));d.list().then(function(h){h=h.data;for(var e=0,n=h.length;e<n;e++){for(var l in h[e])h[e][l]=angular.fromJson(h[e][l]);h[e].updated=!0}h.sort(function(a,
b){return a.id-b.id});e=c.length=0;for(n=h.length;e<n;e++)c[h[e].id]=h[e];c[0]=a.clone(f);b.$broadcast("updated");localStorage.setItem("group",angular.toJson(c));d.getNameList().then(function(b){for(var d=0,e=b.data[0].length;d<e;d++)c[d]||(c[d]={name:angular.fromJson(b.data[0][d])},b.data[1][d]&&(c[d].parents=angular.fromJson(b.data[1][d])));c[0]=a.clone(f);localStorage.setItem("group",angular.toJson(c))})})}]).directive("eventItem",function(){return{restrict:"A",scope:{event:"=appEvent"},template:'<div class="md-item-content event-item" layout="row"><div flex>{{event|format}}</div><div flex><md-button ng-click="mode.switchToEdit(event)">\u7de8\u96c6</md-button><md-button ng-click="mode.switchToEdit(event,true)">\u30b3\u30d4\u30fc</md-button><md-button ng-click="deleteEvent(event)" ng-if="user.hasPermission(event.split(\':\')[1])">\u524a\u9664</md-button></div></div>',
replace:!0,controller:["$scope","mode","user","db",function(a,d,c,b){a.mode=d;a.user=c;a.deleteEvent=function(a){var d=a.split(":")[0],e=a.split(":")[1];a=a.split(":")[2];c.hasPermission(e)&&("private"===e?(c["private"][a].splice(d,1),c.updated=!0,c.save()):(group[e][a].splice(d,1),group[e].updated=!0,b.post(group[e],e,"update")))}}],link:function(a,d,c){}}});angular.module("rabbit").controller("calendarCtrl",["$scope","calF","mode",function(a,d,c){a.calF=d;a.nextMonth=function(){a.calF.month++;a.calF.selected=
null;12<a.calF.month+1&&(a.calF.year+=1,a.calF.month-=12);c.editsEventForm=!1};a.lastMonth=function(){a.calF.month--;a.calF.selected=null;1>a.calF.month+1&&(1950>a.calF.year-1?(alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),a.calF.month+=1):(a.calF.month+=12,--a.calF.year));c.editsEventForm=!1};a.nextYear=function(){a.calF.year++;a.calF.selected=null;c.editsEventForm=!1};a.lastYear=
function(){1950>a.calF.year-1?alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(a.calF.year--,a.calF.selected=null);c.editsEventForm=!1};a.dates="\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")}]).directive("appDate",function(){return{scope:{row:"=appRow"},restrict:"A",template:'<span class="date"></span>',replace:!0,controller:["$scope","calF","eventCal","$filter",function(a,d,
c,b){a.calendar=d;a.bookedClass=function(a){a=c.eventCalendar(a);for(var d=0,e=0,n=a.length;e<n;e++)0!==b("format")(a[e],!1).indexOf("[mes]")&&d++;return 5>d?"booked-"+d:"booked-5"};a.dateClass=function(b){if(0!==b&&32!==b){var c=a.calendar,d=[];c.selected===b&&(d[d.length]="selected");d[d.length]=a.bookedClass(b);b===c.today.date&&c.month===c.today.month&&c.year===c.today.year&&(d[d.length]="today");return d}return[]}}],link:function(a,d,c){function b(){d.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");
d.addClass(a.dateClass(f).join(" "))}var f=a.row[c.appDate];0!==f&&64!==f&&f!==E&&(d.append(angular.element("<span>").addClass("inner").text(f)),a.$on("updated",b),b(),d.on("mouseenter",function(){!a.calendar.disableHoverEvent&&f&&(a.calendar.selected=f,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),b(),a.$apply())}),d.on("mouseleave",function(){a.calendar.disableHoverEvent||(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),
a.$apply())}),d.on("click",function(){M||(a.calendar.disableHoverEvent=a.calendar.selected===f?!a.calendar.disableHoverEvent:!0);a.calendar.selected=f;angular.element(document.querySelectorAll(".selected")).removeClass("selected");b();a.$apply()}))}}});angular.module("rabbit").controller("eventEditorCtrl",["$scope","group","user","eventForm","calF","db","mode","$mdToast",function(a,d,c,b,f,h,e,n){function l(f,l){var k=b.type,C=""===b.name||"event"===k&&(null===b.year||null===b.month||null===b.date)||
"habit"===k&&""===b.rule||b.selectedGroup===E||null===b.selectedGroup;if(C)n.show(n.simple().content("\u5165\u529b\u304c\u4e0d\u9069\u5207\u3067\u3059").position("top right").hideDelay(3E3));else{if("event"===k&&(C=new Date(b.year,b.month-1,b.date),C=C.getFullYear()!==r(b.year)||C.getMonth()!==r(b.month)-1||C.getDate()!==r(b.date)))return;"private"===l?(c["private"][k][f]||(c["private"][k][f]={}),"event"===k?(c["private"][k][f].year=b.year,c["private"][k][f].month=b.month-1,c["private"][k][f].date=
b.date,c["private"][k][f].name=b.name,c.updated=!0):"habit"===k&&(c["private"][k][f].selector=b.rule,c["private"][k][f].name=b.name,c.updated=!0)):(d[b.selectedGroup][k][f]||(d[b.selectedGroup][k][f]={}),"event"===k?(d[b.selectedGroup][k][f].year=b.year,d[b.selectedGroup][k][f].month=b.month-1,d[b.selectedGroup][k][f].date=b.date,d[b.selectedGroup][k][f].name=b.name,d[b.selectedGroup].updated=!0):"habit"===k&&(d[b.selectedGroup][k][f].selector=b.rule,d[b.selectedGroup][k][f].name=b.name,d[b.selectedGroup].updated=
!0));n.show(n.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));e.editsEventForm=!1;k=b.selectedGroup;"private"===k?c.save():h.post(a.group[k],k,"update")}}var y=[],t=[];a.mode=e;a.group=d;a.user=c;a.eventForm=b;a.calF=f;a.ruleWriterFase="";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.ruleGuide={day:[[":sun","\u65e5\u66dc\u65e5"],[":mon","\u6708\u66dc\u65e5"],[":tue","\u706b\u66dc\u65e5"],[":wed","\u6c34\u66dc\u65e5"],
[":thu","\u6728\u66dc\u65e5"],[":fri","\u91d1\u66dc\u65e5"],[":sat","\u571f\u66dc\u65e5"]],month:[[":1","1\u6708"],[":2","2\u6708"],[":3","3\u6708"],[":4","4\u6708"],[":5","5\u6708"],[":6","6\u6708"],[":7","7\u6708"],[":8","8\u6708"],[":9","9\u6708"],[":10","10\u6708"],[":11","11\u6708"],[":12","12\u6708"]],selector:[["month","\u4f55\u6708"],["date","\u4f55\u65e5"],["day","\u4f55\u66dc\u65e5"],["not","\u9664\u304f"],["range","\u7bc4\u56f2"]]};a.addEvent=function(){var c=b.type;"private"===b.selectedGroup?
l(a.user["private"][c].length,b.selectedGroup):null!==b.selectedGroup&&l(a.group[b.selectedGroup][c].length,b.selectedGroup)};a.editEvent=function(){console.log(b);l(b.id,b.selectedGroup)};a.cancel=function(){e.editsEventForm=!1};a.goFase=function(c,d){y[y.length]=a.ruleWriterFase;t[t.length]=d||c;a.ruleWriterFase=c;b.rule=t.join("")};a.cancelFase=function(){a.ruleWriterFase=y.pop();t.pop();b.rule=t.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";y=[];b.rule=t.join("");t=[]};a.startWritingRule=
function(){a.ruleWriterFase="selector";y=[];t=[]}}]);angular.module("rabbit").controller("groupEditorCtrl",["$scope","group","groupForm","db","$mdToast","mode",function(a,d,c,b,f,h){a.groupForm=c;a.groupForm.parentGroup=[null];a.groupForm.mode="add";a.group=d;a.finishMakingAGroup=function(){h.editsGroupForm=!1};a.addGroup=function(){var c=a.groupForm.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?r(b):"");return a},[]),h={event:[],habit:[],name:a.groupForm.name,
updated:!0};""!==c.join("")&&(h.parents=c);d[d.length]=h;b.post(h,a.group.length-1,"insert").success(a.finishMakingAGroup);f.show(f.simple().content("\u30b0\u30eb\u30fc\u30d7 "+a.groupForm.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));a.groupForm.name=""};a.cancel=function(){h.editsGroupForm=!1}}]);angular.module("rabbit").controller("detailCtrl",["$scope","eventCal","calF","user","mode",function(a,d,c,b,f){a.mode=f;a.calF=c;a.eventCalendar=d.eventCalendar;
a.user=b;a.isToday=function(){return c.selected===c.today.date&&c.month===c.today.month&&c.year===c.today.year}}]);angular.module("rabbit").controller("settingCtrl",["$scope","_","group","user","db","eventListToEdit","groupForm","mode","$mdSidenav","$mdToast","$mdDialog",function(a,d,c,b,f,h,e,n,l,r,t){function z(b){return-1!==a.user.following.indexOf(b)}function A(a){if(!c[a].parents)return[];for(var b=c[a].parents,d=0,f=c[a].parents.length;d<f;d++)b=A(c[a].parents[d]).concat(b);return b}a.group=
c;a.user=b;a.groupForm=e;a.search_keyword="";a.searchResult=[];a.hide=function(a){b.hiddenGroup[b.hiddenGroup.length]=a;b.hiddenGroup.sort(D);b.save()};a.show=function(c){b.hiddenGroup=d.without(a.user.hiddenGroup,c);b.save()};a.followsParent=function(a){a=A(a);for(var b=0,c=a.length;b<c;b++)if(!z(a[b]))return a[b];return!0};a.toggleNav=function(){l("left").close()};a.follows=z;a.follow=function(d){a.user.following[a.user.following.length]=d;a.user.following.sort(D);b.save();r.show(r.simple().content(c[d].name+
"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};a.unfollow=function(d){var f=[];f[f.length]=a.user.following.indexOf(d);for(var e=0,h=a.user.following.length;e<h;e++)if(c[a.user.following[e]].parents&&-1!=A(a.user.following[e]).indexOf(d)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+c[a.user.following[e]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;
f[f.length]=e}f.sort(function(a,b){return b-a});e=0;for(h=f.length;e<h;e++)a.user.following.splice(f[e],1);b.save()};a.showEventList=function(a){h.id=a;n.showsEventList=!0};a.makeAGroup=function(){n.editsGroupForm=!0;l("left").close()};a.search=function(){var b=[];if(""==a.search_keyword||!c)return b;for(var d=0,f=c.length;d<f&&!(30<b.length);d++)c[d]&&c[d].name&&-1!==c[d].name.indexOf(a.search_keyword)&&(b[b.length]=d);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>c.length)Array.prototype.push.apply(b,
c);else for(;5>b.length;){var f=Math.random()*c.length|0;-1===d.indexOf(b,f)&&(b[b.length]=f)}a.searchResult=b};a.hideAll=function(){b.hiddenGroup.length=0;b.hiddenGroup=d.clone(b.following);b.hiddenGroup[b.hiddenGroup.length]=-1;b.hiddenGroup.sort(D);b.save()};a.showAll=function(){b.hiddenGroup=[];b.save()};a.importSetting=function(){t.show({controller:["$scope","$mdDialog",function(a,b){a.text="";a.answer=function(a){b.hide(a)}}],template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(a){a=
JSON.parse(a);for(var c in a)b[c]=a[c];b.save()})};a.exportSetting=function(){t.show(t.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(b)).ok("ok"))}}]);angular.module("rabbit").controller("eventListCtrl",["$scope","group","user","eventListToEdit","mode",function(a,d,c,b,f){a.eventListToEdit=b;a.group=d;a.user=c;"private"!==b.id&&""!==b.id?(a.habitList=d[b.id].habit,a.eventList=
d[b.id].event):(a.habitList=c["private"].habit,a.eventList=c["private"].event);a.mode=f}]);angular.module("rabbit").factory("_",function(){return _}).factory("user",["_","$rootScope","$mdDialog","group",function(a,d,c,b){if(localStorage&&angular.fromJson(localStorage.getItem("private"))){var f=angular.fromJson(localStorage.getItem("private"));f.id||(f.id=L());f.updated=!0}else f={following:[],"private":{event:[],habit:[],name:"\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8"},hiddenGroup:[],id:L()},c.show(c.alert().title("[\u91cd\u8981]\u30e6\u30fc\u30b6\u30fc\u60c5\u5831\u3092\u751f\u6210\u3057\u307e\u3057\u305f\u3002").content("\u3053\u308c\u306f\u3042\u306a\u305f\u306e\u30d1\u30bd\u30b3\u30f3\u306b\u306e\u307f\u4fdd\u5b58\u3055\u308c\u308b\u3082\u306e\u3067\u3001\u30c7\u30fc\u30bf\u30d9\u30fc\u30b9\u306b\u767b\u9332\u3055\u308c\u305f\u308a\u3001\u3069\u3053\u304b\u3078\u9001\u3089\u308c\u305f\u308a\u3057\u307e\u305b\u3093\u3002\u305f\u3060\u3057\u3001\u306a\u306b\u304b\u306e\u62cd\u5b50\u306b\u30c7\u30fc\u30bf\u304c\u6d88\u53bb\u3055\u308c\u3066id\u304c\u5909\u66f4\u3055\u308c\u3066\u3057\u307e\u3046\u3068\u30b0\u30eb\u30fc\u30d7\u306e\u6a29\u9650\u304c\u6d88\u3048\u3066\u3057\u307e\u3044\u307e\u3059\u3002\u3060\u304b\u3089\u3001\u6b21\u306e\u6587\u5b57\u5217\u3092\u4fdd\u5b58\u3057\u3066\u304a\u3044\u3066\u304f\u3060\u3055\u3044\u3002"+
angular.toJson(f)).ok("ok"));f.isHiddenGroup=function(b){return-1!==a.indexOf(this.hiddenGroup,b,!0)};f.save=function(){d.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))};f.hasPermission=function(c){return"private"===c||-1!==a.indexOf(b[c].permission,f.id)};f.save();return f}]).factory("eventForm",function(){return{name:"",year:(new Date).getFullYear(),month:(new Date).getMonth()+1,date:(new Date).getDate(),type:"event",rule:""}}).factory("groupForm",function(){return{name:""}}).factory("group",
["$http",function(a){var d=[{id:0,event:[{name:"[mes]\u5341\u4e94\u591c",year:2E3,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2001,month:9,date:1},{name:"[mes]\u5341\u4e94\u591c",year:2002,month:8,date:21},{name:"[mes]\u5341\u4e94\u591c",year:2003,month:8,date:11},{name:"[mes]\u5341\u4e94\u591c",year:2004,month:8,date:28},{name:"[mes]\u5341\u4e94\u591c",year:2005,month:8,date:18},{name:"[mes]\u5341\u4e94\u591c",year:2006,month:9,date:6},{name:"[mes]\u5341\u4e94\u591c",year:2007,month:8,
date:25},{name:"[mes]\u5341\u4e94\u591c",year:2008,month:8,date:14},{name:"[mes]\u5341\u4e94\u591c",year:2009,month:9,date:3},{name:"[mes]\u5341\u4e94\u591c",year:2010,month:8,date:22},{name:"[mes]\u5341\u4e94\u591c",year:2011,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2012,month:8,date:30},{name:"[mes]\u5341\u4e94\u591c",year:2013,month:8,date:19},{name:"[mes]\u5341\u4e94\u591c",year:2014,month:8,date:8},{name:"[mes]\u5341\u4e94\u591c",year:2015,month:8,date:27},{name:"[mes]\u5341\u4e94\u591c",
year:2016,month:8,date:15}],habit:[{name:"[mes]\u5143\u65e6",selector:"month:1 date:1"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"month:1 day:2nd-mon"},{name:"[mes]\u662d\u548c\u306e\u65e5",selector:"month:4 date:29"},{name:"[mes]\u5efa\u56fd\u8a18\u5ff5\u65e5",selector:"month:2 date:11"},{name:"[mes]\u61b2\u6cd5\u8a18\u5ff5\u65e5",selector:"month:5 date:3"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"month:5 date:4"},{name:"[mes]\u3053\u3069\u3082\u306e\u65e5",selector:"month:5 date:5"},
{name:"[mes]\u6d77\u306e\u65e5",selector:"month:7 day:3rd-mon"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"month:9 day:3rd-mon"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",selector:"month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"month:12 date:23"}],name:"\u795d\u65e5",updated:!0}],c={name:"[mes]\u79cb\u5206\u306e\u65e5",month:8};
_.each([23,23,23,23,23,23,23,23,23,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23],function(a,b){d[0].event[d[0].event.length]=_.extend(_.clone(c),{year:2E3+b,date:a})});var b={name:"[mes]\u6625\u5206\u306e\u65e5",month:2};_.each([20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,20,21,20,20,20],function(a,c){d[0].event[d[0].event.length]=_.extend(_.clone(b),{year:2E3+c,date:a})});return d}]).factory("calF",function(){var a=new Date,d=[];return{year:a.getFullYear(),
month:a.getMonth(),date:a.getDate(),calendar:function(a,b){if(d[a-1950]){if(d[a-1950][b])return d[a-1950][b]}else d[a-1950]=[];var f=(new Date(a,b,1)).getDay(),h=[31,28,31,30,31,30,31,31,30,31,30,31][b];1===b&&K(a)&&(h=29);var e=[];e.year=a;e.month=b;for(var n=0;0===n||_.last(e[n-1])<h;){e[n]=[];for(var l=1;7>=l;l++)e[n][e[n].length]=0<7*n+l-f?7*n+l-f<=h?7*n+l-f:64:0;n++}return d[a-1950][b]=e},today:{year:a.getFullYear(),month:a.getMonth(),date:a.getDate()},selected:a.getDate(),selectedDay:function(){return null==
this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,this.month,this.selected)).getDay()]},disableHoverEvent:M}}).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var d=d||Error;return function(c){a.show(a.simple().content(c).position("top right").hideDelay(3E3));return new d(c)}}]).factory("mode",["_","eventForm","$mdSidenav","user","group",function(a,d,c,b,f){return{editsEventForm:!1,editsGroupForm:!1,showsEventList:!1,
switchToEdit:function(){var h=O.call(arguments);if(1===h.length||2===h.length&&!0===h[1]){var e=h[0].split(":");d.mode=1===h.length?"edit":"add";a.extend(d,{type:e[2],id:1===h.length?e[0]:0});d.selectedGroup="private"!==e[1]?r(e[1]):"private";"event"===e[2]?(a.map(["year","month","date","name"],function(a){d[a]="private"===e[1]?b["private"].event[e[0]][a]:f[e[1]].event[e[0]][a]}),d.month+=1):"habit"===e[2]&&("private"===e[1]?(d.rule=b["private"].habit[e[0]].selector,d.name=b["private"].habit[e[0]].name):
(d.rule=f[e[1]].habit[e[0]].selector,d.name=f[e[1]].habit[e[0]].name))}else 3===h.length&&a.extend(d,{mode:"add",type:"event",rule:"",id:0,name:"",year:h[0],month:h[1]+1,date:h[2]});this.editsEventForm=!0;c("left").close()}}}]).factory("db",["_","group","user","$http","$rootScope","$log",function(a,d,c,b,f,h){return{post:function(c,d,l){c=a.clone(c);c.id=d;c.permission=c.permission||[];c.parents=c.parents||"";delete c.updated;for(var r in c)c[r]=N(angular.toJson(c[r]));c.type=l;f.$broadcast("updated");
return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",c).success(function(a){h.log("updated");h.log(a)}).error(function(a){h.log(a)})},list:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:c.following.join(",")}).success(function(a){return a}).error(function(a){h.log(a)})},getNameList:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"namelist"}).success(function(a){return a})}}}]).factory("eventCal",
["_","group","user","calF","error",function(a,d,c,b,f){function h(b,f,w){if("private"!==b&&!d[b])return[];var u=[],B=[];"private"===b?(a.each(c.following,function(a){B=B.concat(h(a,f,w))}),u=u.concat(e(c["private"].event,f,w,"private")),B=B.concat(u),u=u.concat(n(c["private"].habit,f,w,"private",B)),c.updated=!1):(d[b].parents&&a.each(d[b].parents,function(a){B=B.concat(h(a,f,w))}),u=u.concat(e(d[b].event,f,w,b)),B=B.concat(u),u=u.concat(n(d[b].habit,f,w,b,B)),d[b].updated=!1);if(0===b){var q=a.map(u,
function(a){return a.date});b=a.intersection(q,l("day:sun",f,w,[]));u.push.apply(u,a.map(b,function(b){for(var c=1;-1!==a.indexOf(q,b+c,!0);)c+=1;return{year:f,month:w,date:b+c,name:"[mes]\u632f\u66ff\u4f11\u65e5",group:0,id:-1,type:"habit"}}));u.sort()}return u}function e(b,c,d,f){var e=[];if(!b)return e;for(var h=0,G=b.length;h<G;h++)if(b[h].year===c&&b[h].month===d){var I=a.clone(b[h]);I.group=f;I.type="event";I.id=h;e[e.length]=I}return e}function n(b,c,d,f,e){if(!b)return[];for(var h=[],G=0,
I=b.length;G<I;G++){b[G].type="habit";b[G].group=f;var p=l(b[G].selector,c,d,e);a.each(p,function(a,e){p[e]={year:c,month:d,date:a,name:b[G].name,group:f,id:G,type:"habit"}});h=h.concat(p)}return h}function l(c,e,k,u){function B(c,e,p,P){var q=function(){return a.flatten(u)},k=function(a){a=a.toLowerCase();return"public-holiday"===a||"publicholiday"===a||"\u795d\u65e5"===a},u=b.calendar(e,p),w={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,monday:1,mon:1,"\u6708\u66dc\u65e5":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,
wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,thursday:4,thu:4,"\u6728\u66dc\u65e5":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,saturday:6,sat:6,"\u571f\u66dc\u65e5":6},n={january:0,jan:0,"\u7766\u6708":0,february:1,feb:1,"\u5982\u6708":1,march:2,mar:2,"\u5f25\u751f":2,april:3,apr:3,"\u536f\u6708":3,may:4,"\u7690\u6708":4,june:5,jun:5,"\u6c34\u7121\u6708":5,july:6,jul:6,"\u6587\u6708":6,august:7,aug:7,"\u8449\u6708":7,september:8,sep:8,"\u9577\u6708":8,october:9,oct:9,"\u795e\u7121\u6708":9,november:10,nov:10,
"\u971c\u6708":10,december:11,dec:11,"\u5e2b\u8d70":11};if(z[e-1950])if(z[e-1950][p]){if(z[e-1950][p][c])return a.clone(z[e-1950][p][c])}else z[e-1950][p]={};else z[e-1950]=[],z[e-1950][p]={};var l=c.split(":")[0],g=c.split(":").slice(1).join(":"),m=[],H=[],t=[],C=[],v,x,F,y,A=[];if("not"===l)if(m=q(),k(g)){g=h(0,e,p);k=0;for(w=g.length;k<w;k++)g[k]=g[k].date;m=a.difference(m,g);z[e-1950][p][c]=a.clone(m)}else if(0===g.indexOf("year")||0===g.indexOf("month")||0===g.indexOf("date")||0===g.indexOf("day"))g=
g.replace(/=/,":"),m=a.difference(q(),B(g,e,p));else{var E=g.split("=")[0],D=g.replace(/^.+?=/,""),D=D.replace(/^"(.+)"$/,"$1");a.each(P,function(b){if(b[E]===D||0===b[E].indexOf("[mes]")&&b[E].slice(5)===D)m=a.without(m,b.date)})}else if("is"===l){m=q();if(k(g)){g=h(0,e,p);k=0;for(w=g.length;k<w;k++)g[k]=g[k].date;m=a.intersection(m,g)}else{if("last"===g)return c=[31,28,31,30,31,30,31,31,30,31,30,31][p],K(e)&&1===p&&(c=29),[c];throw f("unexpected a value of a yesterday selector."+g);}z[e-1950][p][c]=
a.clone(m)}else if("yesterday"===l){m=q();w=g.split(":")[0];g.split(":").slice(1).join(":");if(k(g))m=a.intersection(m,a.map(B("is:"+g,e,p),function(a){return a+1})),z[e-1950][p][c]=a.clone(m);else if("day"===w||"date"===w)m=a.intersection(q(),a.map(B(g,e,p),function(a){return a+1}));else throw f("unexpected a value of a yesterday selector."+g);z[e-1950][p][c]=a.clone(m)}else if("range"===l)if(".."===g.slice(0,2))g="..."===g.slice(0,3)?g.slice(3):g.slice(2),m=q(),g=g.split("/"),g=a.map(g,r),x=new Date(g[0],
g[1]-1,g[2]),x.getFullYear()<e||x.getFullYear()==e&&x.getMonth()<p?m=[]:x.getFullYear()==e&&x.getMonth()==p?(m=q(),m=a.filter(m,function(a){return a<=x.getDate()})):m=q();else if(".."===g.slice(-2))g="..."===g.slice(-3)?g.slice(0,-3):g.slice(0,-2),g=g.split("/"),g=a.map(g,r),v=new Date(g[0],g[1]-1,g[2]),v.getFullYear()>e||v.getFullYear()==e&&v.getMonth()>p?m=[]:v.getFullYear()==e&&v.getMonth()==p?(m=q(),m=a.filter(m,function(a){return a>=v.getDate()})):m=q();else if(-1!==g.indexOf(".."))m=[],g=g.split("..."),
1===g.length&&(g=g[0].split("..")),H=[],t=[],C=[],v=g[0],x=g[1],F=x.substr(x.length-4,4),y=x.substr(x.length-5,5),A=[],v=v.split("/"),v=a.map(v,r),3===v.length?(g=new Date(v[0],v[1]-1,v[2]),A.push(g)):2===v.length&&(g=new Date(e-1,v[0]-1,v[1]),A.push(g,new Date(e,v[0]-1,v[1]))),a.each(A,function(b){b.getFullYear()>e||b.getFullYear()==e&&b.getMonth()>p?H=[]:b.getFullYear()==e&&b.getMonth()==p?(H=q(),H=a.filter(H,function(a){return a>=b.getDate()})):H=q();C.push(H)}),A=a.zip(A,C),a.each(A,function(b){var c=
b[0];b=b[1];var d;if("date"===F||"week"===F||"year"===F||"dates"===y||"weeks"===y||"years"===y){var f;f="date"===F||"week"===F||"year"===F?r(x.substring(0,x.length-4)):r(x.substring(0,x.length-5));d=new Date(c.getTime());"date"===F||"dates"===y?d.setDate(d.getDate()+f):"week"===F||"weeks"===y?d.setDate(d.getDate()+7*f):"year"!==F&&"years"!==y||d.setFullYear(d.getFullYear()+f)}else d=x.split("/"),d=a.map(d,r),3===d.length?d=new Date(d[0],d[1]-1,d[2]):(d=new Date(c.getFullYear(),d[0]-1,d[1]),d.getTime()<
c.getTime()&&d.setFullYear(d.getFullYear()+1));d.getFullYear()<e||d.getFullYear()==e&&d.getMonth()<p?t=[]:d.getFullYear()==e&&d.getMonth()==p?(t=q(),t=a.filter(t,function(a){return a<=d.getDate()})):t=q();a.isEmpty(a.intersection(b,t))||(m=a.intersection(b,t))});else throw f('invalid selector "'+l+":"+g+'" in '+d[groupID].name+".");else if("date"===l)m[m.length]=r(g);else if("month"===l)m=!n[g.toLowerCase()]&&r(g)!==p+1||n[g.toLowerCase()]&&n[g.toLowerCase()]!=p?[]:q();else if("day"===l)if(g.match(/^\d/)){for(var g=
g.match(/^(\d+)(?:st|[nr]d|th)-?(.+)$/i),k=r(g[1]),J=w[g[2].toLowerCase()],g=0;""===u[g][J];)g++;m[m.length]=u[g-1+k][J]}else J=w[g.toLowerCase()],a.some(u,function(a){""!==a[J]&&(m[m.length]=a[J])});else if("year"===l)m="leap-year"===g||"leap_year"===g||"\u3046\u308b\u3046\u5e74"===g||"\u958f\u5e74"===g?K(e)?q():[]:r(g)!==e?[]:q();else throw f('undefined key "'+l+'".');for(;64===m[m.length-1];)m.pop();"day"===l&&(z[e-1950][p][c]=a.clone(m));return m}if(""===c)throw f("cannot exec empty selector.");
c=t(y(c));u=u||[];var q=[];a.each(c,function(b){if(1===b[1])q[q.length]=B(b[0],e,k,u);else if(0===b[1])if("&&"===b[0])q.push(a.intersection(q.pop(),q.pop()));else if("||"===b[0])q.push(a.union(q.pop(),q.pop()));else throw f("undefined operator "+b[0]);});if(1!=q.length)throw console.log(q,c),f("unexpected error in execSelectors().");return q.pop()}function y(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(A[a])return A[a];for(var c=[],d=!1,f=0,e=0,h=a.length;e<h;e++){var k=a.charAt(e);if(d)'"'===k?
d=!1:"\\"===k&&(e+=1);else if('"'===k)d=!0;else if(" "===k){b([a.substring(f,e),1]);var k={" and ":"&&"," \u304b\u3064 ":"&&"," && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"},p=!1,l;a:for(l in k)if(a.substr(e,l.length)===l){b([k[l],0]);f=e+l.length;e+=l.length;p=!0;break a}p||(b(["&&",0]),f=e+1,e+=1)}else if("("===k||")"===k)b([a.substring(f,e),1]),b([k,"("===k?2:3]),f=e+1}""!==a.substring(f)&&b([a.substring(f),1]);return A[a]=c}function t(a){for(var b=[],c=[],d={"||":0,"&&":1},e=
0,h=a.length;e<h;e++)if(1===a[e][1])c[c.length]=a[e].concat();else if(0===a[e][1]){var k=a[e][0];b[b.length-1]&&d[k]<=d[b[b.length-1][0]]&&(c[c.length]=b.pop());b[b.length]=a[e]}else if(2===a[e][1])b[b.length]=a[e];else if(3===a[e][1]){for(;2!=b[b.length-1][1];)if(c[c.length]=b.pop(),0===b.length)throw f("found mismatched parentheses");b.pop()}for(;0<b.length;){if(2===b[b.length-1][1])throw f("found mismatched parentheses.");c[c.length]=b.pop()}return c}var z=[],A={},k=[],C="",E=-1,D=-1;return{eventCalendar:function(d){var e=
[],f=[],l=a.difference(c.following,c.hiddenGroup);if(b.year!==E||b.month!==D)E=b.year,D=b.month,k=[];else if(l.join(",")!==C||c.updated||a.any(l,function(a){return!0===a.updated}))k=[],C=l.join(",");else return k[d]||[];for(var n=0,q=l.length;n<q;n++)e[e.length]=h(l[n],b.year,b.month);c.isHiddenGroup(-1)||(e[e.length]=h("private",b.year,b.month));n=0;for(q=e.length;n<q;n++)for(var r=0,t=e[n].length;r<t;r++){var p=e[n][r].date;f[p]||(f[p]=[]);f[p][f[p].length]=e[n][r].id+":"+e[n][r].group+":"+e[n][r].type}k=
a.clone(f);C=l.join(",");return k[d]||[]},splitSelector:y,execSelectors:l}}]).run(["calF","$timeout",function(a,d){function c(){var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);var h=new Date;a.today.year=h.getFullYear();a.today.month=h.getMonth();a.today.date=h.getDate();d(c,b-new Date)}var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);d(c,b-new Date)}])})(window);
