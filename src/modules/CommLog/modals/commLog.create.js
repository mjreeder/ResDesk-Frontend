commModule.controller('CommLogCreateModal', function ($scope, $MaterialModalClose, CommLogAPI, $MaterialToast) {
  // this element
  var thisModal = $('#material-modal');
  $scope.newItem = {
    title: undefined,
    to: [undefined],
    body: undefined
  };
  

  /**
   * Called by materialize jQuery callback on modal appearance
   * @author Brandon Groff
   */
  var onLoad = function () {

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
    if ($scope.newItemForm.$invalid) {
      $MaterialToast.showWarning('The create form is incomplete');
      return;
    }
    
    //if last item is undefined, remove it
    var lastIndex = $scope.newItem.to.length - 1;
    if ($scope.newItem.to[lastIndex] == undefined){
      $scope.newItem.to.splice(lastIndex, 1);
    }
    
    $scope.createdItem = CommLogAPI.createMessage($scope.newItem.title,
                                                 $scope.newItem.body,
                                                 $scope.newItem.to)
      .then(function (response) {
        $MaterialToast.showToast(response.data.description);
      }).catch(function (error) {
        console.error(error);
        if (error.data){
          $MaterialToast.showError(error.data.message);
        } else {
          $MaterialToast.showError('An error occurred sending the message');
        }
      });
    $scope.close();
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
