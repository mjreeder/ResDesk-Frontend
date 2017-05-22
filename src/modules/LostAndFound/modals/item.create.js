/**
 * @memberof resdesk.lostandfound
 * @ngdoc controller
 * @name LostAndFoundNewItemModal
 * @description Controller for main Lost and Found view
 * @param {service} $scope      Angular service
 * @param {service} $MaterialModalClose $MaterialModal passed service to close this modal
 * @param {factory} LostAndFoundAPI  factory of lost and found API endpoint functions
 * @param {factory} $MaterialToast      Toast notificaiton service from ResDesj.toast
 * @param {service} EmailAPI  ResDesk Email API
 * @author Brandon Groff
 */
lostandfoundModule.controller('LostAndFoundNewItemModal', function ($scope, $MaterialModalClose, LostAndFoundAPI, $MaterialToast, EmailAPI) {
  
  /**
   * @private
   * @type {object}
   * @memberof LostAndFoundNewItemModal
   * @description 
   *  this modal jQuery element
   */
  var thisModal = $('#material-modal');

  /**
   * @private
   * @type {object}
   * @memberof LostAndFoundNewItemModal
   * @description 
   *  Initialization of the form input object
   */
  $scope.newItem = {
    'item': undefined,
    'resident': undefined,
    'comments': undefined
  };

  /**
   * @private
   * @type {boolean}
   * @memberof LostAndFoundNewItemModal
   * @description 
   *  is there an active network request. Controls the loading indicator visiblity
   */
  $scope.loading = false;

  /**
   * @private
   * @type {object}
   * @memberof LostAndFoundNewItemModal
   * @default null
   * @description 
   *  the item created by the form/request
   */
  $scope.createdItem = null;
  
  /**
   * Called by materialize jQuery callback on modal appearance
   * @private
   * @memberOf LostAndFoundNewItemModal
   * @author Brandon Groff
   */
  var onLoad = function () {

  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberOf LostAndFoundNewItemModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal without performing any actions
   * @memberOf LostAndFoundNewItemModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here

    thisModal.modal('close');
  };

  /**
   * Create the lost and found item, closes modal on success
   * @memberOf LostAndFoundNewItemModal
   * @author Brandon Groff
   */
  $scope.create = function () {
    
    $scope.loading = true;
    
    LostAndFoundAPI.createItem($scope.newItem.item,
        $scope.newItem.resident,
        $scope.newItem.comments)
      .then(function (response) {
        $MaterialToast.showToast("Item created");

        $scope.createdItem = response.data.data;

        if ($scope.createdItem.email) {
          var message = LostAndFoundAPI.createEmailMessageFromItem($scope.createdItem);

          EmailAPI.sendEmails($scope.createdItem.email,
            'Missing Personal Item',
            message,
            'LostAndFound').then(function (response) {
            $scope.loading = false;
            $scope.close();
            
          }, function (error) {
            $scope.loading = false;
          });
          
          
        } else {
          $scope.loading = false;
          $scope.close();
        }



      }, function (error) {
        $scope.loading = false;
        
        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError("An error occurred creating the item");
        }
      });

  };

  /**
   * Callback function for directory autocomplete
   * @memberOf LostAndFoundNewItemModal
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function (selectedResident) {
    $scope.newItem.resident = selectedResident;
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