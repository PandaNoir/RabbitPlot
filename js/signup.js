$(function(){
    var database='http://www40.atpages.jp/chatblanc/genderC/';
    $('#confirm').on('click',function(e){
        e.stopPropagation();
        $('#waiting').show();
        $.post(database+'confirm.php',{'username':$('#username').val()},function(mes){
            console.log(mes);
            if(mes==='OK'){
                $('#canUse').text('使えます');
            }else{
                $('#canUse').text('使えません');
            }
            $('#waiting').hide();
        });
    });
    $('#signup').on('click',function(e){
        $.post(database+'signup.php',{'username':$('#username').val(),'password':(new jsSHA($('#password').val(),'TEXT')).getHash('SHA-384','HEX'),'id':uuid()},function(mes){
            console.log(mes);
            if(mes==='OK'){
                alert('登録完了しました.');
                location.href='http://pandanoir.web.fc2.com/RabbitPlot';
            }else if(mes==='USERNAME'){
                alert('すでに'+$('#username').val()+'というユーザー名は使用されています.');
            }
        });
    });
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
});
