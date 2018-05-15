/**
 * Created by 瑞瑞牛肉面 on 2018/5/15.
 */
$(function() {
  // 需求: 实现登录功能
  // 1. 点击登录按钮
  // 2. 获取用户输入的用户名和密码
  // 3. 发送 ajax 请求, 进行登陆
  $('#loginBtn').click(function(){
    var username = $('[name="username"]').val().trim();
    var password = $('[name="password"]').val().trim();
    
    if(username === ''){
      mui.toast('请输入用户名');
      return;
    }
    
    if(password === ''){
      mui.toast('请输入密码');
      return;
    }
    
    $.ajax({
      type:'post',
      url:'/user/login',
      data:{
        username:username,
        password:password
      },
      success: function(info){
        if(info.error === 403){
          mui.toast('用户名或者密码错误');
        }
        
        if(info.success){
          if(location.href.indexOf('retUrl')>-1){
            var url = location.search.replace('?retUrl=','');
            location.href = url;
          }
          else {
            location.href = 'member.html';
          }
        }
      }
    })
  })
})