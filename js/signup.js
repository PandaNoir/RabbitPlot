$(function(){
    var database='http://www40.atpages.jp/chatblanc/genderC/database.php';
    database='http://localhost/hoge.php';
    $('#confirm').on('click',function(e){
        e.stopPropagation();
        $('#waiting').show();
        $.post(database,{'username':$('#username').val()},function(mes){
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
        $.post(database,{'username':$('#username').val(),'password':(new jsSHA($('#password').val(),'TEXT')).getHash('SHA-384','HEX')},function(mes){
            console.log(mes);
            if(mes==='OK'){
                alert('登録完了しました.');
            }else if(mes==='USERNAME'){
                alert('すでに'+$('#username').val()+'というユーザー名は使用されています.');
            }
        });
    });
});
