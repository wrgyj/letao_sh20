/**
 * Created by 瑞瑞牛肉面 on 2018/5/12.
 */

$(function(){
  // 区域滚动初始化
  mui('.mui-scroll-wrapper').scroll({
    // 是否显示滚动条
    indicators: false,
  });
  
  //获得slider插件对象, mui('选择器') 可以生成一个 mui 实例对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:1000 //自动轮播周期，若为0则不自动播放，默认为0；
  });
  
  
})


// 作用: 根据传入的key值, 解析地址栏参数, 获取对应的value值
function getSearch(key){
  // 获取地址栏参数  "?name=pp&age=18&desc=%E5%B8%85"
  var search = location.search;
  search = decodeURI(search);
  search = search.slice(1);
  var arr = search.split('&');
  var obj = [];
  
  arr.forEach(function(e, i){
    var k = e.split('=')[0];
    var v = e.split('=')[1];
    obj[k] = v;
  });
  
  return obj[key];
}