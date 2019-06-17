define(function(require){
	var app = require("app");
	var $ = require("jquery");
	require("../ngDirectives/carousel.js");
	app.controller("HomeCtrl",["titleService",function(titleService){
		titleService.setTitle("首页");
		this.idx = 0;
		this.lists = ["/images/banner1.jpeg","/images/banner2.jpeg","/images/banner3.jpeg","/images/banner4.jpeg","/images/banner5.jpeg"];
		
	}])
})