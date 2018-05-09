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