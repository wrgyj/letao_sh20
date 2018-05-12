/**
 * Created by 瑞瑞牛肉面 on 2018/5/12.
 */


$(function(){
  
  var currentPage = 1;
  var pageSize = 2;
  var picArr=[];
  
  render();
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page: currentPage,
        pageSize: pageSize
      },
      success: function(info){
        // console.log(info);
        var htmlStr = template('productTpl',info);
        $('.lt_content tbody').html(htmlStr);
        
        //使用分页插件进行分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: currentPage,
          totalPages: Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            currentPage = page;
            render();
          }, 
          itemTexts:function(type,page,current){
            switch(type){
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },
          
          tooltipTitles:function(type,page,current){
            switch(type){
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往第" + page +"页";
            }
          },
          // 使用 bootstrap 提供的提示框组件
          useBootstrapTooltip: true
        });
      }
    })
  }
  
  //2. 点击添加按钮，显示模态框
  $('#addBtn').click(function(){
    $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        // console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl',info));
      }
    })
  });
 
  //3. 通过事件委托来实现二级分类功能
  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    // 如果用户选择了二级分类, 需要更新 brandId 隐藏域的校验状态 为 VALID
    // 参数1: 校验的字段
    // 参数2: 校验的状态
    // 参数3: 校验的规则, 失败时的提示信息
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  })
  
  // 4. 多文件上传步骤
  // 1. 引入插件包
  // 2. 配置结构, name, data-url multiple(配置可以选择多文件)
  // 3. 进行插件初始化
  
  // 在 jquery.fileupload 内部已经对文件上传的 ajax 操作进行了封装
  // 如果是单文件, 发送一次图片上传请求
  // 如果是多文件, 发送多次图片上传请求, 会遍历所选择的图片, 进行多次请求 (意味着会有多次响应)
  $('#fileupload').fileupload({
    dataType:'json',
    done:function(e,data){
      // console.log(data);
      // 每张图片响应回来, 都会调用一次这个响应函数
      var picUrl = data.result.picAddr;
      // 图片对象
      var picObj = data.result;
      // append 添加到子元素最后面去
      // prepend 添加到子元素最前面去
      $('#imgBox').prepend('<img src="'+picUrl+'" width="100" alt="">');
  
      // 还需要加图片对象, 添加到数组中
      // 数组常用操作: unshift, shift, push, pop, ( map reduce forEach every some filter 了解 )
      picArr.unshift(picObj);
      // 如果超过 3 张, 将最后的一张, 最老的一张, 删掉
      if(picArr.length >3){
        // 删除数组的最后一项
        picArr.pop();
        // 删除图片中的最后一个
        // 需求: 获取盒子中的最后一个图片子元素
        // img:last-of-type 找到最后一个img类型的子元素, 让他自杀
        $('#imgBox img:last-of-type').remove();
      }
  
      // 说明满足上传 3 张的图片的条件了, 手动更新 picStatus 隐藏域的校验状态
      if(picArr.length === 3){
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }
    }
  });
  
  //5.表单校验
  $('#form').bootstrapValidator({
    // 默认对隐藏域不进行校验, 我们需要重置
    excluded: [],
  
    // 指定校验时的图标显示
    feedbackIcons: {
      // 校验成功的
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:'请选择二级分类'
          }
        }
      },
      // 商品名称
      proName:{
        validators:{
          notEmpty:{
            message:'请输入商品名称'
          }
        }
      },
      // 请输入商品描述
      proDesc:{
        validators:{
          notEmpty:{
            message:'请输入商品描述'
          }
        }
      },
      // 商品库存要求, 必须是非零开头的数字
      // \d 表示数字
      // * 表示零个或多个
      // + 表示1个或多个
      // ? 表示0个或1个
      // {n} 表示出现 n 次
      num:{
        validators:{
          notEmpty:{
            message:'请输入商品库存'
          },
          regexp:{
            regexp:/^[1-9]\d*$/,
            message:'商品库存要求, 必须是非零开头的数字'
          }
        }
      },
      // 尺码 size
      size:{
        validators:{
          notEmpty:{
            message:'请输入商品尺码'
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:'商品库存要求, 两位数字-两位数字, 例如: 32-40'
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:'请输入原价'
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:'请输入商品现价'
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty:{
            message:'请输入上传3张图片'
          }
        }
      }
    }
  });
  
  //6.注册表单校验成功事件
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    var params = $('#form').serialize();
    params += '&picName1='+picArr[0].picName + '&picAddr1='+picArr[0].picAddr;
    params += '&picName2='+picArr[1].picName + '&picAddr2='+picArr[1].picAddr;
    params += '&picName3='+picArr[2].picName + '&picAddr3='+picArr[2].picAddr;
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:params,
      success:function(info){
        if(info.success){
          $('#addModal').modal('hide');
          $('#form').data('bootstrapValidator').resetForm(true);
          currentPage = 1;
          render();
          // 重置文本
          $('#dropdownText').text('请选择二级分类');
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  });
  
  
})