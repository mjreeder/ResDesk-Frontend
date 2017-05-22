/**
 * @memberof resdesk.lostandfound
 * @ngdoc controller
 * @name LostAndFoundUpdateItemModal
 * @description Controller for main Lost and Found view
 * @param {service} $scope      Angular service
 * @param {service} $MaterialModalClose $MaterialModal passed service to close this modal
 * @param {factory} LostAndFoundAPI  factory of lost and found API endpoint functions
 * @param {factory} $MaterialToast      Toast notificaiton service from ResDesk.toast
 * @param {factory} DirectoryAPI      ResDesk directory API
 * @param {service} EmailAPI  ResDesk Email API
 * @param {service} $templateRequest Angular service
 * @param {service} $compile Angular service
 * @author Brandon Groff
 */
lostandfoundModule.controller('LostAndFoundUpdateItemModal', function ($scope, $MaterialModalClose, LostAndFoundAPI, $MaterialToast, DirectoryAPI, EmailAPI, $templateRequest, $compile) {

  /**
   * @private
   * @type {object}
   * @memberof LostAndFoundUpdateItemModal
   * @description 
   *  this modal jQuery element
   */
  var thisModal = $('#material-modal');

  //passed data is recieved at $scope.givenData

  /**
   * @type {object}
   * @memberof LostAndFoundUpdateItemModal
   * @description 
   *  the editable item
   */
  $scope.item;

  /**
   * @type {object}
   * @memberof LostAndFoundUpdateItemModal
   * @description 
   *  is there a network request in progress, controls loading indicator
   */
  $scope.loading = false;

  /**
   * @type {object}
   * @memberof LostAndFoundUpdateItemModal
   * @description 
   *  the original item, before edits
   */
  $scope.originalItem;

  /**
   * @type {object|null}
   * @memberof LostAndFoundUpdateItemModal
   * @description 
   *  the updated item, set from update request's response
   */
  $scope.updatedItem = null;

  /**
   * Called by materialize jQuery callback on modal appearance. Triggers initial load of
   * the selected load and found object
   * @author Brandon Groff
   * @memberof LostAndFoundUpdateItemModal
   */
  var onLoad = function () {
    $scope.loading = true;
    LostAndFoundAPI.getById($scope.givenData.id)
      .then(function (response) {

        $scope.item = LostAndFoundAPI.parseItemTimesToMoment(response.data.data);
        $scope.originalItem = angular.copy($scope.item);

        if ($scope.item.email) {
          DirectoryAPI.advancedSearch({
            email: $scope.item.email
          }).then(function (response) {

            var found = DirectoryAPI.parseResponse(response);
            if (found.length != 1) {
              $MaterialToast.showError("More than one student with email " + $scope.item.email + " was found.");
              $scope.close();
            } else {
              $scope.item.resident = found[0];
              $scope.originalItem = angular.copy($scope.item);
            }

          }).catch(function (error) {
            if (error.data && error.data.description) {
              $MaterialToast.showError(error.data.description);
            } else {
              $MaterialToast.showError('An error occured loading the emailed user');
            }
          }).finally(function () {
            $scope.loading = false;
          });
        } else {
          $scope.loading = false;
        }

      }).catch(function (error) {

        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError('An error occured loading the selected item');
        }

        $scope.close();
        $scope.loading = false;
      });

  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberof LostAndFoundUpdateItemModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.updatedItem;
  };


  /**
   * Close the modal without performing any actions
   * @memberOf LostAndFoundUpdateModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Callback function for directory autocomplete
   * @memberOf LostAndFoundUpdateModal
   * @author Brandon Groff
   * @param {Object} selectedResident the autocomplete selected resident
   */
  $scope.selectResident = function (selectedResident) {
    if (typeof ($scope.item.resident) == "string") {
      $scope.item.resident = selectedResident;
    } else {
      $scope.item.resident = selectedResident;
    }
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


  //watch the form variable for changes to enable/disable Update button
  $scope.$watch('item', function (newValue, oldValue) {
    if (newValue != oldValue) {
      //Ensure that null == empty string
      if ($scope.originalItem.comments === null && newValue.comments === "") {
        newValue.comments = null;
      }

      $scope.dataHasChanged = !angular.equals($scope.item, $scope.originalItem);


    }
  }, true);


  /**
   * ng-Click handler to update the current item
   * @memberOf LostAndFoundUpdateModal
   * @author Brandon Groff
   */
  $scope.update = function () {
    $scope.loading = true;
    LostAndFoundAPI.updateItem($scope.item)
      .then(function (response) {
        $scope.updatedItem = LostAndFoundAPI.parseItemTimesToMoment(response.data.data);

        $MaterialToast.showToast("Item '" + $scope.updatedItem.item + "' updated.");

        if ($scope.updatedItem.email &&
          $scope.updatedItem.email != $scope.originalItem.resident.email) {
          //send a new email

          var message = LostAndFoundAPI.createEmailMessageFromItem($scope.updatedItem);

          EmailAPI.sendEmails($scope.updatedItem.email,
            'Missing Personal Item',
            message,
            'LostAndFound').then(function (response) {
            $scope.loading = false;
            $scope.close();

          }, function (error) {
            $scope.loading = false;
            $scope.close();
          });

        } else {
          $scope.loading = false;
          $scope.close();
        }

      }).catch(function (error) {
        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError('An error occured updating the item');
        }
        $scope.loading = false;
      });

  };

  /**
   * ng-Click handler to delete the current item
   * @memberOf LostAndFoundUpdateModal
   * @author Brandon Groff
   */
  $scope.deleteItem = function () {
    if (confirm("Are you sure you want to delete this entry?")) {
      $scope.loading = true;
      LostAndFoundAPI.deleteItem($scope.item.id)
        .then(function (response) {

          $scope.updatedItem = LostAndFoundAPI.parseItemTimesToMoment(response.data.data);

          $MaterialToast.showToast("Item '" + $scope.updatedItem.item + "' deleted.");

        }).catch(function (error) {
          if (error.data && error.data.description) {
            $MaterialToast.showError(error.data.description);
          } else {
            $MaterialToast.showError('An error occured deleting the item');
          }
        }).finally(function () {
          $scope.loading = false;
          $scope.close();
        });

    }

  };

  /**
   * @private
   * @type {object|undefined}
   * @memberof LostAndFoundUpdateItemModal
   * @description 
   *  an instance of markRequestAsFound request (if an active request is in progress)
   */
  var foundRequest = undefined;

  /**
   * Send the request to mark the item as found
   * @author Brandon Groff
   * @private
   * @memberof LostAndFoundUpdateItemModal
   * @param {string|object} returnedTo the person /description of who the item was returned to
   */
  var markFoundRequest = function (returnedTo) {
    if (foundRequest) {
      //request already in progress
      return;
    }

    foundRequest = LostAndFoundAPI.markAsFound($scope.item.id, returnedTo)
      .then(function (response) {

        $scope.updatedItem = LostAndFoundAPI.parseItemTimesToMoment(response.data.data);

        $MaterialToast.showToast("Item '" + $scope.updatedItem.item + "' marked as found.");
        $scope.close();
      }).catch(function (error) {
        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError('An error occured marking the item as found');
        }
      }).finally(function () {
        foundRequest = undefined;
        $scope.loading = false;
      });
  };

  /**
   * ng-Click handler to mark the current item as found. Opens up a footer modal
   * @memberof LostAndFoundUpdateItemModal
   * @author Brandon Groff
   */
  $scope.markFound = function () {

    $templateRequest(lostandfoundModule.path + "modals/markfound/item.markFound.html")
      .then(function (html) {
        var template = angular.element(html);
        $('body').append(template);
        $compile(template)($scope);

        var footerModal = $('#footer-modal');

        footerModal.modal({
          dismissable: false,
          inDuration: 200,
          outDuration: 200,
          complete: function () {
            //note: this triggers twice for some reason
            if ($scope.markFoundModal.cancelled) {
              return;
            }
            markFoundRequest($scope.markFoundModal.returnedTo);
            footerModal.remove();
          }
        });
        footerModal.modal('open');

        $('#footer-modal input.focus-first').focus();
      });


  };

  /**
   * Custom object for the footer modal scope to access/use
   * @author Brandon Groff
   * @type {object}
   * @memberof LostAndFoundUpdateItemModal
   */
  $scope.markFoundModal = {
    /**
     * submit the returnedBy form
     * @author Brandon Groff
     */
    submit: function () {
      if ($scope.returnedToForm.$invalid) {
        this.close();
        return;
      }
      this.cancelled = false;
      $('#footer-modal').modal('close');
    },
    /**
     * Close the returnedBy form without submitting
     * @author Brandon Groff
     */
    close: function () {
      this.cancelled = true;
      $('#footer-modal').modal('close');
    },
    /**
     * ng-modal variable for whom the object is being returned to
     * @type {string}
     * @author Brandon Groff
     */
    returnedTo: undefined,
    /**
     * internally used variable to control if the modal/form should be submitted or just closed
     * @type {boolean}
     * @author Brandon Groff
     */
    cancelled: true
  };

});
