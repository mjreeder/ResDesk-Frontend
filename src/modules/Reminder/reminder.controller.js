reminderModule.controller('RemindersController', function ($scope, ReminderAPI, $MaterialModal) {

  $scope.reminders = ReminderAPI.getAll();
  
  $scope.create = function () {

    //TODO: Change template and controller
    $MaterialModal.showModal({
      templateUrl: reminderModule.path + "modals/reminder.create.html",
      controller: "RemindersCreateModal"
    }).then(function(modal) {
      modal.close.then(function(result) {
        $scope.modalResult = result;
      });
    });
    
  };
  
  $scope.edit = function (reminder) {

    //TODO: Change template and controller
    $MaterialModal.showModal({
      templateUrl: reminderModule.path + "modals/reminder.edit.html",
      controller: "RemindersEditModal",
      passData: reminder
    }).then(function(modal) {
      modal.close.then(function(result) {
        $scope.modalResult = result;
      });
    });
    
  };
  
});