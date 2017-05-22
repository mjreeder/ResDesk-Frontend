settingsModule.controller('SettingsController', function ($scope, SettingsAPI, $user, $timeout) {

//  $scope.reminders = API.Reminders.getAll();
  
  $scope.switchHall = $user.getUserInfo().currentHall;
  
  $timeout(function(){
    $('select').material_select();
  }, 10);
  
  $scope.confirmSwitch = function() {
    console.log($scope.switchHall == $user.getUserInfo().currentHall);
    console.log($scope.switchHall);
  };
  
});