/**
 * Created by 瑞瑞牛肉面 on 2018/5/11.
 */


$(function(){
  
  var currentPage = 1;
  var pageSzie = 5;
  
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:currentPage,
        pageSize:pageSzie
      },
      success:function(info){
        // console.log(info);
        var htmlStr = template('secondtpl',info);
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
    $('#secondModal').modal('show');
  
    // 发送请求, 获取所有的一级分类数据
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page: 1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        var htmlStr = template('dropdownTpl',info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  
  });
  
  
  //3.给所有的a绑定点击事件
  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    // 设置到按钮中去
    $('#dropdownText').text(txt);
  
    // 获取当前 a 的 id, 设置到 input 框中去
    var id = $(this).data('id');
    $('[name="categoryId"]').val(id);
  
    // 由于插件不会对隐藏域的修改进行监听, 所以我们需要手动设置隐藏域的校验状态
    // 参数1: 字段名
    // 参数2: 校验状态   VALID 成功  INVALID 失败
    // 参数3: 校验规则, 错误状态下的提示文本
    $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
  });
  
  //4.配置文件上传
  /*
   * 完成图片上传思路
   * 1. 引包
   * 2. 写结构, input:file 配置 name 和 data-url
   * 3. 写js, 进行文件上传初始化, 配置回调函数, 进行图片上传回调处理
   * */
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var picUrl = data.result.picAddr;
      $('#imgBox img').attr('src',picUrl);
      $('[name="brandLogo"]').val(picUrl);
      $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
    }
  });
  
  //5.表单校验
  $('#form').bootstrapValidator({
    excluded: [],
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    //3. 指定校验字段
    fields: {
      //校验用户名，对应name表单的name属性
      categoryId: {
        validators: {
          //不能为空
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName:{
        validators: {
          //不能为空
          notEmpty: {
            message: '请输入二级分类名称'
          }
        }
      },
      brandLogo:{
        validators: {
          //不能为空
          notEmpty: {
            message: '请上传图片'
          }
        }
      }
    }
  });
  
  
  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 进行提交
  $('#form').on("success.form.bv", function( e ) {
    // 阻止默认的表单提交
    e.preventDefault();
    
    console.log($('#form').serialize());
    
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 添加二级分类成功
          // 隐藏模态框
          $('#secondModal').modal("hide");
          // 重新渲染第一页
          currentPage = 1;
          render();
          
          // 将表单内容重置 resetForm(true)
          $('#form').data("bootstrapValidator").resetForm( true );
          
          // 将文本重置
          $('#dropdownText').text("请选择一级分类");
          
          // 将图片重置
          $('#imgBox img').attr("src", "./images/none.png");
        }
      }
    })
  })
  
})