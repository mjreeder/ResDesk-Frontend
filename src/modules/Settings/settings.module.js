var settingsModule = angular.module('resdesk.settings', ['resdesk.config', 'resdesk.helper', 'resdesk.user']);

settingsModule.path = './src/modules/Settings/';

settingsModule.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $stateProvider
    .state('Settings', {
      url: "/settings",
      templateUrl: settingsModule.path + "settings.html",
      controller: 'SettingsController',
      data: {
        name: "Settings",
        icon: null,
        sref: "Settings",
        requiresAdmin: false,
        friendlyName: 'Settings',
        excludeSidenav: true,
        order: null
      }

    });

});