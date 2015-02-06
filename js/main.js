'use strict';(function(L,A){function B(a,d){return a-d}function l(a){return parseInt(a,10)}var J=0<navigator.userAgent.indexOf("iPhone")&&-1==navigator.userAgent.indexOf("iPad")||0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android");angular.module("rabbit",["ngTouch","ngAnimate","ngMaterial","ngMessages"]).controller("mainCtrl",["$scope","_","calF","eventCal","mode","$mdSidenav",function(a,d,b,c,f,e){console.log(f,e);a._=d;a.mode=f;f.editsEventForm=!1;f.editsGroupForm=!1;
a.splitSelector=c.splitSelector;a.openNav=function(){e("left").toggle()};b.selected=b.date;a.eventCalendar=c.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=function(a){if(a===A)return a;if(angular.isObject(a)){var b=[],c;for(c in a)if(a.hasOwnProperty(c)){var f=a[c];b[b.length]=encodeURIComponent(c)+"="+encodeURIComponent(null==f?"":f)}a=b.join("&").replace(/%20/g,"+")}else a=null==a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",
["group","user",function(a,d){return function(b,c){b=b.split(":");var f="",f="private"==b[1]?d["private"][b[2]][b[0]].name:a[b[1]][b[2]][b[0]].name;!1!==c&&0===f.indexOf("[mes]")&&(f=f.replace(/^\[mes\]/,""));return f}}]).run(["db","group","$rootScope",function(a,d,b){var c=_.clone(d);localStorage&&localStorage.getItem("group")&&(d.length=0,Array.prototype.push.apply(d,angular.fromJson(localStorage.getItem("group"))),d[0]=_.clone(c));a.list().then(function(f){f=f.data;for(var e=0,h=f.length;e<h;e++){for(var g in f[e])f[e][g]=
angular.fromJson(f[e][g]);f[e].updated=!0}f.sort(function(a,c){return a.id-c.id});e=d.length=0;for(h=f.length;e<h;e++)d[f[e].id]=f[e];d[0]=_.clone(c);b.$broadcast("updated");localStorage.setItem("group",angular.toJson(d));a.getNameList().then(function(a){for(var b=0,f=a.data[0].length;b<f;b++)d[b]||(d[b]={name:angular.fromJson(a.data[0][b])},a.data[1][b]&&(d[b].parents=angular.fromJson(a.data[1][b])));d[0]=_.clone(c);localStorage.setItem("group",angular.toJson(d))})})}]).directive("appDate",[function(){return{scope:{row:"=appRow"},
restrict:"A",template:'<span class="date" ng-transclude></span>',transclude:!0,replace:!0,controller:["$scope","calF","eventCal","$filter",function(a,d,b,c){a.calendar=d;a.bookedClass=function(a){a=b.eventCalendar(a);for(var d=0,h=0,g=a.length;h<g;h++)0!==c("format")(a[h],!1).indexOf("[mes]")&&d++;return 5>d?"booked-"+d:"booked-5"};a.dateClass=function(c){if(0!==c&&32!==c){var b=a.calendar,d=[];b.selected===c&&(d[d.length]="selected");d[d.length]=a.bookedClass(c);c===b.today.date&&b.month===b.today.month&&
b.year===b.today.year&&(d[d.length]="today");return d}return[]}}],link:function(a,d,b){function c(){d.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");d.addClass(a.dateClass(f).join(" "))}var f=a.row[b.appDate];""!==f&&f!==A&&(a.$on("updated",c),c(),d.on("mouseenter",function(){!a.calendar.disableHoverEvent&&f&&(a.calendar.selected=f,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),c(),a.$apply())}),d.on("mouseleave",function(){a.calendar.disableHoverEvent||
(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),a.$apply())}),d.on("click",function(){J||(a.calendar.disableHoverEvent=a.calendar.selected===f?!a.calendar.disableHoverEvent:!0);a.calendar.selected=f;angular.element(document.querySelectorAll(".selected")).removeClass("selected");c();a.$apply()}))}}}]);angular.module("rabbit").controller("calendarCtrl",["$scope","calF","mode",function(a,d,b){a.calF=d;a.nextMonth=function(){a.calF.month++;a.calF.selected=
null;12<a.calF.month+1&&(a.calF.year+=1,a.calF.month-=12);b.editsEventForm=!1};a.lastMonth=function(){a.calF.month--;a.calF.selected=null;1>a.calF.month+1&&(1950>a.calF.year-1?(alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),a.calF.month+=1):(a.calF.month+=12,--a.calF.year));b.editsEventForm=!1};a.nextYear=function(){a.calF.year++;a.calF.selected=null;b.editsEventForm=!1};a.lastYear=
function(){1950>a.calF.year-1?alert("1950\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(a.calF.year--,a.calF.selected=null);b.editsEventForm=!1}}]);angular.module("rabbit").controller("eventEditorCtrl",["$scope","group","user","eventForm","calF","db","mode","$mdToast",function(a,d,b,c,f,e,h,g){function H(c){"private"===c?b.save():e.post(a.group[c],c,"update")}var p=[],q=[];a.mode=h;a.group=d;
a.user=b;a.eventForm=c;a.calF=f;a.ruleWriterFase="";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.addEvent=function(){var b=a.eventForm.type;if(""!==c.name&&c.selectedGroup!==A&&null!==c.selectedGroup){var d=new Date(c.year,c.month-1,c.date);if(d.getFullYear()===l(c.year)&&d.getMonth()===l(c.month)-1&&d.getDate()===l(c.date)){if("event"==b)var f={year:c.year,month:c.month-1,date:c.date,name:c.name};else"habit"==b&&(f={selector:c.rule,name:c.name});"private"===c.selectedGroup?(a.user["private"][b][a.user["private"][b].length]=
f,a.user.updated=!0):null!==c.selectedGroup&&(a.group[c.selectedGroup][b][a.group[c.selectedGroup][b].length]=f,a.group[c.selectedGroup].updated=!0);g.show(g.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));h.editsEventForm=!1;H(c.selectedGroup)}}};a.saveEvent=function(){var b=c.type;if(null!==c.year&&null!==c.month&&null!==c.date&&""!==c.name){var d=new Date(c.year,c.month-1,c.date);if(d.getFullYear()===l(c.year)&&d.getMonth()===
l(c.month)-1&&d.getDate()===l(c.date)){if("private"===c.selectedGroup)var f=a.user["private"][b][c.id];else null!==c.selectedGroup&&(f=a.group[c.selectedGroup][b][c.id],a.group[c.selectedGroup].updated=!0);"event"==b?(f.year=c.year,f.month=c.month-1,f.date=c.date,f.name=c.name):"habit"==b&&(f.selector=c.rule,f.name=c.name);h.editsEventForm=!1;H(c.selectedGroup)}}};a.cancel=function(){h.editsEventForm=!1};a.goFase=function(b,d){p[p.length]=a.ruleWriterFase;q[q.length]=d||b;a.ruleWriterFase=b;c.rule=
q.join("")};a.cancelFase=function(){a.ruleWriterFase=p.pop();q.pop();c.rule=q.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";p=[];c.rule=q.join("");q=[]};a.startWritingRule=function(){a.ruleWriterFase="selector";p=[];q=[]}}]);angular.module("rabbit").controller("groupEditorCtrl",["$scope","group","groupForm","db","$mdToast","mode",function(a,d,b,c,f,e){a.groupForm=b;a.groupForm.parentGroup=[null];a.groupForm.mode="add";a.group=d;a.finishMakingAGroup=function(){e.editsGroupForm=!1};a.addGroup=
function(){var b=a.groupForm.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?l(b):"");return a},[]),e={event:[],habit:[],name:a.groupForm.name,updated:!0};""!==b.join("")&&(e.parents=b);d[d.length]=e;c.post(e,a.group.length-1,"insert").success(a.finishMakingAGroup);f.show(f.simple().content("\u30b0\u30eb\u30fc\u30d7 "+a.groupForm.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));a.groupForm.name=""}}]);angular.module("rabbit").controller("detailCtrl",
["$scope","eventCal","calF","mode",function(a,d,b,c){a.mode=c;a.calF=b;a.eventCalendar=d.eventCalendar}]);angular.module("rabbit").controller("settingCtrl",["$scope","group","user","db","eventListToEdit","groupForm","mode","$mdSidenav","$mdToast","$mdDialog",function(a,d,b,c,f,e,h,g,l,p){function q(b){return-1!==a.user.following.indexOf(b)}function t(a){if(!d[a].parents)return[];for(var b=d[a].parents,c=0,f=d[a].parents.length;c<f;c++)b=t(d[a].parents[c]).concat(b);return b}a.group=d;a.user=b;a.groupForm=
e;a.search_keyword="";a.searchResult=[];a.hide=function(a){b.hiddenGroup[b.hiddenGroup.length]=a;b.hiddenGroup.sort(B);b.save()};a.show=function(c){b.hiddenGroup=_.without(a.user.hiddenGroup,c);b.save()};a.followsParent=function(a){a=t(a);for(var b=0,c=a.length;b<c;b++)if(!q(a[b]))return a[b];return!0};a.toggleNav=function(){console.log("called");g("left").close()};a.follows=q;a.follow=function(c){a.user.following[a.user.following.length]=c;a.user.following.sort(B);b.save();l.show(l.simple().content(d[c].name+
"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};a.unfollow=function(c){var f=[];f[f.length]=a.user.following.indexOf(c);for(var x=0,m=a.user.following.length;x<m;x++)if(d[a.user.following[x]].parents&&-1!=t(a.user.following[x]).indexOf(c)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+d[a.user.following[x]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;
f[f.length]=x}f.sort(function(a,b){return b-a});x=0;for(m=f.length;x<m;x++)a.user.following.splice(f[x],1);b.save()};a.showEventList=function(a){f.id=a;h.showsEventList=!0};a.makeAGroup=function(){e.isEditMode=!0;g("left").close()};a.search=function(){var b=[];if(""==a.search_keyword)return b;for(var c=0,f=d.length;c<f&&!(30<b.length);c++)-1!==d[c].name.indexOf(a.search_keyword)&&(b[b.length]=c);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>d.length)Array.prototype.push.apply(b,d);else for(;5>
b.length;){var c=Math.random()*d.length|0;-1===_.indexOf(b,c)&&(b[b.length]=c)}a.searchResult=b};a.hideAll=function(){b.hiddenGroup.length=0;b.hiddenGroup=_.clone(b.following);b.hiddenGroup[b.hiddenGroup.length]=-1;b.hiddenGroup.sort(B);b.save()};a.showAll=function(){b.hiddenGroup=[];b.save()};a.importSetting=function(){p.show({controller:["$scope","$mdDialog",function(a,b){a.text="";a.answer=function(a){b.hide(a)}}],template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(a){a=
JSON.parse(a);for(var c in a)b[c]=a[c];b.save()})};a.exportSetting=function(){p.show(p.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(b)).ok("ok"))}}]).directive("autoFocus",function(){return{link:function(a,d,b){a.$watch("focus",function(b){!0===a.focus&&d[0].focus()})}}});angular.module("rabbit").controller("eventListCtrl",["$scope","group","user","eventListToEdit","eventForm",
"mode","$log",function(a,d,b,c,f,e,h){a.eventListToEdit=c;a.group=d;a.user=b;h.log("eventListToEdit.id===",c.id);"private"!==c.id&&""!==c.id?(a.habitList=d[c.id].habit,a.eventList=d[c.id].event):(a.habitList=b["private"].habit,a.eventList=b["private"].event);a.mode=e}]);angular.module("rabbit").factory("_",function(){return _}).factory("user",["$rootScope",function(a){if(localStorage&&angular.fromJson(localStorage.getItem("private"))){var d=angular.fromJson(localStorage.getItem("private"));d.isHiddenGroup=
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
function(){var a=new Date,d=[];return{year:a.getFullYear(),month:a.getMonth(),date:a.getDate(),calendar:function(a,c){if(d[a-1950]){if(d[a-1950][c])return d[a-1950][c]}else d[a-1950]=[];var f=(new Date(a,c,1)).getDay(),e=[31,28,31,30,31,30,31,31,30,31,30,31][c];1===c&&(0==a%400||0!=a%100&&0==a%4)&&(e=29);var h=[];h.year=a;h.month=c;var g=0;for(;;){h[g]=[];for(var l=1;7>=l;l++)h[g][h[g].length]=0<7*g+l-f?7*g+l-f<=e?7*g+l-f:32:0;if(h[g][h[g].length-1]>=e)break;g++}return d[a-1950][c]=h},today:{year:a.getFullYear(),
month:a.getMonth(),date:a.getDate()},selected:a.getDate(),selectedDay:function(){return null==this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,this.month,this.selected)).getDay()]},disableHoverEvent:J}}).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var d=d||Error;return function(b){a.show(a.simple().content(b).position("top right").hideDelay(3E3));return new d(b)}}]).factory("mode",["eventForm","$mdSidenav",
function(a,d){return{editsEventForm:!1,editsGroupForm:!1,showsEventList:!1,switchToEdit:function(){var b=Array.prototype.slice.call(arguments);if(1===b.length||2===b.length&&!0===b[1]){var c=b[0];a.mode=1===b.length?"edit":"add";c=c.split(":");_.extend(a,{type:c[2],id:1===b.length?c[0]:0});a.selectedGroup="private"!==c[1]?l(c[1]):c[1];"event"===c[2]?(_.map(["year","month","date","name"],function(b){a[b]="private"===c[1]?user["private"].event[c[0]][b]:group[c[1]].event[c[0]][b]}),a.month+=1):"habit"===
c[2]&&("private"===c[1]?(a.rule=user["private"].habit[c[0]].selector,a.name=user["private"].habit[c[0]].name):(a.rule=group[c[1]].habit[c[0]].selector,a.name=group[c[1]].habit[c[0]].name))}else 3===b.length&&_.extend(a,{mode:"add",type:"event",rule:"",id:0,name:"",year:b[0],month:b[1]+1,date:b[2]});this.editsEventForm=!0;d("left").close()}}}]).run(["calF","$timeout",function(a,d){function b(){var c=new Date;c.setDate(c.getDate()+1);c.setHours(0);c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0);
var e=new Date;a.today.year=e.getFullYear();a.today.month=e.getMonth();a.today.date=e.getDate();d(b,c-new Date)}var c=new Date;c.setDate(c.getDate()+1);c.setHours(0);c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0);d(b,c-new Date)}]).factory("db",["group","user","$http","$rootScope",function(a,d,b,c){return{post:function(a,d,h){a=_.clone(a);a.id=d;a.permission=a.permission||[];a.parents=a.parents||"";delete a.updated;for(var l in a)a[l]=angular.toJson(a[l]);a.type=h;c.$broadcast("updated");return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",
a).success(function(a){console.log("updated");console.log(a)}).error(function(a){console.log(a)})},list:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:d.following.join(",")}).success(function(a){return a}).error(function(a){console.log(a)})},getNameList:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"namelist"}).success(function(a){return a})}}}]);angular.module("rabbit").factory("eventCal",["group","user",
"calF","error",function(a,d,b,c){function f(c,b,l){if("private"!==c&&!a[c])return[];var w=[],y=[];"private"===c?(_.each(d.following,function(a){y=y.concat(f(a,b,l))}),w=w.concat(e(d["private"].event,b,l,"private")),y=y.concat(w),w=w.concat(h(d["private"].habit,b,l,"private",y)),d.updated=!1):(a[c].parents&&_.each(a[c].parents,function(a){y=y.concat(f(a,b,l))}),w=w.concat(e(a[c].event,b,l,c)),y=y.concat(w),w=w.concat(h(a[c].habit,b,l,c,y)),a[c].updated=!1);return w}function e(a,c,b,d){var f=[];if(!a)return f;
for(var l=0,e=a.length;l<e;l++)if(a[l].year===c&&a[l].month===b){var h=_.clone(a[l]);h.group=d;h.type="event";h.id=l;f[f.length]=h}return f}function h(d,m,e,w,y){function h(d,m,e){function x(d,m,e){var h=function(){return _.clone(K)},g=b.calendar(m,e),u={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,monday:1,mon:1,"\u6708\u66dc\u65e5":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,thursday:4,thu:4,"\u6728\u66dc\u65e5":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,saturday:6,sat:6,
"\u571f\u66dc\u65e5":6},q={January:0,Jan:0,"\u7766\u6708":0,February:1,Feb:1,"\u5982\u6708":1,March:2,Mar:2,"\u5f25\u751f":2,April:3,Apr:3,"\u536f\u6708":3,May:4,"\u7690\u6708":4,June:5,Jun:5,"\u6c34\u7121\u6708":5,July:6,Jul:6,"\u6587\u6708":6,August:7,Aug:7,"\u8449\u6708":7,September:8,Sep:8,"\u9577\u6708":8,October:9,Oct:9,"\u795e\u7121\u6708":9,November:10,Nov:10,"\u971c\u6708":10,December:11,Dec:11,"\u5e2b\u8d70":11};if(p[m-1950])if(p[m-1950][e]){if(p[m-1950][e][d])return _.clone(p[m-1950][e][d])}else p[m-
1950][e]={};else p[m-1950]=[],p[m-1950][e]={};var D=d.split(":")[0],k=d.split(":").slice(1).join(":"),n=[],t=[],z=[],A=[],r,v,C,F,E=[];if("not"===D)if(n=h(),"public-holiday"===k||"\u795d\u65e5"===k){g=f(0,m,e);u=0;for(k=g.length;u<k;u++)g[u]=g[u].date;n=_.difference(n,g);p[m-1950][e][d]=_.clone(n)}else if(0===k.indexOf("year")||0===k.indexOf("month")||0===k.indexOf("date")||0===k.indexOf("day"))k=k.replace(/=/,":"),n=_.difference(h(),x(k,m,e));else{var B=k.split("=")[0],I=k.replace(/^.+?=/,""),I=
I.replace(/^"(.+)"$/,"$1");_.each(y,function(a){if(a[B]===I||0===a[B].indexOf("[mes]")&&a[B].slice(5)===I)n=_.without(n,a.date)})}else if("range"===D)if(".."===k.slice(0,2))k="..."===k.slice(0,3)?k.slice(3):k.slice(2),n=h(),k=k.split("/"),k=_.map(k,l),v=new Date(k[0],k[1]-1,k[2]),v.getFullYear()<m||v.getFullYear()==m&&v.getMonth()<e?n=[]:v.getFullYear()==m&&v.getMonth()==e?(n=h(),n=_.filter(n,function(a){return a<=v.getDate()})):n=h();else if(".."===k.slice(-2))k="..."===k.slice(-3)?k.slice(0,-3):
k.slice(0,-2),k=k.split("/"),k=_.map(k,l),r=new Date(k[0],k[1]-1,k[2]),r.getFullYear()>m||r.getFullYear()==m&&r.getMonth()>e?n=[]:r.getFullYear()==m&&r.getMonth()==e?(n=h(),n=_.filter(n,function(a){return a>=r.getDate()})):n=h();else if(-1!==k.indexOf(".."))n=[],k=k.split("..."),1===k.length&&(k=k[0].split("..")),t=[],z=[],A=[],r=k[0],v=k[1],C=v.substr(v.length-4,4),F=v.substr(v.length-5,5),E=[],r=r.split("/"),r=_.map(r,l),3===r.length?(g=new Date(r[0],r[1]-1,r[2]),E.push(g)):2===r.length&&(g=new Date(m-
1,r[0]-1,r[1]),E.push(g,new Date(m,r[0]-1,r[1]))),_.each(E,function(a){a.getFullYear()>m||a.getFullYear()==m&&a.getMonth()>e?t=[]:a.getFullYear()==m&&a.getMonth()==e?(t=h(),t=_.filter(t,function(c){return c>=a.getDate()})):t=h();A.push(t)}),E=_.zip(E,A),_.each(E,function(a){var c=a[0];a=a[1];var b;if("date"===C||"week"===C||"year"===C||"dates"===F||"weeks"===F||"years"===F){var d;d="date"===C||"week"===C||"year"===C?l(v.substring(0,v.length-4)):l(v.substring(0,v.length-5));b=new Date(c.getTime());
"date"===C||"dates"===F?b.setDate(b.getDate()+d):"week"===C||"weeks"===F?b.setDate(b.getDate()+7*d):"year"!==C&&"years"!==F||b.setFullYear(b.getFullYear()+d)}else b=v.split("/"),b=_.map(b,l),3===b.length?b=new Date(b[0],b[1]-1,b[2]):(b=new Date(c.getFullYear(),b[0]-1,b[1]),b.getTime()<c.getTime()&&b.setFullYear(b.getFullYear()+1));b.getFullYear()<m||b.getFullYear()==m&&b.getMonth()<e?z=[]:b.getFullYear()==m&&b.getMonth()==e?(z=h(),z=_.filter(z,function(a){return a<=b.getDate()})):z=h();_.isEmpty(_.intersection(a,
z))||(n=_.intersection(a,z))});else throw c('invalid selector "'+D+":"+k+'" in '+a[w].name+".");else if("date"===D)n[n.length]=l(k);else if("month"===D)if(!q[k]&&l(k)!=e+1||q[k]&&q[k]!=e)n=[];else{if(!q[k]&&l(k)==e+1||q[k]&&q[k]==e)n=h()}else if("day"===D)if(k.match(/^\d/)){for(var k=k.match(/^(\d+)(?:st|nd|rd|th)-?(.+)$/),E=l(k[1]),G=u[k[2]],u=0;""===g[u][G];)u++;n[n.length]=g[u-1+E][G]}else G=u[k],_.some(g,function(a){""!==a[G]&&(n[n.length]=a[G])});else if("year"===D)n="leap-year"===k||"leap_year"===
k||"\u3046\u308b\u3046\u5e74"===k||"\u958f\u5e74"===k?0===m%400||0===m%4&&0!==m%100?h():[]:l(k)!==m?[]:h();else throw c('undefined key "'+D+'".');"day"===D&&(p[m-1950][e][d]=_.clone(n));return n}var g=[],K=_.flatten(b.calendar(m,e));_.each(d,function(a){if(1===a[1])g[g.length]=x(a[0],m,e);else if(0===a[1])if("&&"===a[0])g.push(_.intersection(g.pop(),g.pop()));else if("||"===a[0])g.push(_.union(g.pop(),g.pop()));else throw c("undefined operator "+a[0]);});if(1!=g.length)throw c("unexpected error in execSelectors().");
return g.pop()}if(!d)return[];for(var q=[],u=0,t=d.length;u<t;u++){d[u].type="habit";d[u].group=w;var z=h(g(d[u].selector),m,e);_.each(z,function(a,b){z[b]={year:m,month:e,date:a,name:d[u].name,group:w,id:u,type:"habit"}});q=q.concat(z)}return q}function g(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(q[a])return q[a];for(var c=[],d=!1,f=0,e=0,h=a.length;e<h;e++){var g=a.charAt(e);if(d)'"'===g?d=!1:"\\"===g&&(e+=1);else if('"'===g)d=!0;else if(" "===g){b([a.substring(f,e),1]);var g={" and ":"&&",
" \u304b\u3064 ":"&&"," && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"},l=!1,p;a:for(p in g)if(a.substr(e,p.length)===p){b([g[p],0]);f=e+p.length;e+=p.length;l=!0;break a}l||(b(["&&",0]),f=e+1,e+=1)}else if("("===g||")"===g)b([a.substring(f,e),1]),b([g,"("===g?2:3]),f=e+1}""!==a.substring(f)&&b([a.substring(f),1]);return q[a]=H(c)}function H(a){for(var b=[],d=[],f={"||":0,"&&":1},e=0,g=a.length;e<g;e++)if(1===a[e][1])d[d.length]=a[e].concat();else if(0===a[e][1]){var h=a[e][0];b[b.length-
1]&&f[h]<=f[b[b.length-1][0]]&&(d[d.length]=b.pop());b[b.length]=a[e]}else if(2===a[e][1])b[b.length]=a[e];else if(3===a[e][1]){for(;2!=b[b.length-1][1];)if(d[d.length]=b.pop(),0===b.length)throw c("found mismatched parentheses");b.pop()}for(;0<b.length;){if(2===b[b.length-1][1])throw c("found mismatched parentheses.");d[d.length]=b.pop()}return d}var p=[],q={},t=[],A=-1,B=-1;return{eventCalendar:function(a){var c=[],e=[],g=_.difference(d.following,d.hiddenGroup);if(b.year!==A||b.month!==B)A=b.year,
B=b.month,t=[];else if(_.any(g,function(a){return!0===a.updated})||d.updated)t=[];else return t[a]||[];for(var h=0,l=g.length;h<l;h++)c[c.length]=f(g[h],b.year,b.month);d.isHiddenGroup(-1)||(c[c.length]=f("private",b.year,b.month));h=0;for(l=c.length;h<l;h++)for(var g=0,p=c[h].length;g<p;g++)e[c[h][g].date]||(e[c[h][g].date]=[]),e[c[h][g].date][e[c[h][g].date].length]=c[h][g].id+":"+c[h][g].group+":"+c[h][g].type;t=_.clone(e);return t[a]||[]},splitSelector:g}}])})(window);
