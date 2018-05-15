/**
 * Created by 瑞瑞牛肉面 on 2018/5/15.
 */
$(function() {
  $.ajax({
    type:'get',
    url:'/user/queryUserMessage',
    success:function(info){
      if(info.error === 400){
        location.href = 'login.html';
        return;
      }
  
      // 说明当前用户登录了, 需要进行页面模板渲染
      var htmlStr = template('userTpl',info);
      $('#userInfo').html(htmlStr);
    }
  });
  
  // 2. 点击退出按钮, 进行退出
  $('#logoutBtn').click(function(){
    $.ajax({
      type:'get',
      url:'/user/logout',
      success:function(info){
        if(info.success){
          location.href = 'login.html';
        }
      }
    })
  })
})