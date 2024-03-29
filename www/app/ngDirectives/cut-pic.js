define(function(require){
	var app = require("app");
	require("jquery");
	app.directive("cutPic",[function(){
		return {
			"restrict" : "E",
			"templateUrl" : "./app/ngDirectives/cut-pic.html",
			"scope" : {
				"img" 		: "@",
				"v" 		: "=",
				"maxwidth"  : "@",
				"maxheight"  : "@"
			},
			"link" : function($scope,ele){
				//第一个业务，当图片加载完毕之后让大图盒子和图片一样宽度、高度
				//图片已经限制了max-width、max-height
				var $bigimg = $(ele).find(".bigimg");
				var $bigbox = $(ele).find(".bigbox");
				var $cutimg = $(ele).find(".cutimg");

				var bigimgW;		//左边待裁切图片的宽度
				var bigimgH;		//左边待裁切图片的高度

			
				//接受变量
				var cutObj = $scope["v"];
				cutObj.w = 100;
				cutObj.h = 100;
				cutObj.x = 0;
				cutObj.y = 0;

				//图片加载完毕之后做的事情
				$bigimg.bind("load",function(){
					bigimgW =  $bigimg.width();
					bigimgH =  $bigimg.height();

					//图片的原始宽度、高度
					var realWidth = $(ele).find(".bigimg2").width();
					var realHeight = $(ele).find(".bigimg2").height();

					//计算比例，将结果写在cutObj中
					cutObj.ratio = bigimgW / realWidth;
	
					//得到大图应该有的宽度和高度，被css的max-width和max-height限制了
					$bigbox.css({
						"width" : bigimgW,
						"height" : bigimgH
					});
					//让cutimg宽度高度，和图片一致
					$cutimg.css({
						"width": bigimgW,
						"height" : bigimgH
					});
				});



				//拖拽
				var $cut = $(ele).find(".cut");

				$cut.draggable({
					"containment" : $bigbox,
					"drag" : function(event,ui){
						//拖拽的时候做的事情
						cutObj.x = ui.position.left;
						cutObj.y = ui.position.top;

						//让cut里面的cutimg随着拖拽来移动，制作出“亮”了一块的感觉！
						$cutimg.css({
							"left": -cutObj.x,
							"top" : -cutObj.y
						});

						//命令设置3个预览框
						setPreviewBoxImage($(ele).find(".previewLbox"),100,100);
						setPreviewBoxImage($(ele).find(".previewMbox"),70,70);
						setPreviewBoxImage($(ele).find(".previewSbox"),40,40);

					}
				}).resizable({
					"aspectRatio" : 1 / 1,
					"containment" : $bigbox,
					"resize" : function(event,ui){
						//改变尺寸的时候做的事情
						cutObj.w = ui.size.width;
						cutObj.h = ui.size.height;

						//命令设置3个预览框
						setPreviewBoxImage($(ele).find(".previewLbox"),100,100);
						setPreviewBoxImage($(ele).find(".previewMbox"),70,70);
						setPreviewBoxImage($(ele).find(".previewSbox"),40,40);
					}
				});


				function setPreviewBoxImage($boxele,boxwidth,boxheight){
					var w = bigimgW / cutObj.w *  boxwidth;
					var h = bigimgH / cutObj.h *  boxheight;
					var x = cutObj.x * boxwidth / cutObj.w;
					var y = cutObj.y * boxheight / cutObj.h;

					$boxele.find("img").css({
						"width"  : w,
						"height" : h,
						"left"   : -x,
						"top"    : -y
					});
				}
			}
		}
	}]);
})