/**
 * @memberof resdesk.lostandfound
 * @ngdoc controller
 * @name LostAndFoundController
 * @description Controller for main Lost and Found view
 * @param {service} $scope      Angular serivice
 * @param {factory} LostAndFoundAPI  factory of lost and found API endpoint functions
 * @param {factory} $MaterialToast      Toast notificaiton service from ResDesj.toast
 * @param {service} $MaterialModal Modal service from ResDesk.modal
 * @author Brandon Groff
 */
lostandfoundModule.controller('LostAndFoundController', function ($scope, LostAndFoundAPI, $MaterialModal, $MaterialToast) {

  /**
   * @description tableData object for holding the MaterialTable data
   * @type {object}
   * @memberof LostAndFoundController
   * @author Brandon Groff
   */
  $scope.tableData;

  /**
   * Controller onLoad function for initial data loading. Gets all LostAndFound items
   * @memberof LostAndFoundController
   * @private
   * @author Brandon Groff
   */
  var init = function () {

    LostAndFoundAPI.getAll()
      .then(function (response) {
        $scope.tableData = LostAndFoundAPI.parseResponseToTableFormat(response);
      }).catch(function (error) {

        if (error.data && error.data.description) {
          $MaterialToast.showError(error.data.description);
        } else {
          $MaterialToast.showError("An error occured getting lost and found items");
        }
      });

  }
  init();


  /**
   * Click action handler for when a table row is selected. Shows the item update modal
   * @author Brandon Groff
   * @memberof LostAndFoundController
   * @param {object} row a Material Table row
   */
  $scope.rowClick = function (row) {
    $MaterialModal.showModal({
      templateUrl: lostandfoundModule.path + "modals/item.update.html",
      controller: "LostAndFoundUpdateItemModal",
      passData: row
    }).then(function (modal) {
      modal.close.then(function (result) {
        if (result) {
          init();
        }
      });
    });
  };

  /**
   * Click action handler for opening the create lost and found item modal
   * @memberof LostAndFoundController
   * @author Brandon Groff
   */
  $scope.create = function () {

    $MaterialModal.showModal({
      templateUrl: lostandfoundModule.path + "modals/item.create.html",
      controller: "LostAndFoundNewItemModal"
    }).then(function (modal) {
      modal.close.then(function (result) {
        if (result) {
          init();
        }
      });
    });

  };

});
