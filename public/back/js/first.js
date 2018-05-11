/**
 * Created by 瑞瑞牛肉面 on 2018/5/11.
 */

$(function(){
  //1.渲染页面
  var currentPage = 1;
  var pageSize = 5;
  
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page: currentPage,
        pageSize: pageSize
      },
      success:function(info){
        // console.log(info);
        var htmlStr = template('firsttpl',info);
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
  
  //2.点击添加分类按钮
  $('#addBtn').click(function(){
    $('#firstModal').modal('show');
  })
  
  //3.进行表单校验
  //使用表单校验插件
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入一级分类'
          }
        }
      }
    }
  });
  
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data:$('#form').serialize(),
      success:function(info){
        // console.log(info);
        if(info.success){
          $('#firstModal').modal('hide');
          currentPage = 1;
          render();
          
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })
  
})