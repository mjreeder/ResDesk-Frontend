commModule.controller('CommLogEditModal', function ($scope, $MaterialModalClose, CommLogAPI, $MaterialToast) {
  // this element
  var thisModal = $('#material-modal');

  /**
   * Called by materialize jQuery callback on modal appearance
   * @author Brandon Groff
   */
  var onLoad = function () {
    if (!$scope.givenData) {
      $MaterialToast.showToast('An error occured opening the message editor.');
      $scope.close();
    }

    $scope.newItem = {
      title: angular.copy($scope.givenData.title),
      to: angular.copy($scope.givenData.to),
      message: angular.copy($scope.givenData.body)
    };

    $scope.$digest();
  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @author Brandon Groff
   */
  $scope.submit = function () {
    var data = {
      to: $scope.newItem.to,
      title: $scope.newItem.title,
      body: $scope.newItem.message
    };
    
    $scope.createdItem = CommLogAPI.updateMessage($scope.givenData.id, data)
      .then(function (response) {
        $MaterialToast.showToast(response.data.description);
        $scope.close();
      }).catch(function (error) {
        console.error(error);
        if (error.data){
          $MaterialToast.showError(error.data.message);
        } else {
          $MaterialToast.showError('An error occurred sending the message');
        }
      });

  };

  /**
   * Callback function for directory autocomplete
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function (selectedResident) {
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
