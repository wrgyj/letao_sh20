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
      renderSecondById(info.rows[0].id);
    }
  })
  
  $('.lt_category_left ul').on('click','a',function(){
    var id = $(this).data('id');
    renderSecondById(id);
    $(this).addClass('current').parent().siblings().find('a').removeClass('current');
  })
  
  function renderSecondById(id){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data:{id:id},
      success:function(info){
        // console.log(info);
        var htmlStr = template('rightTpl',info);
        $('.lt_category_right ul').html(htmlStr);
      }
    })
  }
})