reminderModule.controller('RemindersCreateModal', function ($scope, $MaterialModalClose, ReminderAPI, Helper) {
  // this element
  var thisModal = $('#material-modal');
  
  /**
   * Called by materialize jQuery callback on modal appearance
   * @author Brandon Groff
   */
  var onLoad = function() {
    $scope.newItem = {};
    $scope.newItem.event = {};
    $scope.newItem.event.repeat = false;
  };
  
  /**
   * Called after materialze jQuery callback for modal completion
   * @author Brandon Groff
   */
  var onComplete = function() {
    return $scope.createdItem;
  };
  
  
  /**
   * Close the modal
   * @author Brandon Groff
   */
  $scope.close = function() {
    // Add pre-close content here
    Helper.log($scope.newItem);
    thisModal.modal('close');
  };
  
  /**
   * Submit the form
   * @author Brandon Groff
   */
  $scope.submit = function() {
//    $scope.createdItem = ReminderAPI.create($scope.resident);
    $scope.close();
  };
  
  /**
   * Callback function for directory autocomplete
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function(selectedResident) {
    $scope.resident = selectedResident;
  };
  
  
  
  /* Modal Initilization Block. DO NOT TOUCH */
  

  var init = function () {
    thisModal.modal({
      dismissable: true,
      opacity: .5,
      ready: function (modal, trigger) {
        onLoad();
      },
      complete: function (modal, trigger) {
        $MaterialModalClose(onComplete());
      }
    });

    thisModal.modal('open');
  };
  
  init();
  
  /* End Init Block */


});