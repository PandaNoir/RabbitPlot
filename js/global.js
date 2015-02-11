var OVER_MONTH=64;//calF.calendar()で来月の範囲に入った時に代入される値
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
function isLeapYear(year){
    return year%400===0||year%4===0&&year%100!==0;
};
