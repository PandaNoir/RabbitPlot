var appName='rabbit';
function sortByNumber(a,b){
    return a-b;
};
function isValidDate(y,m,d){
    var date=new Date(y,m,d);
    return date.getFullYear()===toInt(y)&&
        date.getMonth()===toInt(m)&&
        date.getDate()===toInt(d);
};
function toInt(n){
    return parseInt(n,10);
};
function toOneByte(str){
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
};
function toHiragana(str){
    //配列を用意する
    var hankaku=['ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ','ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾊﾟ','ﾋﾞ','ﾋﾟ','ﾌﾞ','ﾌﾟ','ﾍﾞ','ﾍﾟ','ﾎﾞ','ﾎﾟ','ｳﾞ','ｧ','ｱ','ｨ','ｲ','ｩ','ｳ','ｪ','ｴ','ｫ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ','ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ｯ','ﾂ','ﾃ','ﾄ','ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ','ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ｬ','ﾔ','ｭ','ﾕ','ｮ','ﾖ','ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ','｡','｢','｣','､','･','ｰ','ﾞ','ﾟ'];
    var zenkaku=['ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','パ','ビ','ピ','ブ','プ','ベ','ペ','ボ','ポ','ヴ','ァ','ア','ィ','イ','ゥ','ウ','ェ','エ','ォ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ッ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ャ','ヤ','ュ','ユ','ョ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン','。','「','」','、','・','ー','゛','゜'];
    //変換開始
    str=toOneByte(str);
    for (var i=0;i<=88;i++){//89文字あるのでその分だけ繰り返す
        if(str.indexOf(hankaku[i])>=0){
            str=str.replace(new RegExp(hankaku[i],'g'),zenkaku[i]); //半角カナに対応する全角カナに置換する
        }
    }
    str = str.replace(/[ァ-ン]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0x60);
    });
    return str;
};
function isLeapYear(year){
    return year%400===0||year%4===0&&year%100!==0;
};
function uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += "-"
        }
        uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
};
function getHash(str){
    return (new jsSHA(str,'TEXT')).getHash('SHA-384','HEX');
};
angular.module('lodash',[])
.factory('_',function(){
    return _;
});

angular.module(appName,['ngTouch','ngAnimate','ngMaterial','ngMessages','LocalStorageModule','lodash'])
.constant('OVER_MONTH',64)//calendar.calendar()で来月の範囲に入った時に代入される値
.constant('MEMO_LIMIT',1950)//メモを高速化するために添字から引く値。2015よりも65を添え字としたほうが高速。
.constant('IS_SMART_PHONE',
    navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') === -1 ||
    navigator.userAgent.indexOf('iPod') > 0 ||
    navigator.userAgent.indexOf('Android') > 0
)
.constant('ATTRIBUTE',{
    OPERATOR:0,
    OTHERS:1,
    LPARENTHESES:2,
    RPARENTHESES:3
});
