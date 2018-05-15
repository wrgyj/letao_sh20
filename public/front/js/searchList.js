/**
 * Created by 瑞瑞牛肉面 on 2018/5/14.
 */
$(function(){
  // 功能1: 页面一进来, 需要渲染一次, 将地址栏参数解析到 input 框中,  proName 来自于 input 框
  var key = getSearch('key');
  $('.lt_search input').val(key);
  // render();
  
  var currentPage = 1;
  var pageSize = 2;
  
  function render(callback){
    // $('.lt_product').html('<div class="loading"></div>');
    
    var obj = {};
    obj.proName = $('.lt_search input').val();
    obj.page = currentPage;
    obj.pageSize = pageSize;
  
    // 还有两个可传可不传的参数 price num
    var $current = $('.lt_sort a.current');
    
    if($current.length > 0){
      var sortName = $current.data('type');
      var sortValue = $current.find('i').hasClass('fa-angle-down')? 2 : 1;
      obj[sortName] = sortValue;
    }
    // console.log(obj);
    
  
    setTimeout(function(){
      $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data: obj,
        success: function(info){
          // console.log(info);
          // $('.lt_product').html(template('productTpl',info));
          callback(info);
        }
      })
    },500)
  }
  
  // 配置了下拉刷新
  // 1. 下拉刷新初始化
  // 2. 配置回调函数, 在下拉刷新时, 进行 ajax 请求, 渲染页面 => render()
  // 3. 渲染完页面, 关闭正在刷新中的状态
  mui.init({
    pullRefresh: {
      // 指定区域滚动容器作为下拉刷新的容器
      container: '.mui-scroll-wrapper',
      down: {
        // 表示一进入页面, 就进行一次下拉刷新
        auto: true,
        callback : function(){
          // 下拉刷新, 请求第一页的数据
          currentPage = 1;
          // 下拉刷新的回调函数, 想要实现刷新内容, 应该通过 ajax 发送请求, 获取最新数据, 进行页面渲染
          render(function(info){
            $('.lt_product').html(template('productTpl',info));
  
            // 需要在 ajax 请求回来最新数据, 渲染完页面之后, 需要关闭下拉刷新中的状态
            // mui('.mui-scroll-wrapper').pullRefresh() 可以生成下拉刷新实例
            // 注意天坑: 文档中, 还没有更新方法, 需要先通过 pullRefresh() 生成实例
            // 通过 endPulldownToRefresh() 进行关闭我们的下拉刷新状态
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            // 下拉刷新完成后, 因为进行了重新渲染, 需要重新启用上拉加载功能
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        }
      },
      up:{
        auto: false,
        callback: function(){
          currentPage++;
          render(function(info){
            if(info.data.length > 0){
              // 将数据追加到页面的最后面
              $('.lt_product').append(template('productTpl',info));
              // 数据追加完成之后, 需要关闭正在加载的提示, 通过 endPullupToRefresh() 关闭正在加载中
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }else{
              // 不需要追加, 而且要提示用户, 没有更多数据了,
              // 配置参数 为 true 可以显示 没有更多数据的提示, 也会默认禁用上拉加载更多
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            }
          });
        }
      }
    }
  })

  // 功能2: 点击搜索按钮, 需要渲染一次, 并持久化到历史记录中
  $('.lt_search button').click(function(){
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    
    // 搜索关键字
    var key = $('.lt_search input').val();
    var history = localStorage.getItem('search_list') || '[]';
    var arr = JSON.parse(history);
    // 如果有重复的删除
    var index = arr.indexOf(key);
    if(index > -1){
      arr.splice(index, 1);
    }
    // 如果超过 10个, 删除最后一个
    if(arr.length >= 10){
      arr.pop();
    }
    
    arr.unshift(key);
    
    localStorage.setItem('search_list',JSON.stringify(arr));
  })
  
  
  // 功能3: 点击排序按钮, 进行排序
  // (1) 给所有需要添加排序功能的按钮, 添加点击事件
  // (2) 如果当前的 a 标签, 有 current, 只需要切换箭头方向即可
  //     如果当前的 a 标签, 没有 current类, 让当前的添加 current, 其他的移除 current 类
  $('.lt_sort a[data-type]').on('tap',function(){
    if($(this).hasClass('current')){
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    }else{
      $(this).addClass('current').siblings().removeClass('current');
      $(this).siblings().find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
    }
  
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })
})