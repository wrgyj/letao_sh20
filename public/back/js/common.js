/**
 * Created by 瑞瑞牛肉面 on 2018/5/9.
 */
if(location.href.indexOf("login.html")=== -1){
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    dataType:'json',
    success:function(info){
      console.log(info);
      if(info.error===400){
        location.href="login.html";
      }
    }
  })
}

//禁用进度条
NProgress.configure({showSpinner:false});

$(document).ajaxStart(function(){
  //开启进度条
  NProgress.start();
});

$(document).ajaxStop(function(){
  //模拟网络环境
  setTimeout(function(){
    NProgress.done();
  },500);
});

$(function(){
  //1.公共的二级菜单切换功能
  $('.category').click(function(){
    $('.lt_aside .child').stop().slideToggle();
  })
  
  //2.点击菜单按钮，进行切换菜单
  $('.icon_menu').click(function(){
    $('.lt_aside').toggleClass('hidemenu');
    $('.lt_topbar').toggleClass('hidemenu');
    $('.lt_main').toggleClass('hidemenu');
  });
  
  //3.点击icon_logout 应该显示模态框
  $('.icon_logout').click(function(){
    $('#logoutModal').modal('show');
  })


  //4.点击模态框退出按钮，实现退出
  $('#logoutBtn').click(function(){
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      dataType:'json',
      success:function(info){
        if(info.success){
          location.href='login.html';
        }
      }
    })
  });
  
})