define(function(require){
	var app = require("app");
	//require("../ngServices/checkLoginService");
	require("../ngDirectives/cut-pic");
	app.controller("ProfileCtrl",["titleService","$http","FileUploader","checkLoginService","$state",
		function(titleService,$http,FileUploader,checkLoginService,$state){
		titleService.setTitle("个人中心");
		var self = this;
		this.formdata = {};
		//1 - 修改密码还是 0 - 修改个人资料
		this.tabType = 0;
		//改变tab
		this.changeTab = function(num){
			this.tabType = num;
		}
		//检测是否弹出图片上传框
		this.isModal = false;
		this.setModal = function(b){
			this.isModal = b;
			//如果取消打开模态框，则清除数据
				this.uploadImageUrl = "";
				this.v = {"w" : 0 , "h" : 0 , "x" : 0 ,"y" : 0};
				this.msg = "";
				this.status = -1;
			
		}
		//上传图片后，获得的地址
		this.uploadImageUrl = "";
		this.v = {"w" : 0 , "h" : 0 , "x" : 0 ,"y" : 0};
		this.msg = "";//服务器传回的信息
		this.status = -1; //服务器传回的状态 1-成功
		//设置头像路径
		this.setAvatar = function(url){
			this.formdata.avatar = url;
		}
		this.getAvatar = function(){
			return this.formdata.avatar;
		}
		//执行裁剪
		this.doCut = function(){
			$http.get("/cut",{
				"params":{
					w: self.v.w / self.v.ratio,
					h: self.v.h / self.v.ratio,
					x: self.v.x / self.v.ratio,
					y: self.v.y / self.v.ratio,
					url: self.originalPath
				}
			}).then(function(data){
				alert(data.data.msg);
				//设置新头像
				self.formdata.avatar = self.uploadImageUrl + "?" + Date.parse(new Date());//加时间戳，强制重新读取图片，否则会使用未裁剪之前的原图
				console.log("avatar:",self.formdata,"uploadImageUrl:",self.uploadImageUrl);
				self.setModal(false);

			})
		}
		//修改个人信息
		this.doProfile = function(){
			$http.post("/profile",{
				email: self.formdata.email,
				avatar: self.getAvatar(),
				nickname: self.formdata.nickname,
				briefintro: self.formdata.briefintro
			}).then(function(data){
				if(data.data.status && data.data.status == 1){
					alert(data.data.msg);
					$state.go("root.home");
				}
			})
		}
		
		$http.get("/profile").then(function(data){
			console.log("getProfile:",data);
			if(data.data.status && data.data.status == -3){
				$state.go("root.login");
				return;
			}
			self.formdata = data.data;
		})

		//配置文件上传
		this.uploader = new FileUploader({
			url: "/upload",
			filters: [{
				name: 'MIMEFilter',
				fn: function(item){
				//得到文件的MIME类型
				var type = '|' + item.type.slice(item.type.lastIndexOf("/") + 1) + '|';
					return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
				}
			},{
				name: 'sizeFilter',
				fn: function(item){
					return item.size <= 2 * 1024 * 1024;
				}
			}],
			queueLimit: 1,
			autoUpload: true,
			onAfterAddingFile : function(item){
				
			},
			onWhenAddingFileFailed: function(item,filter,options){
				var msg = "";
				switch(filter.name){
					case 'MIMEFilter':
						msg = "请选择图片";
						break;
					case 'sizeFilter':
						msg = "图片大小不能超过2M";
						break;
				}
				alert(msg);
				//清空队列
				self.uploader.clearQueue();
				return;
			},
			onCompleteItem: function(item,response,status,headers){
				//文件上传成功后，再次清空队列，此时可以再次上传
				self.msg = response.msg;
				self.status = response.status;
				if(self.status != 1){
					self.uploader.clearQueue();
					return;
				}
				//原始路径
				self.originalPath = response.file.file.path;
				self.uploadImageUrl = response.file.file.path.slice(response.file.file.path.indexOf("\\uploads\\"));
			
				self.uploader.clearQueue();
			}
		});
	}])
})