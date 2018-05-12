/**
 * Created by 瑞瑞牛肉面 on 2018/5/12.
 */

$(function(){
  
  $.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    success: function(info){
      var htmlStr = template('leftTpl',info);
      $('.lt_category_left ul').html(htmlStr);
    }
  })
})