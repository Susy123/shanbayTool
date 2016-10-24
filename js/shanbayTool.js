//注入页面的脚本文件
;
$(function() {

	var weedOut = {
		_currNum : 1,
		_viewHeight : 500,//TODO 视窗大小
		_maxPageNum : 1,
		clear: function() {
			console.log('Clear Start');
			// 配置需要隐藏的类名，只要是同样的布局即可实现功能
			var className = [
				'top-banner-ad-container',
				'sticky-top-banner-ad',// ad
				'l-header u-cf js-header',// header
				'content__labels content__labels--not-immersive',
				'byline',
				'content__meta-container js-content-meta js-football-meta u-cf',
				'content__secondary-column js-secondary-column',
				'element-rich-link',
				'element element-rich-link element--thumbnail element-rich-link--upgraded',
				'submeta',
				'content-footer',
				'l-footer u-cf'
			];

			for (var i = 0; i < className.length; i++) {
				var classStr = className[i].split(' ').join('.');
				// 使用remove删除节点，提升性能
				$('.' + classStr).remove();
			}
		},
		// 进阶版移除内容，以匹配更多的网页
		clear2: function() {
			//TODO 思考下更好的规律算法
			var tagName=[
				'header',
				'footer',
				'aside'
			];
		},
		init: function() {
			this.clear();
			this.clear2();
		},
		autoPage: function(){
			var _self = this;
			_self._viewHeight = window.innerHeight - 50;
			console.log('_viewHeight:',_self._viewHeight)
			_self._maxPageNum = Math.ceil($('#article').height() / _self._viewHeight);
			console.log('_maxPageNum:',_self._maxPageNum);

			if($('#page-button')){
				$('#page-button').remove();
			}
			$('#article').parent().after('<div id="page-button"></div>');
			var articleParentHeight = _self._viewHeight + 'px';
			console.log('articleParentHeight:',articleParentHeight);
			$('#article').parent().css({'height':articleParentHeight,'overflow':'hidden'});//TODO overflow hidden

			$('#page-button').append('<button id="pre-page">上一页</button>\
				<select id="select-page"></select><button id="next-page">下一页</button>');

			var optionStr = _self.genOptions();

			$('#select-page').append(optionStr);

			$('#pre-page').css('opacity',0.5);
			if(_self._maxPageNum==1){
				$('#next-page').css('opacity',0.5);
			}

			$('#pre-page').click(function(){				
				if(_self._currNum<=1){
					return;
				}
				
				_self._currNum = _self._currNum - 1;
				_self.go2Page(_self._currNum);	
						
			});
			$('#next-page').click(function(){
				if(_self._currNum>=_self._maxPageNum){
					return;
				}
				
				_self._currNum = _self._currNum + 1;
				_self.go2Page(_self._currNum);
				
			});

			$("#select-page").change(function () {
				_self._currNum = Number($('#select-page').val());
				_self.go2Page(_self._currNum);
			});

		},
		genOptions:function(){
			var _self = this;
			var optionStr = '';
			for (var i=1;i<=_self._maxPageNum;i++){
				optionStr = optionStr + '<option value='+i+'>第'+i+'页</option>';
			}
			return optionStr;
		},
		go2Page:function(pageNum){
			var _self = this;
			pageNum = pageNum>_self._maxPageNum?_self._maxPageNum:pageNum;
			var marginNum = (1-pageNum) * _self._viewHeight; 
			var marginStr = marginNum + 'px';
			$('#article').animate({'marginTop':marginStr});
			// 第几页选中
			$('#select-page').val(pageNum);
			if(_self._currNum==1){
					$('#pre-page').css('opacity',0.5);
				}
				else{
					$('#pre-page').css('opacity',1);
				}
			if(_self._currNum==_self._maxPageNum){
					$('#next-page').css('opacity',0.5);
				}
				else{
					$('#next-page').css('opacity',1);
				}
		}
	}

	
	/*$(document).ready(function() {
		
	});*/

	weedOut.init();
	// 为防止有异步延时加载的内容，过4s再清除一次
	setTimeout(function() {
		weedOut.init();
	}, 4000);
	weedOut.autoPage();
	window.addEventListener("resize", function(event) {
        // 窗口resize时从新计算高度
        weedOut.autoPage();
		weedOut.go2Page(weedOut._currNum);
    });
})