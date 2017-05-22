settingsModule.factory('SettingsAPI', function ($http, AppConfig) {

  var factory = {};
  
  var baseUrl = AppConfig.baseUrl + '/settings/';

  factory.getAll = function () {

  };

  return factory;
});