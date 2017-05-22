var homeModule = angular.module('resdesk.home', ['resdesk.user', 'resdesk.helper']);

homeModule.path = './src/modules/Home/';

homeModule.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('Home', {
      url: '/',
      templateUrl: homeModule.path + "home.html",
      controller: 'HomeController',
      data: {
        name: "Home",
        icon: "home",
        sref: "Home",
        requiresAdmin: false,
        //RequiresLogin is JWT Helper interceptor that performs pre-state validation
        //Because it is on the root url, it applies to all children and no other states require this to be on it
        requiresLogin: true,
        friendlyName: 'Home',
        order: 0
      }
    });

});

homeModule.controller('HomeController', function ($scope, $user) {
  
  $scope.$user = $user;
  
});