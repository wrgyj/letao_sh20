/**
 * Created by 瑞瑞牛肉面 on 2018/5/14.
 */
$(function(){
  
  render()
  function render(){
    var obj = {};
    obj.proName = $('.lt_search input').val();
    obj.page = 1;
    obj.pageSize = 100;
  
    // 还有两个可传可不传的参数 price num
    var $current = $('.lt_sort a.current');
    
    if($current.length > 0){
      var sortName = $current.data('type');
      var sortValue = $current.find('i').hasClass('fa fa-angle-down');
      obj[sortName] = sortValue;
    }
    
    setTimeout(function(){
      $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data: obj,
        success: function(info){
          console.log(info);
          $('.lt_product').html(template('productTpl',info));
        }
      })
    },500)
  
    // 功能1: 页面一进来, 需要渲染一次, 将地址栏参数解析到 input 框中,  proName 来自于 input 框
  }
  
})