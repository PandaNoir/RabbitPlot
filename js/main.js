var appName="rabbit",MEMO_LIMIT=1950,QUOTATION=0,isSmartPhone=0<navigator.userAgent.indexOf("iPhone")&&-1==navigator.userAgent.indexOf("iPad")||0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android");
angular.module(appName,["ngTouch","ngAnimate","ngMaterial","ngMessages"]).controller("mainCtrl",["$scope","eventForm","calF","eventCal","eventListToEdit","$timeout","$filter","$sce","$mdSidenav",function(a,d,e,c,b,k,f,g,l){a._=_;a.eventForm=d;a.calF=e;a.eventListToEdit=b;a.eventForm.isEditMode=!1;a.showsHowToWrite=!1;a.showHowToWrite=function(){a.showsHowToWrite=!a.showsHowToWrite};a.splitSelector=c.splitSelector;a.openNav=function(){l("left").toggle()};a.calF.selected=a.calF.date;a.eventCalendar=
c.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=function(a){if(void 0===a)return a;if(angular.isObject(a)){var e=[],c;for(c in a)if(a.hasOwnProperty(c)){var b=a[c];e[e.length]=encodeURIComponent(c)+"="+encodeURIComponent(null==b?"":b)}a=e.join("&").replace(/%20/g,"+")}else a=null==a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",["group","user",function(a,d){return function(e,c){e=e.split(":");
var b="",b="private"==e[1]?d["private"][e[2]][e[0]].name:a[e[1]][e[2]][e[0]].name;!1!==c&&0===b.indexOf("[mes]")&&(b=b.replace(/^\[mes\]/,""));return b}}]).run(["db","group","$rootScope",function(a,d,e){var c={id:0,event:[{name:"[mes]\u6625\u5206\u306e\u65e5",year:2E3,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2E3,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2001,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2001,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
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
selector:"month:5 date:5"},{name:"[mes]\u6d77\u306e\u65e5",selector:"month:7 day:3rd-mon"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"month:9 day:3rd-mon"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",selector:"month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"month:12 date:23"}],name:"\u795d\u65e5",updated:!0};localStorage&&localStorage.getItem("group")&&
(d.length=0,Array.prototype.push.apply(d,angular.fromJson(localStorage.getItem("group"))),d[0]=_.clone(c));a.list().then(function(b){b=b.data;for(var k=0,f=b.length;k<f;k++){for(var g in b[k])b[k][g]=angular.fromJson(b[k][g]);b[k].updated=!0}b.sort(function(a,b){return a.id-b.id});k=d.length=0;for(f=b.length;k<f;k++)d[b[k].id]=b[k];d[0]=_.clone(c);e.$broadcast("updated");localStorage.setItem("group",angular.toJson(d));a.getNameList().then(function(a){for(var b=0,e=a.data[0].length;b<e;b++)d[b]||(d[b]=
{name:angular.fromJson(a.data[0][b])},a.data[1][b]&&(d[b].parents=angular.fromJson(a.data[1][b])));d[0]=_.clone(c);localStorage.setItem("group",angular.toJson(d))})})}]).directive("appDate",[function(){return{scope:{row:"=appRow"},restrict:"A",template:'<span class="date" ng-transclude></span>',transclude:!0,replace:!0,controller:["$scope","calF","eventCal","$filter",function(a,d,e,c){a.calendar=d;a.bookedClass=function(a){a=e.eventCalendar(a);for(var d=0,f=0,g=a.length;f<g;f++)0!==c("format")(a[f],
!1).indexOf("[mes]")&&d++;return 5>d?"booked-"+d:"booked-5"};a.dateClass=function(b){if(0!==b&&32!==b){var d=a.calendar,c=[];d.selected===b&&(c[c.length]="selected");c[c.length]=a.bookedClass(b);b===d.today.date&&d.month===d.today.month&&d.year===d.today.year&&(c[c.length]="today");return c}return[]}}],link:function(a,d,e){var c=a.row[e.appDate];if(""!==c&&void 0!==c){var b=function(){d.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");d.addClass(a.dateClass(c).join(" "))};
a.$on("updated",b);b();d.on("mouseenter",function(){!a.calendar.disableHoverEvent&&c&&(a.calendar.selected=c,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),b(),a.$apply())});d.on("mouseleave",function(){a.calendar.disableHoverEvent||(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),a.$apply())});d.on("click",function(){isSmartPhone||(a.calendar.disableHoverEvent=a.calendar.selected===c?!a.calendar.disableHoverEvent:
!0);a.calendar.selected=c;angular.element(document.querySelectorAll(".selected")).removeClass("selected");b();a.$apply()})}}}}]);angular.module(appName).controller("calendarCtrl",["$scope","calF","eventForm",function(a,d,e){a.calF=d;a.nextMonth=function(){a.calF.month++;a.calF.selected=null;12<a.calF.month+1&&(a.calF.year+=1,a.calF.month-=12);e.isEditMode=!1};a.lastMonth=function(){a.calF.month--;a.calF.selected=null;1>a.calF.month+1&&(a.calF.year-1<MEMO_LIMIT?(alert(MEMO_LIMIT+"\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),
a.calF.month+=1):(a.calF.month+=12,--a.calF.year));e.isEditMode=!1};a.nextYear=function(){a.calF.year++;a.calF.selected=null;e.isEditMode=!1};a.lastYear=function(){a.calF.year-1<MEMO_LIMIT?alert(MEMO_LIMIT+"\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(a.calF.year--,a.calF.selected=null);e.isEditMode=!1}}]);angular.module(appName).controller("eventEditorCtrl",["$scope","group","user","eventForm","calF","db","$mdToast",function(a,d,e,c,b,k,f){function g(b){"private"===b?e.save():k.post(a.group[b],b,"update")}var l=[],p=[];a.group=d;a.user=e;a.eventForm=c;a.calF=b;a.ruleWriterFase="";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.addEvent=function(){var b=a.eventForm.type;if(""!==c.name&&void 0!==c.selectedGroup&&null!==c.selectedGroup){var d=new Date(c.year,c.month-1,c.date);if(d.getFullYear()===
parseInt(c.year,10)&&d.getMonth()===parseInt(c.month,10)-1&&d.getDate()===parseInt(c.date,10)){if("event"==b)var e={year:c.year,month:c.month-1,date:c.date,name:c.name};else"habit"==b&&(e={selector:c.rule,name:c.name});"private"===c.selectedGroup?(a.user["private"][b][a.user["private"][b].length]=e,a.user.updated=!0):null!==c.selectedGroup&&(a.group[c.selectedGroup][b][a.group[c.selectedGroup][b].length]=e,a.group[c.selectedGroup].updated=!0);f.show(f.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));
c.isEditMode=!1;g(c.selectedGroup)}}};a.saveEvent=function(){var b=c.type;if(null!==c.year&&null!==c.month&&null!==c.date&&""!==c.name){var d=new Date(c.year,c.month-1,c.date);if(d.getFullYear()===parseInt(c.year,10)&&d.getMonth()===parseInt(c.month,10)-1&&d.getDate()===parseInt(c.date,10)){if("private"===c.selectedGroup)var e=a.user["private"][b][c.id];else null!==c.selectedGroup&&(e=a.group[c.selectedGroup][b][c.id],a.group[c.selectedGroup].updated=!0);"event"==b?(e.year=c.year,e.month=c.month-
1,e.date=c.date,e.name=c.name):"habit"==b&&(e.selector=c.rule,e.name=c.name);c.isEditMode=!1;g(c.selectedGroup)}}};a.cancel=function(){c.isEditMode=!1};a.goFase=function(b,d){l[l.length]=a.ruleWriterFase;p[p.length]=d||b;a.ruleWriterFase=b;c.rule=p.join("")};a.cancelFase=function(){a.ruleWriterFase=l.pop();p.pop();c.rule=p.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";l=[];c.rule=p.join("");p=[]};a.startWritingRule=function(){a.ruleWriterFase="selector";l=[];p=[]}}]);angular.module(appName).controller("groupEditorCtrl",["$scope","group","groupForm","db","$mdToast",function(a,d,e,c,b){a.groupForm=e;a.groupForm.parentGroup=[null];a.groupForm.mode="add";a.group=d;a.finishMakingAGroup=function(){e.isEditMode=!1};a.addGroup=function(){var e=a.groupForm.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?parseInt(b,10):"");return a},[]),f={event:[],habit:[],name:a.groupForm.name,updated:!0};""!==e.join("")&&(f.parents=e);d[d.length]=
f;c.post(f,a.group.length-1,"insert").success(a.finishMakingAGroup);b.show(b.simple().content("\u30b0\u30eb\u30fc\u30d7 "+a.groupForm.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));a.groupForm.name=""}}]);angular.module(appName).controller("detailCtrl",["$scope","eventForm","user","group",function(a,d,e,c){a.switchToEdit=function(){arguments=Array.prototype.slice.call(arguments);if(1===arguments.length){var b=arguments[0];a.eventForm.mode="edit";b=b.split(":");d.type=b[2];d.id=b[0];d.selectedGroup="private"!==b[1]?parseInt(b[1],10):b[1];"event"===b[2]?"private"===b[1]?(d.year=e["private"].event[b[0]].year,d.month=e["private"].event[b[0]].month+1,d.date=e["private"].event[b[0]].date,d.name=e["private"].event[b[0]].name):
(d.year=c[b[1]].event[b[0]].year,d.month=c[b[1]].event[b[0]].month+1,d.date=c[b[1]].event[b[0]].date,d.name=c[b[1]].event[b[0]].name):"habit"===b[2]&&("private"===b[1]?(d.rule=e["private"].habit[b[0]].selector,d.name=e["private"].habit[b[0]].name):(d.rule=c[b[1]].habit[b[0]].selector,d.name=c[b[1]].habit[b[0]].name))}else 2===arguments.length&&!0===arguments[1]?(b=arguments[0],a.eventForm.mode="add",b=b.split(":"),d.type=b[2],d.id=0,d.selectedGroup="private"!==b[1]?parseInt(b[1],10):b[1],"event"===
b[2]?"private"===b[1]?(d.year=e["private"].event[b[0]].year,d.month=e["private"].event[b[0]].month+1,d.date=e["private"].event[b[0]].date,d.name=e["private"].event[b[0]].name):(d.year=c[b[1]].event[b[0]].year,d.month=c[b[1]].event[b[0]].month+1,d.date=c[b[1]].event[b[0]].date,d.name=c[b[1]].event[b[0]].name):"habit"===b[2]&&("private"===b[1]?(d.rule=e["private"].habit[b[0]].selector,d.name=e["private"].habit[b[0]].name):(d.rule=c[b[1]].habit[b[0]].selector,d.name=c[b[1]].habit[b[0]].name))):3===arguments.length&&
(d.mode="add",d.type="event",d.rule="",d.id=0,d.name="",d.year=arguments[0],d.month=arguments[1]+1,d.date=arguments[2]);a.eventForm.isEditMode=!0}}]);angular.module(appName).controller("settingCtrl",["$scope","group","user","db","eventListToEdit","groupForm","$mdSidenav","$mdToast","$mdDialog",function(a,d,e,c,b,k,f,g,l){function p(a,b){return a-b}function x(b){return-1!==a.user.following.indexOf(b)}function t(a){if(!d[a].parents)return[];for(var b=d[a].parents,e=0,c=d[a].parents.length;e<c;e++)b=t(d[a].parents[e]).concat(b);return b}a.group=d;a.user=e;a.groupForm=k;a.search_keyword="";a.searchResult=[];a.hide=function(a){e.hiddenGroup[e.hiddenGroup.length]=
a;e.hiddenGroup.sort(p);e.save()};a.show=function(b){e.hiddenGroup=_.without(a.user.hiddenGroup,b);e.save()};a.followsParent=function(a){a=t(a);for(var b=0,d=a.length;b<d;b++)if(!x(a[b]))return a[b];return!0};a.toggleNav=function(){console.log("called");f("left").close()};a.follows=x;a.follow=function(b){a.user.following[a.user.following.length]=b;a.user.following.sort(p);e.save();g.show(g.simple().content(d[b].name+"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};
a.unfollow=function(b){var c=[];c[c.length]=a.user.following.indexOf(b);for(var k=0,E=a.user.following.length;k<E;k++)if(d[a.user.following[k]].parents&&-1!=t(a.user.following[k]).indexOf(b)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+d[a.user.following[k]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;
c[c.length]=k}c.sort(function(a,b){return b-a});k=0;for(E=c.length;k<E;k++)a.user.following.splice(c[k],1);e.save()};a.showEventList=function(a){b.id=a};a.makeAGroup=function(){k.isEditMode=!0;f("left").close()};a.search=function(){var b=[];if(""==a.search_keyword)return b;for(var c=0,e=d.length;c<e&&!(30<b.length);c++)-1!==d[c].name.indexOf(a.search_keyword)&&(b[b.length]=c);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>d.length)Array.prototype.push.apply(b,d);else for(;5>b.length;){var c=
Math.random()*d.length|0;-1===_.indexOf(b,c)&&(b[b.length]=c)}a.searchResult=b};a.hideAll=function(){e.hiddenGroup.length=0;e.hiddenGroup=_.clone(e.following);e.hiddenGroup[e.hiddenGroup.length]=-1;e.hiddenGroup.sort(p);e.save()};a.showAll=function(){e.hiddenGroup=[];e.save()};a.importSetting=function(){l.show({controller:function(b,a){b.text="";b.answer=function(b){a.hide(b)}},template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(b){b=
JSON.parse(b);for(var a in b)e[a]=b[a];e.save()})};a.exportSetting=function(){l.show(l.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(e)).ok("ok"))}}]).directive("autoFocus",function(){return{link:function(a,d,e){a.$watch("focus",function(c){!0===a.focus&&d[0].focus()})}}});angular.module(appName).controller("eventListCtrl",["$scope","group","user","eventListToEdit","eventForm",function(a,d,e,c,b){a.eventListToEdit=c;a.group=d;a.user=e;a.habitList="private"!==c.id?d[c.id].habit:e["private"].habit;a.eventList="private"!==c.id?d[c.id].event:e["private"].event;a.switchToEdit=function(){arguments=Array.prototype.slice.call(arguments);if(1===arguments.length){var c=arguments[0];a.eventForm.mode="edit";c=c.split(":");b.type=c[2];b.id=c[0];b.selectedGroup="private"!==c[1]?
parseInt(c[1],10):c[1];"event"===c[2]?"private"===c[1]?(b.year=e["private"].event[c[0]].year,b.month=e["private"].event[c[0]].month+1,b.date=e["private"].event[c[0]].date,b.name=e["private"].event[c[0]].name):(b.year=d[c[1]].event[c[0]].year,b.month=d[c[1]].event[c[0]].month+1,b.date=d[c[1]].event[c[0]].date,b.name=d[c[1]].event[c[0]].name):"habit"===c[2]&&("private"===c[1]?(b.rule=e["private"].habit[c[0]].selector,b.name=e["private"].habit[c[0]].name):(b.rule=d[c[1]].habit[c[0]].selector,b.name=
d[c[1]].habit[c[0]].name))}else 2===arguments.length&&!0===arguments[1]?(c=arguments[0],a.eventForm.mode="add",c=c.split(":"),b.type=c[2],b.id=0,b.selectedGroup="private"!==c[1]?parseInt(c[1],10):c[1],"event"===c[2]?"private"===c[1]?(b.year=e["private"].event[c[0]].year,b.month=e["private"].event[c[0]].month+1,b.date=e["private"].event[c[0]].date,b.name=e["private"].event[c[0]].name):(b.year=d[c[1]].event[c[0]].year,b.month=d[c[1]].event[c[0]].month+1,b.date=d[c[1]].event[c[0]].date,b.name=d[c[1]].event[c[0]].name):
"habit"===c[2]&&("private"===c[1]?(b.rule=e["private"].habit[c[0]].selector,b.name=e["private"].habit[c[0]].name):(b.rule=d[c[1]].habit[c[0]].selector,b.name=d[c[1]].habit[c[0]].name))):3===arguments.length&&(b.mode="add",b.type="event",b.rule="",b.id=0,b.name="",b.year=arguments[0],b.month=arguments[1]+1,b.date=arguments[2]);a.eventForm.isEditMode=!0}}]);angular.module(appName).factory("user",["$rootScope",function(a){if(localStorage&&angular.fromJson(localStorage.getItem("private"))){var d=angular.fromJson(localStorage.getItem("private"));d.isHiddenGroup=function(a){return-1!==_.indexOf(this.hiddenGroup,a,!0)};d.save=function(){a.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))};d.updated=!0}else d={following:[],"private":{event:[],habit:[],name:"\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8"},hiddenGroup:[],isHiddenGroup:function(a){return-1!==
_.indexOf(this.hiddenGroup,a,!0)},save:function(){a.$broadcast("updated");localStorage.setItem("private",angular.toJson(this))}};d.save();return d}]).factory("eventForm",function(){return{isEditMode:!1,name:"",year:(new Date).getFullYear(),month:(new Date).getMonth()+1,date:(new Date).getDate(),type:"event",rule:""}}).factory("groupForm",function(){return{isEditMode:!1,name:""}}).factory("group",["$http",function(a){return[{id:0,event:[{name:"[mes]\u6625\u5206\u306e\u65e5",year:2E3,month:2,date:20},
{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2E3,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2001,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2001,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2002,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2002,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2003,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2003,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2004,
month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2004,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2005,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2005,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2006,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2006,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2007,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2007,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2008,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2008,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2009,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2009,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2010,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2010,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2011,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2011,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2012,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2012,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2013,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2013,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2014,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2014,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2015,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2015,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2016,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2016,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2017,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2017,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2018,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2018,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2019,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2019,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2020,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2020,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2021,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2021,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2022,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2022,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2023,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2023,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2024,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2024,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2025,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2025,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2026,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2026,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2027,month:2,date:21},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2027,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",
year:2028,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2028,month:8,date:22},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2029,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2029,month:8,date:23},{name:"[mes]\u6625\u5206\u306e\u65e5",year:2030,month:2,date:20},{name:"[mes]\u79cb\u5206\u306e\u65e5",year:2030,month:8,date:23},{name:"[mes]\u5341\u4e94\u591c",year:2E3,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2001,month:9,date:1},{name:"[mes]\u5341\u4e94\u591c",year:2002,
month:8,date:21},{name:"[mes]\u5341\u4e94\u591c",year:2003,month:8,date:11},{name:"[mes]\u5341\u4e94\u591c",year:2004,month:8,date:28},{name:"[mes]\u5341\u4e94\u591c",year:2005,month:8,date:18},{name:"[mes]\u5341\u4e94\u591c",year:2006,month:9,date:6},{name:"[mes]\u5341\u4e94\u591c",year:2007,month:8,date:25},{name:"[mes]\u5341\u4e94\u591c",year:2008,month:8,date:14},{name:"[mes]\u5341\u4e94\u591c",year:2009,month:9,date:3},{name:"[mes]\u5341\u4e94\u591c",year:2010,month:8,date:22},{name:"[mes]\u5341\u4e94\u591c",
year:2011,month:8,date:12},{name:"[mes]\u5341\u4e94\u591c",year:2012,month:8,date:30},{name:"[mes]\u5341\u4e94\u591c",year:2013,month:8,date:19},{name:"[mes]\u5341\u4e94\u591c",year:2014,month:8,date:8},{name:"[mes]\u5341\u4e94\u591c",year:2015,month:8,date:27},{name:"[mes]\u5341\u4e94\u591c",year:2016,month:8,date:15}],habit:[{name:"[mes]\u5143\u65e6",selector:"month:1 date:1"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"month:1 day:2nd-mon"},{name:"[mes]\u662d\u548c\u306e\u65e5",selector:"month:4 date:29"},
{name:"[mes]\u5efa\u56fd\u8a18\u5ff5\u65e5",selector:"month:2 date:11"},{name:"[mes]\u61b2\u6cd5\u8a18\u5ff5\u65e5",selector:"month:5 date:3"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"month:5 date:4"},{name:"[mes]\u3053\u3069\u3082\u306e\u65e5",selector:"month:5 date:5"},{name:"[mes]\u6d77\u306e\u65e5",selector:"month:7 day:3rd-mon"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"month:9 day:3rd-mon"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",
selector:"month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"month:12 date:23"}],name:"\u795d\u65e5",updated:!0}]}]).factory("calF",function(){var a=new Date,d=[];return{year:a.getFullYear(),month:a.getMonth(),date:a.getDate(),calendar:function(a,c){if(d[a-MEMO_LIMIT]){if(d[a-MEMO_LIMIT][c])return d[a-MEMO_LIMIT][c]}else d[a-MEMO_LIMIT]=[];var b=(new Date(a,c,1)).getDay(),k=[31,28,31,30,31,30,31,31,
30,31,30,31][c];1===c&&(0==a%400||0!=a%100&&0==a%4)&&(k=29);var f=[];f.year=a;f.month=c;var g=0;for(;;){f[g]=[];for(var l=1;7>=l;l++)f[g][f[g].length]=0<7*g+l-b?7*g+l-b<=k?7*g+l-b:32:0;if(f[g][f[g].length-1]>=k)break;g++}return d[a-MEMO_LIMIT][c]=f},today:{year:a.getFullYear(),month:a.getMonth(),date:a.getDate()},selected:a.getDate(),selectedDay:function(){return null==this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,this.month,this.selected)).getDay()]},
disableHoverEvent:isSmartPhone}}).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var d=d||Error;return function(e){a.show(a.simple().content(e).position("top right").hideDelay(3E3));return new d(e)}}]).run(["calF","$timeout",function(a,d){function e(){var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);var c=new Date;a.today.year=c.getFullYear();a.today.month=c.getMonth();a.today.date=c.getDate();
d(e,b-new Date)}var c=new Date;c.setDate(c.getDate()+1);c.setHours(0);c.setMinutes(0);c.setSeconds(0);c.setMilliseconds(0);d(e,c-new Date)}]).factory("db",["group","user","$http","$rootScope",function(a,d,e,c){return{post:function(a,d,f){a=_.clone(a);a.id=d;a.permission=a.permission||[];a.parents=a.parents||"";delete a.updated;for(var g in a)a[g]=angular.toJson(a[g]);a.type=f;c.$broadcast("updated");return e.post("http://www40.atpages.jp/chatblanc/genderC/database.php",a).success(function(a){console.log("updated");
console.log(a)}).error(function(a){console.log(a)})},list:function(){return e.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:d.following.join(",")}).success(function(a){return a}).error(function(a){console.log(a)})},getNameList:function(){return e.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"namelist"}).success(function(a){return a})}}}]);angular.module(appName).factory("eventCal",["group","user","calF","error",function(a,d,e,c){function b(a){return parseInt(a,10)}function k(b,c,e){if("private"!==b&&!a[b])return[];var w=[],y=[];"private"===b?(_.each(d.following,function(a){y=y.concat(k(a,c,e))}),w=w.concat(f(d["private"].event,c,e,"private")),y=y.concat(w),w=w.concat(g(d["private"].habit,c,e,"private",y)),d.updated=!1):(a[b].parents&&_.each(a[b].parents,function(a){y=y.concat(k(a,c,e))}),w=w.concat(f(a[b].event,c,e,b)),y=y.concat(w),
w=w.concat(g(a[b].habit,c,e,b,y)),a[b].updated=!1);return w}function f(a,b,c,d){var e=[];if(!a)return e;for(var k=0,f=a.length;k<f;k++)if(a[k].year===b&&a[k].month===c){var g=_.clone(a[k]);g.group=d;g.type="event";g.id=k;e[e.length]=g}return e}function g(d,m,f,w,y){function g(d,m,f){function E(d,m,f){var g=function(){return _.clone(B)},q=e.calendar(m,f),l={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,monday:1,mon:1,"\u6708\u66dc\u65e5":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,
thursday:4,thu:4,"\u6728\u66dc\u65e5":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,saturday:6,sat:6,"\u571f\u66dc\u65e5":6},F={January:0,Jan:0,"\u7766\u6708":0,February:1,Feb:1,"\u5982\u6708":1,March:2,Mar:2,"\u5f25\u751f":2,April:3,Apr:3,"\u536f\u6708":3,May:4,"\u7690\u6708":4,June:5,Jun:5,"\u6c34\u7121\u6708":5,July:6,Jul:6,"\u6587\u6708":6,August:7,Aug:7,"\u8449\u6708":7,September:8,Sep:8,"\u9577\u6708":8,October:9,Oct:9,"\u795e\u7121\u6708":9,November:10,Nov:10,"\u971c\u6708":10,December:11,Dec:11,
"\u5e2b\u8d70":11};if(x[m-MEMO_LIMIT])if(x[m-MEMO_LIMIT][f]){if(x[m-MEMO_LIMIT][f][d])return _.clone(x[m-MEMO_LIMIT][f][d])}else x[m-MEMO_LIMIT][f]={};else x[m-MEMO_LIMIT]=[],x[m-MEMO_LIMIT][f]={};var p=d.split(":")[0],h=d.split(":").slice(1).join(":"),n=[],u=[],t=[],A=[],r,v,z,D,C=[];if("not"===p)if(n=g(),"public-holiday"===h||"\u795d\u65e5"===h){q=k(0,m,f);l=0;for(h=q.length;l<h;l++)q[l]=q[l].date;n=_.difference(n,q);x[m-MEMO_LIMIT][f][d]=_.clone(n)}else if(0===h.indexOf("year")||0===h.indexOf("month")||
0===h.indexOf("date")||0===h.indexOf("day"))h=h.replace(/=/,":"),n=_.difference(g(),E(h,m,f));else{var I=h.split("=")[0],H=h.replace(/^.+?=/,""),H=H.replace(/^"(.+)"$/,"$1");_.each(y,function(a){if(a[I]===H||0===a[I].indexOf("[mes]")&&a[I].slice(5)===H)n=_.without(n,a.date)})}else if("range"===p)if(".."===h.slice(0,2))h="..."===h.slice(0,3)?h.slice(3):h.slice(2),n=g(),h=h.split("/"),h=_.map(h,b),v=new Date(h[0],h[1]-1,h[2]),v.getFullYear()<m||v.getFullYear()==m&&v.getMonth()<f?n=[]:v.getFullYear()==
m&&v.getMonth()==f?(n=g(),n=_.filter(n,function(a){return a<=v.getDate()})):n=g();else if(".."===h.slice(-2))h="..."===h.slice(-3)?h.slice(0,-3):h.slice(0,-2),h=h.split("/"),h=_.map(h,b),r=new Date(h[0],h[1]-1,h[2]),r.getFullYear()>m||r.getFullYear()==m&&r.getMonth()>f?n=[]:r.getFullYear()==m&&r.getMonth()==f?(n=g(),n=_.filter(n,function(a){return a>=r.getDate()})):n=g();else if(-1!==h.indexOf(".."))n=[],h=h.split("..."),1===h.length&&(h=h[0].split("..")),u=[],t=[],A=[],r=h[0],v=h[1],z=v.substr(v.length-
4,4),D=v.substr(v.length-5,5),C=[],r=r.split("/"),r=_.map(r,b),3===r.length?(q=new Date(r[0],r[1]-1,r[2]),C.push(q)):2===r.length&&(q=new Date(m-1,r[0]-1,r[1]),C.push(q,new Date(m,r[0]-1,r[1]))),_.each(C,function(a){a.getFullYear()>m||a.getFullYear()==m&&a.getMonth()>f?u=[]:a.getFullYear()==m&&a.getMonth()==f?(u=g(),u=_.filter(u,function(b){return b>=a.getDate()})):u=g();A.push(u)}),C=_.zip(C,A),_.each(C,function(a){var c=a[0];a=a[1];var d;if("date"===z||"week"===z||"year"===z||"dates"===D||"weeks"===
D||"years"===D){var e;e="date"===z||"week"===z||"year"===z?b(v.substring(0,v.length-4)):b(v.substring(0,v.length-5));d=new Date(c.getTime());"date"===z||"dates"===D?d.setDate(d.getDate()+e):"week"===z||"weeks"===D?d.setDate(d.getDate()+7*e):"year"!==z&&"years"!==D||d.setFullYear(d.getFullYear()+e)}else d=v.split("/"),d=_.map(d,b),3===d.length?d=new Date(d[0],d[1]-1,d[2]):(d=new Date(c.getFullYear(),d[0]-1,d[1]),d.getTime()<c.getTime()&&d.setFullYear(d.getFullYear()+1));d.getFullYear()<m||d.getFullYear()==
m&&d.getMonth()<f?t=[]:d.getFullYear()==m&&d.getMonth()==f?(t=g(),t=_.filter(t,function(a){return a<=d.getDate()})):t=g();_.isEmpty(_.intersection(a,t))||(n=_.intersection(a,t))});else throw c('invalid selector "'+p+":"+h+'" in '+a[w].name+".");else if("date"===p)n[n.length]=b(h);else if("month"===p)if(!F[h]&&b(h)!=f+1||F[h]&&F[h]!=f)n=[];else{if(!F[h]&&b(h)==f+1||F[h]&&F[h]==f)n=g()}else if("day"===p)if(h.match(/^\d/)){for(var h=h.match(/^(\d+)(?:st|nd|rd|th)-?(.+)$/),C=b(h[1]),G=l[h[2]],l=0;""===
q[l][G];)l++;n[n.length]=q[l-1+C][G]}else G=l[h],_.some(q,function(a){""!==a[G]&&(n[n.length]=a[G])});else if("year"===p)n="leap-year"===h||"leap_year"===h||"\u3046\u308b\u3046\u5e74"===h||"\u958f\u5e74"===h?0===m%400||0===m%4&&0!==m%100?g():[]:b(h)!==m?[]:g();else throw c('undefined key "'+p+'".');"day"===p&&(x[m-MEMO_LIMIT][f][d]=_.clone(n));return n}var q=[],B=_.flatten(e.calendar(m,f));_.each(d,function(a){if(1===a[1])q[q.length]=E(a[0],m,f);else if(0===a[1])if("&&"===a[0])q.push(_.intersection(q.pop(),
q.pop()));else if("||"===a[0])q.push(_.union(q.pop(),q.pop()));else throw c("undefined operator "+a[0]);});if(1!=q.length)throw c("unexpected error in execSelectors().");return q.pop()}if(!d)return[];for(var p=[],B=0,t=d.length;B<t;B++){d[B].type="habit";d[B].group=w;var u=g(l(d[B].selector),m,f);_.each(u,function(a,b){u[b]={year:m,month:f,date:a,name:d[B].name,group:w,id:B,type:"habit"}});p=p.concat(u)}return p}function l(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(t[a])return t[a];for(var c=
[],d=!1,e=0,f=0,g=a.length;f<g;f++){var k=a.charAt(f);if(d)'"'===k?d=!1:"\\"===k&&(f+=1);else if('"'===k)d=!0;else if(" "===k){b([a.substring(e,f),1]);var k={" and ":"&&"," \u304b\u3064 ":"&&"," && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"},l=!1,u;a:for(u in k)if(a.substr(f,u.length)===u){b([k[u],0]);e=f+u.length;f+=u.length;l=!0;break a}l||(b(["&&",0]),e=f+1,f+=1)}else if("("===k||")"===k)b([a.substring(e,f),1]),b([k,"("===k?2:3]),e=f+1}""!==a.substring(e)&&b([a.substring(e),1]);
return t[a]=p(c)}function p(a){for(var b=[],d=[],e={"||":0,"&&":1},f=0,k=a.length;f<k;f++)if(1===a[f][1])d[d.length]=a[f].concat();else if(0===a[f][1]){var g=a[f][0];b[b.length-1]&&e[g]<=e[b[b.length-1][0]]&&(d[d.length]=b.pop());b[b.length]=a[f]}else if(2===a[f][1])b[b.length]=a[f];else if(3===a[f][1]){for(;2!=b[b.length-1][1];)if(d[d.length]=b.pop(),0===b.length)throw c("found mismatched parentheses");b.pop()}for(;0<b.length;){if(2===b[b.length-1][1])throw c("found mismatched parentheses.");d[d.length]=
b.pop()}return d}var x=[],t={},A=[],J=-1,K=-1;return{eventCalendar:function(a){var b=[],c=[],f=_.difference(d.following,d.hiddenGroup);if(e.year!==J||e.month!==K)J=e.year,K=e.month,A=[];else if(_.any(f,function(a){return!0===a.updated})||d.updated)A=[];else return A[a]||[];for(var g=0,l=f.length;g<l;g++)b[b.length]=k(f[g],e.year,e.month);d.isHiddenGroup(-1)||(b[b.length]=k("private",e.year,e.month));g=0;for(l=b.length;g<l;g++)for(var f=0,p=b[g].length;f<p;f++)c[b[g][f].date]||(c[b[g][f].date]=[]),
c[b[g][f].date][c[b[g][f].date].length]=b[g][f].id+":"+b[g][f].group+":"+b[g][f].type;A=_.clone(c);return A[a]||[]},splitSelector:l}}]);
