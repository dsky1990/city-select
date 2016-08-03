
/**
 * Created by dsky on 16/7/29.
 */
(function () {
  var state = false,
      areaData = null,
      inputName =null;
  if(!state){
    $.get("area.json", function(data){
      areaData = data;
      state = true;
    });
  }
  $.fn.setInputValue = function (v) {
    var $this = this;
    $.get("area.json", function(data){
      var provinceName = null;
      var cityName = null;
      var areaName = null;
      var provinceLen = data.length;
      for(var i=0; i< provinceLen; i++){
        var cityLen = data[i].citys.length;
        for(var j=0; j< cityLen; j++){
          var areaLen = data[i].citys[j].county.length;
          for(var k=0; k< areaLen; k++){
            if(data[i].citys[j].county[k].id == v){
              provinceName = data[i].name;
              cityName = data[i].citys[j].name;
              areaName = data[i].citys[j].county[k].name;
              $($this).val(provinceName + ' - ' + cityName + ' - ' + areaName)
            }
          }
        }
      }
    });
  };
  $(document).on('focus', '.citySelector', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $ele = $(this);
    inputName = $ele.data('hideName');
    citySelect.init(areaData, $ele);
  });
  var citySelect = (function () {
    return {
      pageSize: 12,
      $regionUl: null,
      provinceText: '',
      cityText: '',
      areaText: '',
      areaId: null,
      $prev: null,
      $next: null,
      nextNum: 0,
      prevNum: 0,
      provinceStr: '',
      cityStr: '',
      areaStr: '',
      provinceId: null,
      cityId: null,
      init: function (data, $ele) {
        var $nextEle = $ele.next();
        var _this = this;
        _this.$regionUl = null;
        /*var $par = $ele.parent('.pr');
         var parLeft = $par.offset().left;  //  父位移
         var eleOffset = $ele.offset().left; // 元素位移
         var leftOffset = eleOffset - parLeft; // 相对位移*/
        $('.cityBox').addClass('hide');
        if(!$nextEle.hasClass('cityBox')){
          var templ = '<div class="cityselect cityBox">'+
              '<ul class="city-tabs">'+
              '<li class="tab province-tab curhand selected">省份</li>'+
              '<li class="tab city-tab">城市</li>'+
              '<li class="tab area-tab">区县 </li></ul>'+
              '<div class="city-regions">'+
              '<i class="prev cursor_p disabled"><<</i>'+
              '<i class="next cursor_p disabled">>></i>'+
              '<ul class="city-regions-box"></ul></div><div>';
          $ele.after(templ);
          $ele.data('inputAdd', false);
        }
        // 初始化元素
        $nextEle = $ele.next('.cityBox');
        _this.$prev = $nextEle.find('.city-regions .prev');
        _this.$next = $nextEle.find('.city-regions .next');
        _this.$regionUl = $nextEle.find('.city-regions-box');
//        $nextEle.css('left', leftOffset);
        $nextEle.find('.tab').first().addClass('curhand selected').siblings('.tab').removeClass('selected curhand');
        _this.hideEvent();
        $nextEle.removeClass('hide');
        _this.getProvince(data, $ele);
        _this.clickTab(data, $ele);
      },
      hideEvent: function () {
        $(document).off('click').on('click', function (e) {
          if(!$(e.target).hasClass('citySelector') && !$(e.target).parents('div').hasClass('cityBox') && !$(e.target).hasClass('cityBox')){
            $('.cityBox').addClass('hide');
          }
        })
      },
      getProvince: function (data, $ele) { // 获取省份数据
        var _this = this;
        var provinceLen = data.length;
        var provincePage = Math.ceil(provinceLen / _this.pageSize);
        _this.setPageDefault(provincePage);
        _this.$regionUl.html('');
        _this.provinceStr = '';
        for(var i=0; i< provinceLen; i++){
          var $li = '<li class="city-region province-list" data-province="'+ i +'">'+ data[i].name +'</li>';
          _this.provinceStr += $li;
        }
        _this.$regionUl.html(_this.provinceStr);
        _this.getCity(data, $ele);
        _this.$next.off('click');
        _this.clickNext(provincePage);
      },
      getCity: function (data, $ele) { // 获取市级数据
        var _this = this;
        _this.$regionUl.find('.province-list').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          _this.$regionUl.html('');
          _this.cityStr = '';
          var $this = $(this);
          _this.provinceId = $this.data('province');
          _this.provinceText = $this.text();
          _this.setCity(data, $ele);
        });
      },
      setCity: function (data, $ele) {
        var _this = this,
            provinceId = _this.provinceId;
        var cityLen = data[provinceId].citys.length;
        var cityPage = Math.ceil(cityLen / _this.pageSize);
        _this.setPageDefault(cityPage);
        for(var i=0; i< cityLen; i++){
          var $li = '<li class="city-region city-list" data-city="'+ i +'">'+ data[provinceId].citys[i].name +'</li>';
          _this.cityStr += $li;
        }
        _this.$regionUl.html(_this.cityStr);
        _this.getArea(data, $ele);
        _this.$next.off('click');
        _this.clickNext(cityPage);
        $ele.next('.cityBox').find('.city-tab').addClass('curhand selected').siblings('.tab').removeClass('selected');
      },
      getArea: function (data, $ele) { // 获取区级数据
        var _this = this;
        _this.$regionUl.find('.city-list').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          _this.$regionUl.html('');
          _this.areaStr = '';
          var $this = $(this);
          _this.cityId = $this.data('city');
          _this.cityText = $this.text();
          _this.setArea(data, $ele);
        });
      },
      setArea: function (data, $ele) {
        var _this = this;
        var provinceId = _this.provinceId;
        var cityId = _this.cityId;
        var areaLen = data[provinceId].citys[cityId].county.length;
        var areaPage = Math.ceil(areaLen / _this.pageSize);
        _this.setPageDefault(areaPage);
        for(var i=0; i< areaLen; i++){
          var $li = '<li class="city-region area-list" data-area="'+ i +'" data-id="'+ data[provinceId].citys[cityId].county[i].id +'">'+ data[provinceId].citys[cityId].county[i].name +'</li>';
          _this.areaStr += $li;
        }
        _this.$regionUl.html(_this.areaStr);
        _this.$next.off('click');
        _this.clickNext(areaPage);
        _this.setValue($ele);
        $ele.next('.cityBox').find('.area-tab').addClass('curhand selected').siblings('.tab').removeClass('selected');
      },
      setValue: function ($ele) { // 返回数据
        var _this = this;
        var linkStr = ' - ';
        _this.$regionUl.find('.area-list').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var areaText = $(this).text();
          _this.areaId = $(this).data('id');
          var result = _this.provinceText + linkStr + _this.cityText + linkStr + areaText;
          $ele.val(result);
          $ele.prev('input').val();
          $ele.next().addClass('hide');
          var $input = '<input type="hidden" name="'+inputName+'" value="'+_this.areaId+'">';
          var inputAdd = $ele.data('inputAdd');
          if(!inputAdd){
            $ele.before($input);
            $ele.data('inputAdd', true);
          }else {
            $ele.prev('input').val(_this.areaId);
          }
        })
      },
      clickPrev: function (page) { // 上一页点击
        var _this = this;
        _this.$prev.off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if($(e.target).hasClass('disabled')){
            return false;
          }else {
            _this.$next.removeClass('disabled').addClass('curhand');
            ++_this.nextNum;
            --_this.prevNum;
            if(_this.prevNum === 0){
              _this.$prev.removeClass('curhand').addClass('disabled');
            }
            _this.$regionUl.find('.city-region').slice(( _this.prevNum)*_this.pageSize,(page - _this.prevNum)*_this.pageSize).removeClass('hide');
          }
        })
      },
      clickNext: function (pageLen) { // 下一页点击
        var _this = this;
        _this.nextNum = pageLen;
        _this.$next.off('click').on('click' ,function (e) {
          e.preventDefault();
          e.stopPropagation();
          var page = pageLen;
          if($(e.target).hasClass('disabled') || _this.nextNum === 1){
            return false;
          }else {
            _this.$prev.removeClass('disabled').addClass('curhand');
            --_this.nextNum;
            ++_this.prevNum;
            if(_this.nextNum === 1){
              _this.$next.removeClass('curhand').addClass('disabled');
            }
            _this.$regionUl.find('.city-region').slice(0,(page - _this.nextNum)*_this.pageSize).addClass('hide');
          }
        });
        _this.clickPrev(pageLen);
      },
      setPageDefault: function(pageLen){
        var _this = this;
        _this.nextNum = 0;
        _this.prevNum = 0;
        _this.$next.removeClass('curhand').addClass('disabled');
        _this.$prev.removeClass('curhand').addClass('disabled');
        if(pageLen > 1){
          _this.$next.removeClass('disabled').addClass('curhand');
        }
      },
      clickTab: function (data, $ele) { // tab点击
        var _this = this;
        $ele.next('.cityBox').find('.tab').off('click').on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var $this = $(this);
          if($this.hasClass('curhand')){
            $this.addClass('selected').siblings('.tab').removeClass('selected');
            var $index = $this.index();
            switch ($index){
              case 0:
                _this.$regionUl.html(_this.provinceStr);
                _this.getCity(data, $ele);
                break;
              case 1:
                _this.$regionUl.html(_this.cityStr);
                _this.getArea(data, $ele);
                break;
              case 2:
                _this.$regionUl.html(_this.areaStr);
                _this.setValue($ele);
                break;
                // default
            }
          }
        });
      }
    }
  }());
}());