define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');
 
    require('angular-ui-router');
    require('angularfileupload');
 
    var app = angular.module('app', ['ui.router','angularFileUpload']);

    app.controller("MainCtrl",["titleService",function(titleService){
    	this.getTitle = function(){
    		return titleService.getTitle();
    	}
    }]);

    app.factory("titleService",[function(){
    	var title = "";
    	return {
    		getTitle: function(){
    			return title;
    		},
    		setTitle: function(name){
    			title = name;
    		}
    	}
    }])
 
    // initialze app module for angular-async-loader
    asyncLoader.configure(app);
 
    module.exports = app;
});