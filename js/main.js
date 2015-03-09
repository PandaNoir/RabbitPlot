'use strict';(function(R,w){function I(a,c){return a-c}function O(a){return a.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248)})}function L(a){var c="\uff76\uff9e \uff77\uff9e \uff78\uff9e \uff79\uff9e \uff7a\uff9e \uff7b\uff9e \uff7c\uff9e \uff7d\uff9e \uff7e\uff9e \uff7f\uff9e \uff80\uff9e \uff81\uff9e \uff82\uff9e \uff83\uff9e \uff84\uff9e \uff8a\uff9e \uff8a\uff9f \uff8b\uff9e \uff8b\uff9f \uff8c\uff9e \uff8c\uff9f \uff8d\uff9e \uff8d\uff9f \uff8e\uff9e \uff8e\uff9f \uff73\uff9e \uff67 \uff71 \uff68 \uff72 \uff69 \uff73 \uff6a \uff74 \uff6b \uff75 \uff76 \uff77 \uff78 \uff79 \uff7a \uff7b \uff7c \uff7d \uff7e \uff7f \uff80 \uff81 \uff6f \uff82 \uff83 \uff84 \uff85 \uff86 \uff87 \uff88 \uff89 \uff8a \uff8b \uff8c \uff8d \uff8e \uff8f \uff90 \uff91 \uff92 \uff93 \uff6c \uff94 \uff6d \uff95 \uff6e \uff96 \uff97 \uff98 \uff99 \uff9a \uff9b \uff9c \uff66 \uff9d \uff61 \uff62 \uff63 \uff64 \uff65 \uff70 \uff9e \uff9f".split(" "),
e="\u30ac\u30ae\u30b0\u30b2\u30b4\u30b6\u30b8\u30ba\u30bc\u30be\u30c0\u30c2\u30c5\u30c7\u30c9\u30d0\u30d1\u30d3\u30d4\u30d6\u30d7\u30d9\u30da\u30dc\u30dd\u30f4\u30a1\u30a2\u30a3\u30a4\u30a5\u30a6\u30a7\u30a8\u30a9\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u30b5\u30b7\u30b9\u30bb\u30bd\u30bf\u30c1\u30c3\u30c4\u30c6\u30c8\u30ca\u30cb\u30cc\u30cd\u30ce\u30cf\u30d2\u30d5\u30d8\u30db\u30de\u30df\u30e0\u30e1\u30e2\u30e3\u30e4\u30e5\u30e6\u30e7\u30e8\u30e9\u30ea\u30eb\u30ec\u30ed\u30ef\u30f2\u30f3\u3002\u300c\u300d\u3001\u30fb\u30fc\u309b\u309c".split("");
a=O(a);for(var b=0;88>=b;b++)0<=a.indexOf(c[b])&&(a=a.replace(new RegExp(c[b],"g"),e[b]));return a=a.replace(/[\u30a1-\u30f3]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-96)})}function P(){var a="",c,e;for(c=0;32>c;c++){e=16*Math.random()|0;if(8===c||12===c||16===c||20===c)a+="-";a+=(12===c?4:16===c?e&3|8:e).toString(16)}return a}angular.module("lodash",[]).factory("_",function(){return _});angular.module("rabbit","ngTouch ngAnimate ngMaterial ngMessages LocalStorageModule lodash".split(" ")).constant("OVER_MONTH",
64).constant("MEMO_LIMIT",1950).constant("IS_SMART_PHONE",0<navigator.userAgent.indexOf("iPhone")&&-1===navigator.userAgent.indexOf("iPad")||0<navigator.userAgent.indexOf("iPod")||0<navigator.userAgent.indexOf("Android")).constant("ATTRIBUTE",{OPERATOR:0,OTHERS:1,LPARENTHESES:2,RPARENTHESES:3});angular.module("rabbit").controller("mainCtrl",["$scope","_","calendar","eventCal","mode","$mdSidenav",function(a,c,e,b,f,h){a._=c;a.mode=f;f.editsEvent=!1;f.editsGroup=!1;a.splitSelector=e.splitSelector;a.openNav=
function(){h("left").toggle()};e.selected=e.date;a.eventCalendar=b.eventCalendar}]).config(["$httpProvider",function(a){a.defaults.transformRequest=function(a){if(a===w)return a;if(angular.isObject(a)){var e=[],b;for(b in a)if(a.hasOwnProperty(b)){var f=a[b];e[e.length]=encodeURIComponent(b)+"="+encodeURIComponent(null===f?"":f)}a=e.join("&").replace(/%20/g,"+")}else a=null===a?"":a.toString();return a};a.defaults.headers.post={"Content-Type":"application/x-www-form-urlencoded"}}]).filter("format",
["group","user",function(a,c){return function(e,b){e=e.split(":");var f="",f="private"===e[1]?c["private"][e[2]][e[0]].name:0===parseInt(e[1],10)&&-1===parseInt(e[0],10)?"[mes]\u632f\u66ff\u4f11\u65e5":0===parseInt(e[1],10)&&-2===parseInt(e[0],10)?"[mes]\u56fd\u6c11\u306e\u4f11\u65e5":a[e[1]][e[2]][e[0]].name;!1!==b&&0===f.indexOf("[mes]")&&(f=f.replace(/^\[mes\]/,""));return f}}]);angular.module("rabbit").controller("loginCtrl",["$scope","db","user","mode","$mdToast",function(a,c,e,b,f){a.login=
function(){c.login({username:a.username,password:(new jsSHA(a.password,"TEXT")).getHash("SHA-384","HEX")}).then(function(a){a=a.data;if("failed"===a)f.show(f.simple().content("\u30ed\u30b0\u30a4\u30f3\u306b\u5931\u6557\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));else{f.show(f.simple().content("\u30ed\u30b0\u30a4\u30f3\u306b\u6210\u529f\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));for(var c in a)e[c]=angular.fromJson(a[c]);e.save();b.login=!1}})}}]);angular.module("rabbit").controller("calendarCtrl",
["$scope","calendar","mode","MEMO_LIMIT",function(a,c,e,b){a.calendar=c;a.nextMonth=function(){c.month++;c.selected=null;12<c.month+1&&(c.year+=1,c.month-=12);e.editsEvent=!1};a.lastMonth=function(){c.month--;c.selected=null;1>c.month+1&&(c.year-1<b?(alert(b+"\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"),c.month+=1):(c.month+=12,--c.year));e.editsEvent=!1};a.nextYear=function(){c.year++;c.selected=
null;e.editsEvent=!1};a.lastYear=function(){c.year-1<b?alert(b+"\u5e74\u3088\u308a\u4ee5\u524d\u306f\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9\u306e\u95a2\u4fc2\u3067\u8868\u793a\u3067\u304d\u307e\u305b\u3093\u3002"):(c.year--,c.selected=null);e.editsEvent=!1};a.dates="\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")}]);angular.module("rabbit").controller("eventEditorCtrl",["$scope","group","user","eventForm","calendar","db","mode","$mdToast",function(a,c,e,b,f,h,m,u){function v(a,f){var k=b.type;
if(""===b.name||"event"===k&&(null===b.year||null===b.month||null===b.date)||"habit"===k&&""===b.rule||b.selectedGroup===w||null===b.selectedGroup)u.show(u.simple().content("\u5165\u529b\u304c\u4e0d\u9069\u5207\u3067\u3059").position("top right").hideDelay(3E3));else{var l;if(l="event"===k){l=b.year;var y=b.month-1,B=b.date,x=new Date(l,y,B);l=!(x.getFullYear()===parseInt(l,10)&&x.getMonth()===parseInt(y,10)&&x.getDate()===parseInt(B,10))}l?u.show(u.simple().content("\u5165\u529b\u304c\u4e0d\u9069\u5207\u3067\u3059").position("top right").hideDelay(3E3)):
(b.isMessage&&(b.name="[mes]"+b.name),"private"===f?(e["private"][k][a]||(e["private"][k][a]={}),l=e["private"][k][a],e.updated=!0):(c[b.selectedGroup][k][a]||(c[b.selectedGroup][k][a]={}),l=c[b.selectedGroup][k][a],c[b.selectedGroup].updated=!0),"event"===k?(l.year=b.year,l.month=b.month-1,l.date=b.date,l.name=b.name):"habit"===k&&(l.selector=b.rule,l.name=b.name),u.show(u.simple().content("\u30a4\u30d9\u30f3\u30c8\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3)),
m.editsEvent=!1,k=b.selectedGroup,"private"===k?(e.save(),h.updateUser()):h.post(c[k],k,"update"))}}var n=[],t=[];a.mode=m;a.group=c;a.user=e;a.eventForm=b;a.calendar=f;a.ruleWriterFase="";a.ruleInput="";a.eventEditor={rules:"",selectedGroup:""};a.ruleGuide={day:[[":sun","\u65e5\u66dc\u65e5"],[":mon","\u6708\u66dc\u65e5"],[":tue","\u706b\u66dc\u65e5"],[":wed","\u6c34\u66dc\u65e5"],[":thu","\u6728\u66dc\u65e5"],[":fri","\u91d1\u66dc\u65e5"],[":sat","\u571f\u66dc\u65e5"]],month:[[":1","1\u6708"],[":2",
"2\u6708"],[":3","3\u6708"],[":4","4\u6708"],[":5","5\u6708"],[":6","6\u6708"],[":7","7\u6708"],[":8","8\u6708"],[":9","9\u6708"],[":10","10\u6708"],[":11","11\u6708"],[":12","12\u6708"]],selector:[["month","\u4f55\u6708"],["date","\u4f55\u65e5"],["day","\u4f55\u66dc\u65e5"],["not","\u9664\u304f"],["range","\u7bc4\u56f2"]]};a.addEvent=function(){var a=b.type;"private"===b.selectedGroup?v(e["private"][a].length,b.selectedGroup):null!==b.selectedGroup&&v(c[b.selectedGroup][a].length,b.selectedGroup)};
a.editEvent=function(){v(b.id,b.selectedGroup)};a.cancel=function(){m.editsEvent=!1};a.goFase=function(c,e){n[n.length]=a.ruleWriterFase;t[t.length]=e||c;a.ruleWriterFase=c;b.rule=t.join("")};a.cancelFase=function(){a.ruleWriterFase=n.pop();t.pop();b.rule=t.join("")};a.finishWritingRule=function(){a.ruleWriterFase="";n=[];b.rule=t.join("");t=[]};a.startWritingRule=function(){a.ruleWriterFase="selector";n=[];t=[]}}]);angular.module("rabbit").controller("groupEditorCtrl",["$scope","group","user","groupForm",
"db","$mdToast","mode",function(a,c,e,b,f,h,m){a.groupForm=b;a.user=e;b.parentGroup=[null];b.mode="add";a.group=c;a.finishMakingGroup=function(){m.editsGroup=!1};a.addGroup=function(){var e=b.parentGroup.reduce(function(a,b){-1===a.indexOf(b)&&(a[a.length]=angular.isNumber(b)?parseInt(b,10):"");return a},[]),m={event:[],habit:[],name:b.name,description:b.description,updated:!0};""!==e.join("")&&(m.parents=e);c[c.length]=m;f.post(m,c.length-1,"insert").success(a.finishMakingGroup);h.show(h.simple().content("\u30b0\u30eb\u30fc\u30d7 "+
b.name+" \u3092\u4f5c\u6210\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3));b.name="";b.description=""};a.cancel=function(){m.editsGroup=!1}}]);angular.module("rabbit").controller("detailCtrl",["$scope","eventCal","calendar","user","mode",function(a,c,e,b,f){a.mode=f;a.calendar=e;a.eventCalendar=c.eventCalendar;a.user=b;a.isToday=function(){return e.selected===e.today.date&&e.month===e.today.month&&e.year===e.today.year}}]);angular.module("rabbit").controller("settingCtrl",["$scope",
"_","group","user","db","eventListToEdit","groupForm","mode","$mdSidenav","$mdToast","$mdDialog",function(a,c,e,b,f,h,m,u,v,n,t){function g(a){return-1!==b.following.indexOf(a)}function r(a){if(!e[a].parents)return[];for(var b=e[a].parents,c=0,f=e[a].parents.length;c<f;c++)b=r(e[a].parents[c]).concat(b);return b}a.group=e;a.user=b;a.groupForm=m;a.search_keyword="";a.searchResult=[];a.hide=function(a){b.hiddenGroup[b.hiddenGroup.length]=a;b.hiddenGroup.sort(I);b.save();f.updateUser()};a.show=function(a){b.hiddenGroup=
c.without(b.hiddenGroup,a);b.save();f.updateUser()};a.followsParent=function(a){a=r(a);for(var b=0,c=a.length;b<c;b++)if(!g(a[b]))return a[b];return!0};a.toggleNav=function(){v("left").close()};a.follows=g;a.follow=function(a){b.follow(a);n.show(n.simple().content(e[a].name+"\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u307e\u3057\u305f").position("top right").hideDelay(3E3))};a.unfollow=function(a){var c=[];c[c.length]=b.following.indexOf(a);for(var g=0,h=b.following.length;g<h;g++)if(e[b.following[g]].parents&&
-1!==r(b.following[g]).indexOf(a)){if(!confirm("\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u306e\u5b50\u30b0\u30eb\u30fc\u30d7("+e[b.following[g]].name+")\u3092\u30d5\u30a9\u30ed\u30fc\u3057\u3066\u3044\u307e\u3059\u3002\u3053\u306e\u30b0\u30eb\u30fc\u30d7\u3092\u30d5\u30a9\u30ed\u30fc\u89e3\u9664\u3059\u308b\u3068\u3053\u3061\u3089\u3082\u89e3\u9664\u306b\u306a\u308a\u307e\u3059\u3002\u3088\u308d\u3057\u3044\u3067\u3059\u304b?"))return;c[c.length]=g}c.sort(function(a,b){return b-a});g=0;for(h=c.length;g<
h;g++)b.following.splice(c[g],1);b.save();f.updateUser()};a.showEventList=function(a){h.id=a;u.showsEventList=!0};a.makeGroup=function(){u.editsGroup=!0;v("left").close()};a.search=function(){var b=[];if(""===a.search_keyword||!e)return b;for(var c=L(a.search_keyword),f=0,g=e.length;f<g&&!(30<b.length);f++)e[f]&&(e[f].name&&-1!==L(e[f].name).indexOf(c)||e[f].description&&-1!==L(e[f].description).indexOf(c))&&(b[b.length]=f);a.searchResult=b};a.randomSearch=function(){var b=[];if(5>e.length)b.push.apply(b,
e);else for(;5>b.length;){var f=Math.random()*e.length|0;-1===c.indexOf(b,f)&&(b[b.length]=f)}a.searchResult=b};a.hideAll=function(){b.hiddenGroup.length=0;b.hiddenGroup=c.clone(b.following);b.hiddenGroup[b.hiddenGroup.length]=-1;b.hiddenGroup.sort(I);b.save();f.updateUser()};a.showAll=function(){b.hiddenGroup=[];b.save();f.updateUser()};a.importSetting=function(){t.show({controller:["$scope","$mdDialog",function(a,b){a.text="";a.answer=function(a){b.hide(a)}}],template:'<md-dialog><md-content>\u30b3\u30d4\u30fc\u3057\u305f\u30c7\u30fc\u30bf\u3092\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002<br><input ng-model="text"><md-button ng-click="answer(text)">ok</md-button></md-content></md-dialog>'}).then(function(a){a=
JSON.parse(a);for(var c in a)b[c]=a[c];b.save()})};a.exportSetting=function(){t.show(t.alert().title("").content("\u3053\u308c\u3092\u30b3\u30d4\u30fc\u3057\u3066\u79fb\u884c\u5148\u3067\u8cbc\u308a\u4ed8\u3051\u3066\u304f\u3060\u3055\u3044\u3002"+angular.toJson(b)).ok("ok"))}}]);angular.module("rabbit").controller("eventListCtrl",["$scope","group","user","eventListToEdit","mode",function(a,c,e,b,f){a.eventListToEdit=b;a.group=c;a.user=e;"private"!==b.id&&""!==b.id?(a.habitList=c[b.id].habit,a.eventList=
c[b.id].event):(a.habitList=e["private"].habit,a.eventList=e["private"].event);a.mode=f}]);angular.module("rabbit").factory("user",["_","$rootScope","$mdDialog","group","localStorageService",function(a,c,e,b,f){if(f.get("private")){var h=angular.fromJson(f.get("private"));h.id||(h.id=P());h.updated=!0}else h={following:[],"private":{event:[],habit:[],name:"\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8"},permission:[],hiddenGroup:[],id:P()},e.show(e.alert().title("[\u91cd\u8981]\u30e6\u30fc\u30b6\u30fc\u60c5\u5831\u3092\u751f\u6210\u3057\u307e\u3057\u305f\u3002").content("\u3053\u308c\u306f\u3042\u306a\u305f\u306eID\u3067\u3059\u3002\u5927\u5207\u306a\u306e\u3067\u30e1\u30e2\u3057\u3066\u304a\u3044\u3066\u304f\u3060\u3055\u3044\u3002"+
angular.toJson(h)+" \u3053\u308c\u306f\u8a2d\u5b9a\u753b\u9762\u306e\u8a2d\u5b9a\u3092\u4fdd\u5b58\u304b\u3089\u3082\u898b\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u3059\u3002").ok("ok"));h.isHiddenGroup=function(b){return-1!==a.indexOf(this.hiddenGroup,b,!0)};h.save=function(){c.$broadcast("updated");f.set("private",angular.toJson(this))};h.hasPermission=function(b){return"private"===b||-1!==a.indexOf(h.permission,b)};h.follow=function(a){h.following[h.following.length]=parseInt(a,10);h.following.sort(I);
h.save();db.updateUser()};h.save();return h}]).run(["user","db",function(a,c){c.permission().then(function(c){a.permission=c.data})}]).factory("eventForm",function(){return{name:"",year:(new Date).getFullYear(),month:(new Date).getMonth()+1,date:(new Date).getDate(),type:"event",rule:""}}).factory("groupForm",function(){return{name:""}}).factory("group",["_","calendar",function(a,c){var e=a.clone(c.holiday);e.id=0;e.name="\u795d\u65e5";e.updated=!0;return[e]}]).run(["_","db","group","$rootScope",
"localStorageService",function(a,c,e,b,f){b=a.clone(e)[0];f.get("group")&&(e.length=0,Array.prototype.push.apply(e,angular.fromJson(f.get("group"))),e[0]=a.clone(b));c.list()}]).factory("calendar",["OVER_MONTH","MEMO_LIMIT","IS_SMART_PHONE","ATTRIBUTE","error",function(a,c,e,b,f){function h(a,b){for(var c=[],e=0,f=B.event.length;e<f;e++)B.event[e].year===a&&B.event[e].month===b&&(c[c.length]=B.event[e].date);e=0;for(f=B.habit.length;e<f;e++)c.push.apply(c,u(B.habit[e].selector,a,b,c));1973>a||1973===
a&&4>b||(e=_.intersection(c,u("day:sun",a,b,[])),c.push.apply(c,_.map(e,function(a){for(var b=1;-1!==_.indexOf(c,a+b,!0);)b+=1;return a+b})),c.sort());if(1985<=a||1985===a&&12===b&&27<=d){var g=0;_.each(c,function(a){2===a-g&&c.push(a-1);g=a});c.sort()}return c}function m(a,b,c){c=c||!1;if(!c)if(x[a-g]){if(x[a-g][b])return x[a-g][b]}else x[a-g]=[];var e=[31,28,31,30,31,30,31,31,30,31,30,31][b];1===b&&l(a)&&(e=29);var f=[],k=0,J=(new Date(a,b,1)).getDay(),C=[];if(c){for(k=1;k<=e;k++)f[f.length]=k;
return f}for(k=J;0<k;k--)C[C.length]=0;for(k=1;k<=e;k++)6<J&&(J=0,f[f.length]=C,C=[]),C[C.length]=k,J++;for(k=J;7>k;k++)C[C.length]=t;0<C.length&&(f[f.length]=C);return x[a-g][b]=f}function u(a,b,c,e){function f(a,b,c,e){var g=function(){return m(b,c,!0)},p=function(a){a=a.toLowerCase();return"public-holiday"===a||"publicholiday"===a||"\u795d\u65e5"===a},x=function(a){a=a.toLowerCase();return"vernal-equinox-day"===a||"vernalequinoxday"===a||"\u6625\u5206"===a||"\u6625\u5206\u306e\u65e5"===a},u=function(a){a=
a.toLowerCase();return"autumnal-equinox-day"===a||"autumnalequinoxday"===a||"\u79cb\u5206"===a||"\u79cb\u5206\u306e\u65e5"===a},B=function(a){a=a.toLowerCase();return"full-moon-night"===a||"fullmoonnight"===a||"\u5341\u4e94\u591c"===a||"\u4e2d\u79cb\u306e\u540d\u6708"===a},Q=m(b,c),t={sunday:0,sun:0,"\u65e5\u66dc\u65e5":0,"\u65e5":0,monday:1,mon:1,"\u6708\u66dc\u65e5":1,"\u6708":1,tuesday:2,tue:2,"\u706b\u66dc\u65e5":2,"\u706b":2,wednesday:3,wed:3,"\u6c34\u66dc\u65e5":3,"\u6c34":3,thursday:4,thu:4,
"\u6728\u66dc\u65e5":4,"\u6728":4,friday:5,fri:5,"\u91d1\u66dc\u65e5":5,"\u91d1":5,saturday:6,sat:6,"\u571f\u66dc\u65e5":6,"\u571f":6},M={january:0,jan:0,"\u7766\u6708":0,february:1,feb:1,"\u5982\u6708":1,march:2,mar:2,"\u5f25\u751f":2,april:3,apr:3,"\u536f\u6708":3,may:4,"\u7690\u6708":4,june:5,jun:5,"\u6c34\u7121\u6708":5,july:6,jul:6,"\u6587\u6708":6,august:7,aug:7,"\u8449\u6708":7,september:8,sep:8,"\u9577\u6708":8,october:9,oct:9,"\u795e\u7121\u6708":9,november:10,nov:10,"\u971c\u6708":10,december:11,
dec:11,"\u5e2b\u8d70":11},n=a.split(":")[0];a=a.split(":").slice(1).join(":");var q=[],v=[],A=[],N=[],z,D,w,F=[];if("not"===n)if(q=g(),p(a))q=_.difference(q,h(b,c));else if(0===a.indexOf("year")||0===a.indexOf("month")||0===a.indexOf("date")||0===a.indexOf("day"))a=a.replace(/=/,":"),q=_.difference(g(),f(a,b,c));else{var H=a.split("=")[0],E=a.replace(/^.+?=/,""),E=E.replace(/^"(.+)"$/,"$1");_.each(e,function(a){if(a[H]===E||0===a[H].indexOf("[mes]")&&a[H].slice(5)===E)q=_.without(q,a.date)})}else if("is"===
n)if(p(a))q=_.intersection(g(),h(b,c));else{if("last"===a)return a=[31,28,31,30,31,30,31,31,30,31,30,31][c],l(b)&&1===c&&(a=29),[a];throw r("unexpected a value of a yesterday selector."+a);}else if("yesterday"===n)if(q=g(),n=a.split(":")[0],a.split(":").slice(1).join(":"),p(a))q=_.intersection(q,_.map(f("is:"+a,b,c),function(a){return a+1}));else if("day"===n||"date"===n)q=_.intersection(g(),_.map(f(a,b,c),function(a){return a+1}));else throw r("unexpected a value of a yesterday selector."+a);else if("range"===
n)if(".."===a.slice(0,2)){a="..."===a.slice(0,3)?a.slice(3):a.slice(2);a=_.map(a.split("/"),k);z=new Date(a[0],a[1]-1,a[2]);if(!y(a[0],a[1]-1,a[2]))throw r("invalid range selector."+n+":"+a);z.getFullYear()<b||z.getFullYear()===b&&z.getMonth()<c?q=[]:z.getFullYear()===b&&z.getMonth()===c?(q=g(),q=q.slice(0,_.lastIndexOf(q,z.getDate(),!0)+1)):q=g()}else if(".."===a.slice(-2)){a="..."===a.slice(-3)?a.slice(0,-3):a.slice(0,-2);a=_.map(a.split("/"),k);p=new Date(a[0],a[1]-1,a[2]);if(!y(a[0],a[1]-1,a[2]))throw r("invalid range selector."+
n+":"+a);p.getFullYear()>b||p.getFullYear()===b&&p.getMonth()>c?q=[]:p.getFullYear()===b&&p.getMonth()===c?(q=g(),q=q.slice(_.indexOf(q,p.getDate(),!0))):q=g()}else if(-1!==a.indexOf(".."))q=[],a=a.split("..."),1===a.length&&(a=a[0].split("..")),v=[],A=[],N=[],p=a[0],F=[],z=a[1],D=z.substr(z.length-4,4),w=z.substr(z.length-5,5),p=_.map(p.split("/"),k),3===p.length?F.push(new Date(p[0],p[1]-1,p[2])):2===p.length&&F.push(new Date(b-1,p[0]-1,p[1]),new Date(b,p[0]-1,p[1])),_.each(F,function(a){a.getFullYear()>
b||a.getFullYear()===b&&a.getMonth()>c?v=[]:a.getFullYear()===b&&a.getMonth()===c?(v=g(),v=v.slice(_.indexOf(v,a.getDate(),!0))):v=g();N.push(v)}),F=_.zip(F,N),_.each(F,function(a){var e=a[0];a=a[1];var f;if("date"===D||"week"===D||"year"===D||"dates"===w||"weeks"===w||"years"===w){var l;l="date"===D||"week"===D||"year"===D?k(z.substring(0,z.length-4)):k(z.substring(0,z.length-5));f=new Date(e.getTime());"date"===D||"dates"===w?f.setDate(f.getDate()+l):"week"===D||"weeks"===w?f.setDate(f.getDate()+
7*l):"year"!==D&&"years"!==w||f.setFullYear(f.getFullYear()+l)}else f=z.split("/"),f=_.map(f,k),3===f.length?f=new Date(f[0],f[1]-1,f[2]):(f=new Date(e.getFullYear(),f[0]-1,f[1]),f.getTime()<e.getTime()&&f.setFullYear(f.getFullYear()+1));f.getFullYear()<b||f.getFullYear()===b&&f.getMonth()<c?A=[]:f.getFullYear()===b&&f.getMonth()===c?(A=g(),A=A.slice(0,_.lastIndexOf(A,f.getDate(),!0)+1)):A=g();_.isEmpty(_.intersection(a,A))||(q=_.intersection(a,A))});else throw r('invalid selector "'+n+":"+a);else if("date"===
n)u(a)?q=1948>b||2030<b||1948<=b&&2030>=b&&8!==c?[]:[[23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,24,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23,23,22,23,23][b-1948]]:x(a)?q=1949>b||2030<b||1949<=b&&2030>=b&&2!==c?[]:[[21,21,21,21,21,21,21,21,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,21,21,21,20,20,21,
21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,21,21,20,20,20,21,20,20,20][b-1949]]:B(a)?(a=[{date:27},{date:16},{month:9,date:5},{date:24},{date:13},{month:9,date:2},{date:22},{date:10},{date:29},{date:18},{month:9,date:6},{date:25},{date:15},{month:9,date:4},{date:23},{date:12},{date:30},{date:19},{month:9,date:8},{date:26},{date:16},{month:9,date:5},{date:25},{date:13},{month:9,date:2},{date:21},{date:10},{date:28},{date:17},{month:9,date:6},{date:26},{date:15},
{month:9,date:4},{date:23},{date:12},{date:30},{date:19},{month:9,date:8},{date:27},{date:16},{month:9,date:5},{date:25},{date:14},{month:9,date:1},{date:20},{date:10},{date:29},{date:17},{month:9,date:6},{date:26},{date:15},{month:9,date:3},{date:22},{date:11},{date:30},{date:19},{date:8},{date:27},{date:17},{month:9,date:5},{date:24},{date:13},{month:9,date:2},{date:20},{date:10},{date:29},{date:18},{month:9,date:6},{date:26},{date:15},{month:9,date:3},{date:22},{date:11},{date:30},{date:20},{date:8},
{date:27},{date:17},{month:9,date:5},{date:23},{date:12},{month:9,date:1},{date:21},{date:10},{date:29},{date:18},{month:9,date:7},{date:25},{date:14},{month:9,date:3},{date:22},{date:11},{date:30},{date:20},{date:9},{date:27},{date:16},{month:9,date:5},{date:24},{date:12},{month:9,date:1},{date:21},{date:11},{date:28},{date:18},{month:9,date:6},{date:25},{date:14},{month:9,date:3},{date:22},{date:12},{date:30},{date:19},{date:8},{date:27},{date:15},{month:9,date:4},{date:24},{date:13},{month:9,date:1},
{date:21},{date:10},{date:29},{date:17},{month:9,date:6},{date:25},{date:15},{month:9,date:3},{date:22},{date:12}],q=1901>b||2030<b?[]:!a[b-1901].month&&8===c||a[b-1901].month===c?[a[b-1901].date]:[]):q=[k(a)];else if("month"===n)q=!M[a.toLowerCase()]&&k(a)!==c+1||M[a.toLowerCase()]&&M[a.toLowerCase()]!==c?[]:g();else if("day"===n)if(a.match(/^\d/))a=a.toLowerCase().match(/^(\d+)(?:st|[nr]d|th)-?(.+)$/),p=k(a[1]),q=[(f("day:"+a[2],b,c)||[])[p-1]];else if("last"===a.slice(0,4).toLowerCase()){a=a.toLowerCase();
var G=a.slice(4);"-"===G.charAt(0)&&(G=G.slice(1));q=[_.last(f("day:"+G,b,c))]}else G=t[a.toLowerCase()],_.some(Q,function(a){""!==a[G]&&(q[q.length]=a[G])});else if("year"===n)q="leap-year"===a||"leap_year"===a||"\u3046\u308b\u3046\u5e74"===a||"\u958f\u5e74"===a?l(b)?g():[]:k(a)!==b?[]:g();else throw r('undefined key "'+n+'".');return q}if(""===a)throw r("cannot exec empty selector.");a=n(v(a));e=e||[];var g=[];_.each(a,function(a){if(a[1]===E)g[g.length]=f(a[0],b,c,e);else if(a[1]===H)if("&&"===
a[0])g.push(_.intersection(g.pop(),g.pop()));else if("||"===a[0])g.push(_.union(g.pop(),g.pop()));else throw r("undefined operator "+a[0]);});if(1!==g.length)throw console.log(g,a),r("unexpected error in execSelectors().");return g.pop()}function v(a){function b(a){""!==a[0]&&(c[c.length]=a)}if(p[a])return p[a];for(var c=[],e=!1,f=0,g=0,k=a.length;g<k;g++){var l=a.charAt(g);if(e)'"'===l?e=!1:"\\"===l&&(g+=1);else if('"'===l)e=!0;else if(" "===l)b([a.substring(f,g),E]),l=a.substr(g).match(/^ (?:and|&&|\u304b\u3064|or|\|\||\u307e\u305f\u306f) |^ /)[0],
b([{" ":"&&"," and ":"&&"," \u304b\u3064 ":"&&"," && ":"&&"," or ":"||"," \u307e\u305f\u306f ":"||"," || ":"||"}[l],H]),f=g+l.length,g+=l.length;else if("("===l||")"===l)b([a.substring(f,g),E]),b([l,"("===l?K:I]),f=g+1}""!==a.substring(f)&&b([a.substring(f),E]);return p[a]=c}function n(a){for(var b=[],c=[],e={"||":0,"&&":1},f=0,g=a.length;f<g;f++)if(a[f][1]===E)c[c.length]=a[f].concat();else if(a[f][1]===H){var k=a[f][0];b[b.length-1]&&e[k]<=e[b[b.length-1][0]]&&(c[c.length]=b.pop());b[b.length]=
a[f]}else if(a[f][1]===K)b[b.length]=a[f];else if(a[f][1]===I){for(;b[b.length-1][1]!==K;)if(c[c.length]=b.pop(),0===b.length)throw r("found mismatched parentheses");b.pop()}for(;0<b.length;){if(b[b.length-1][1]===K)throw r("found mismatched parentheses.");c[c.length]=b.pop()}return c}var t=a,g=c;a=e;var r=f;t===w&&(t=64);g===w&&(g=1950);a===w&&(a=!1);b===w&&(b={OPERATOR:0,OTHERS:1,LPARENTHESES:2,RPARENTHESES:3});r===w&&(r=function(){var a=a||Error;return function(b){return new a(b)}});if(k===w)var k=
function(a){return parseInt(a,10)};if(l===w)var l=function(a){return 0===a%400||0===a%4&&0!==a%100};if(y===w)var y=function(a,b,c){var e=new Date(a,b,c);return e.getFullYear()===k(a)&&e.getMonth()===k(b)&&e.getDate()===k(c)};var B={event:[],habit:[{name:"[mes]\u5143\u65e6",selector:"range:1948/7/20.. month:1 date:1"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"range:1948/7/20..1999/12/31 month:1 date:15"},{name:"[mes]\u6210\u4eba\u306e\u65e5",selector:"range:2000/1/1.. month:1 day:2nd-mon"},{name:"[mes]\u5efa\u56fd\u8a18\u5ff5\u306e\u65e5",
selector:"range:1967/1/1.. month:2 date:11"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"range:1948/7/20..1988/12/31 month:4 date:29"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"range:1989/1/1..2006/12/31 month:4 date:29"},{name:"[mes]\u662d\u548c\u306e\u65e5",selector:"range:2007/1/1.. month:4 date:29"},{name:"[mes]\u61b2\u6cd5\u8a18\u5ff5\u65e5",selector:"range:1948/7/20.. month:5 date:3"},{name:"[mes]\u307f\u3069\u308a\u306e\u65e5",selector:"range:2007/1/1.. month:5 date:4"},
{name:"[mes]\u3053\u3069\u3082\u306e\u65e5",selector:"range:1948/7/20.. month:5 date:5"},{name:"[mes]\u6d77\u306e\u65e5",selector:"range:1996/1/1..2002/12/31 month:7 date:20"},{name:"[mes]\u6d77\u306e\u65e5",selector:"range:2003/1/1.. month:7 day:3rd-mon"},{name:"[mes]\u5c71\u306e\u65e5",selector:"range:2016/1/1.. month:8 date:11"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"range:1966/1/1..2002/12/31 month:9 date:15"},{name:"[mes]\u656c\u8001\u306e\u65e5",selector:"range:2003/1/1.. month:9 day:3rd-mon"},
{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"range:1966/1/1..1999/12/31 month:10 date:10"},{name:"[mes]\u4f53\u80b2\u306e\u65e5",selector:"range:2000/1/1.. month:10 day:2nd-mon"},{name:"[mes]\u6587\u5316\u306e\u65e5",selector:"range:1948/7/20.. month:11 date:3"},{name:"[mes]\u52e4\u52b4\u611f\u8b1d\u306e\u65e5",selector:"range:1948/7/20.. month:11 date:23"},{name:"[mes]\u5929\u7687\u8a95\u751f\u65e5",selector:"range:1989/1/1.. month:12 date:23"},{name:"[mes]\u6625\u5206\u306e\u65e5",selector:"range:1949/1/1.. date:vernal-equinox-day"},
{name:"[mes]\u79cb\u5206\u306e\u65e5",selector:"range:1948/1/1.. date:autumnal-equinox-day"},{name:"[mes]\u5341\u4e94\u591c",selector:"range:1901/1/1.. date:full-moon-night"}]};f=new Date;var x=[],p={},A;for(A in b);var H=b.OPERATOR,E=b.OTHERS,K=b.LPARENTHESES,I=b.RPARENTHESES;return{year:f.getFullYear(),month:f.getMonth(),date:f.getDate(),calendar:m,today:{year:f.getFullYear(),month:f.getMonth(),date:f.getDate()},selected:f.getDate(),selectedDay:function(){return null===this.selected?"":"\u65e5\u6708\u706b\u6c34\u6728\u91d1\u571f".split("")[(new Date(this.year,
this.month,this.selected)).getDay()]},holiday:B,disableHoverEvent:a,splitSelector:v,execSelectors:u}}]).factory("eventCal",["_","group","user","calendar",function(a,c,e,b){function f(g,r,k){if("private"!==g&&!c[g])return[];var l=[],y=[];"private"===g?(a.each(e.following,function(a){y=y.concat(f(a,r,k))}),l=l.concat(h(e["private"].event,r,k,"private")),y=y.concat(l),l=l.concat(m(e["private"].habit,r,k,"private",y)),e.updated=!1):(c[g].parents&&a.each(c[g].parents,function(a){y=y.concat(f(a,r,k))}),
l=l.concat(h(c[g].event,r,k,g)),y=y.concat(l),l=l.concat(m(c[g].habit,r,k,g,y)),c[g].updated=!1);if(0!==g)return l;if(!(1973>r||1973===r&&4>k)){var n=a.map(l,function(a){return a.date});g=a.intersection(n,b.execSelectors("day:sun",r,k,[]));l.concat(a.map(g,function(b){for(var c=1;-1!==a.indexOf(n,b+c,!0);)c+=1;return{year:r,month:k,date:b+c,name:"[mes]\u632f\u66ff\u4f11\u65e5",group:0,id:-1,type:"habit"}}));l.sort()}if(1985<=r||1985===r&&12===k&&27<=d){var n=a.map(l,function(a){return a.date}),x=
0;a.each(n,function(a){2===a-x&&l.push({year:r,month:k,date:a-1,name:"[mes]\u56fd\u6c11\u306e\u4f11\u65e5",group:0,id:-2,type:"habit"});x=a});l.sort()}return l}function h(b,c,e,f){var h=[];if(!b)return h;for(var m=0,n=b.length;m<n;m++)if(b[m].year===c&&b[m].month===e){var p=a.clone(b[m]);p.group=f;p.type="event";p.id=m;h[h.length]=p}return h}function m(c,e,f,l,h){if(!c)return[];for(var m=[],n=0,p=c.length;n<p;n++){c[n].type="habit";c[n].group=l;var u=b.execSelectors(c[n].selector,e,f,h);a.each(u,
function(a,b){u[b]={year:e,month:f,date:a,name:c[n].name,group:l,id:n,type:"habit"}});m=m.concat(u)}return m}var u=[],v="",n=-1,t=-1;return{eventCalendar:function(g){var h=[],k=[],l=a.difference(e.following,e.hiddenGroup);if(b.year!==n||b.month!==t)n=b.year,t=b.month,u=[];else{if(l.join(",")===v&&!e.updated&&a.every(l,function(a){return!c[a]||!1===c[a].updated}))return u[g]||[];u=[];v=l.join(",")}for(var m=0,w=l.length;m<w;m++)h[h.length]=f(l[m],b.year,b.month);e.isHiddenGroup(-1)||(h[h.length]=f("private",
b.year,b.month));m=0;for(w=h.length;m<w;m++)for(var x=0,p=h[m].length;x<p;x++){var A=h[m][x].date;k[A]||(k[A]=[]);k[A][k[A].length]=h[m][x].id+":"+h[m][x].group+":"+h[m][x].type}u=a.clone(k);v=l.join(",");return u[g]||[]}}}]).factory("eventListToEdit",function(){return{id:""}}).factory("error",["$mdToast",function(a){var c=c||Error;return function(e){a.show(a.simple().content(e).position("top right").hideDelay(3E3));return new c(e)}}]).factory("mode",["_","eventForm","$mdSidenav","user","group",function(a,
c,e,b,f){return{editsEvent:!1,editsGroup:!1,showsEventList:!1,switchToEdit:function(){if(1===arguments.length||2===arguments.length&&!0===arguments[1]){var h=arguments[0].split(":");c.mode=1===arguments.length?"edit":"add";a.extend(c,{type:h[2],id:1===arguments.length?parseInt(h[0],10):0});c.selectedGroup="private"!==h[1]?parseInt(h[1],10):"private";var m="private"===h[1]?b["private"]:f[h[1]];"event"===h[2]?(m=m.event[h[0]],a.map(["year","month","date","name"],function(a){c[a]=m[a]}),c.month+=1,m=
null):"habit"===h[2]&&(m=m.habit[h[0]],c.rule=m.selector,c.name=m.name,m=null);c.isMessage="[mes]"===c.name.slice(0,5);c.isMessage&&(c.name=c.name.slice(5))}else 3===arguments.length&&a.extend(c,{mode:"add",type:"event",rule:"",id:0,name:"",year:arguments[0],month:arguments[1]+1,date:arguments[2]});this.editsEvent=!0;e("left").close()}}}]).factory("db",["_","user","group","$http","$rootScope","$log","localStorageService",function(a,c,e,b,f,h,m){function u(g){var h=a.clone(e)[0];g=g||c.following.join(",");
return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"list",groupID:g}).success(n).error(t).then(function(b){b=b.data;for(var c=0,g=b.length;c<g;c++){for(var n in b[c])b[c][n]=angular.fromJson(b[c][n]||'""');b[c].updated=!0}b.sort(function(a,b){return a.id-b.id});c=e.length=0;for(g=b.length;c<g;c++)e[b[c].id]=b[c];e[0]=a.clone(h);f.$broadcast("updated");m.set("group",angular.toJson(e));v().then(function(b){for(var c=0,f=b.data[0].length;c<f;c++)e[c]||(e[c]={name:angular.fromJson(b.data[0][c]),
description:angular.fromJson(b.data[1][c])},b.data[2][c]&&(e[c].parents=angular.fromJson(b.data[2][c])));e[0]=a.clone(h);m.set("group",angular.toJson(e))})})}function v(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"namelist"}).success(n).error(t)}function n(a){return a}function t(a){h.log(a)}f.$watch("user.following",function(){u()});return{post:function(e,m,k){e=a.clone(e);e.id=m;e.permission=e.permission||[c.id];e.description=e.description||"";e.parents=e.parents||
"";delete e.updated;for(var l in e)e[l]=O(angular.toJson(e[l]));e.type=k;f.$broadcast("updated");return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",e).success(function(a){h.log("updated");h.log(a)}).error(t)},list:u,login:function(a){return b.post("http://www40.atpages.jp/chatblanc/genderC/login.php",a).success(n).error(t)},updateUser:function(){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"updateUser",user:c}).success(n).error(t)},getNameList:v,
permission:function(a){return b.post("http://www40.atpages.jp/chatblanc/genderC/database.php",{type:"permission",groupID:c.following.join(","),userID:c.id}).success(n).error(t)}}}]).run(["calendar","$timeout",function(a,c){function e(){var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);var h=new Date;a.today.year=h.getFullYear();a.today.month=h.getMonth();a.today.date=h.getDate();c(e,b-new Date)}var b=new Date;b.setDate(b.getDate()+1);b.setHours(0);
b.setMinutes(0);b.setSeconds(0);b.setMilliseconds(0);c(e,b-new Date)}]).config(["$locationProvider",function(a){a.html5Mode({enabled:!0,requireBase:!1})}]).run(["user","group","$location",function(a,c,e){e=e.search();if(angular.isDefined(e.id)){var b=parseInt(e.id,10);-1===_.indexOf(a.following,b,!0)&&(console.log(c,b),angular.isUndefined(c[b])&&(c[b]={name:"",description:"",event:[],habit:[],updated:!1,id:b}),a.follow(e.id),a.save(),db.updateUser())}}]);angular.module("rabbit").directive("appDate",
function(){return{scope:{row:"=appRow"},restrict:"A",template:'<span class="date"></span>',replace:!0,controller:["$scope","calendar","eventCal","$filter","OVER_MONTH","IS_SMART_PHONE",function(a,c,e,b,f,h){a.OVER_MONTH=f;a.IS_SMART_PHONE=h;a.calendar=c;a.dateClass=function(a){if(0!==a&&32!==a){var f=[];c.selected===a&&(f[f.length]="selected");for(var h=f.length,n=e.eventCalendar(a),t=0,g=0,r=n.length;g<r;g++)0!==b("format")(n[g],!1).indexOf("[mes]")&&t++;f[h]="booked-"+(5>t?t:5);a===c.today.date&&
c.month===c.today.month&&c.year===c.today.year&&(f[f.length]="today");return f}return[]}}],link:function(a,c,e){function b(){c.removeClass("selected booked-0 booked-1 booked-2 booked-3 booked-4 booked-5 today");c.addClass(a.dateClass(f).join(" "))}var f=a.row[e.appDate];0!==f&&f!==a.OVER_MONTH&&f!==w&&(c.append(angular.element("<span>").addClass("inner").text(f)),a.$on("updated",b),b(),c.on("mouseenter",function(){!a.calendar.disableHoverEvent&&f&&(a.calendar.selected=f,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),
b(),a.$apply())}),c.on("mouseleave",function(){a.calendar.disableHoverEvent||(a.calendar.selected=null,angular.element(document.querySelectorAll(".selected")).removeClass("selected"),a.$apply())}),c.on("click",function(){a.IS_SMART_PHONE||(a.calendar.disableHoverEvent=a.calendar.selected===f?!a.calendar.disableHoverEvent:!0);a.calendar.selected=f;angular.element(document.querySelectorAll(".selected")).removeClass("selected");b();a.$apply()}))}}}).directive("eventItem",function(){return{restrict:"A",
scope:{event:"=appEvent"},template:'<div class="md-item-content event-item" layout="row"><div flex>{{event|format}}</div><div flex><md-button ng-click="mode.switchToEdit(event)">\u7de8\u96c6</md-button><md-button ng-click="mode.switchToEdit(event,true)">\u30b3\u30d4\u30fc</md-button><md-button ng-click="deleteEvent(event)" ng-if="user.hasPermission(event.split(\':\')[1])">\u524a\u9664</md-button></div></div>',replace:!0,controller:["$scope","mode","user","db",function(a,c,e,b){a.mode=c;a.user=e;a.deleteEvent=
function(a){var c=a.split(":")[0],m=a.split(":")[1];a=a.split(":")[2];e.hasPermission(m)&&("private"===m?(e["private"][a].splice(c,1),e.updated=!0,e.save(),b.updateUser()):(group[m][a].splice(c,1),group[m].updated=!0,b.post(group[m],m,"update")))}}],link:function(a,c,e){}}})})(window);
