/**
 * Created by 瑞瑞牛肉面 on 2018/5/11.
 */

$(function(){
  var currentPage = 1;
  var pageSize = 5;
  
  //1.渲染页面
  render();
  function render(){
    $.ajax({
      url:'/user/queryUser',
      dataType:'json',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        // console.log(info);
        var htmlStr = template('tpl',info);
        $('.lt_content tbody').html(htmlStr);
  
        // 分页插件
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(a,b,c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        });
        
      }
    })
  }
  
  //2.点击启用禁用按钮，显示模态框
  $('.lt_content tbody').on('click','.btn',function(){
    // console.log(1);
    $('#userModal').modal('show');
    
    var id = $(this).parent().data('id');
    var isDelete = $(this).hasClass('btn-success')? 1 : 0;
    
    $('#submitBtn').off().click(function(){
      $.ajax({
        type:'post',
        url:'/user/updateUser',
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function(info){
          // console.log(info);
          $('#userModal').modal('hide');
          render();
        }
      })
    })
  })
  
})