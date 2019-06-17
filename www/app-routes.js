define(function (require) {
    var app = require('./app');
 
    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
 
        $stateProvider
            .state('root', {
                templateUrl: './app/root/root.html',
                // new attribute for ajax load controller
                controllerUrl: './app/root/RootCtrl',
                controller: 'RootCtrl as rootCtrl'
            })
            .state('root.home',{
                url: '/home',
                templateUrl: './app/home/home.html',
                controllerUrl: './app/home/HomeCtrl',
                controller: 'HomeCtrl as homeCtrl'
            })
            .state('root.regist',{
                url: '/regist',
                templateUrl: './app/regist/regist.html',
                controllerUrl: './app/regist/registCtrl',
                controller: 'RegistCtrl as registCtrl'
            })
            .state('root.login',{
                url: '/login',
                templateUrl: './app/login/login.html',
                controllerUrl: './app/login/loginCtrl',
                controller: 'LoginCtrl as loginCtrl'
            })
            .state('root.profile',{
                url: '/profile',
                templateUrl: './app/profile/profile.html',
                controllerUrl: './app/profile/ProfileCtrl',
                controller: 'ProfileCtrl as profileCtrl'
            })
    }]);
});