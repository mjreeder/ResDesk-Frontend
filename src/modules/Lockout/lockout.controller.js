/**
 * @memberof resdesk.lockout
 * @ngdoc controller
 * @name LockoutsController
 * @description Controller for main Lockouts view
 * @param {service} $scope      Angular serivice
 * @param {factory} LockoutsAPI  factory of lockouts API endpoint functions
 * @param {factory} Helper      Helper function factory from ResDesk.Helper
 * @param {service} $MaterialModal Modal service from ResDesk.modal
 * @author Brandon Groff
 */
lockoutModule.controller('LockoutsController', function ($scope, LockoutsAPI, Helper, $MaterialModal) {

  /**
   * The tableData to show
   * @type {object}
   * @memberof LockoutsController
   * @author Brandon Groff
   */
  $scope.tableData;

  /**
   * The resident for Directory auto-complete to use
   * @type {object}
   * @memberof LockoutsController
   * @author Brandon Groff
   */
  $scope.resident;

  /**
   * Contoller initialization funciton, loads initial data
   * @memberof LockoutsController
   * @author Brandon Groff
   */
  var init = function () {
    $scope.tableData = [];
    $scope.loading = true;
    LockoutsAPI.getAll()
      .then(function (response) {
        $scope.tableData = LockoutsAPI.parseResponseToTableFormat(response);
      }).catch(function (error) {
        Helper.log(error);
      });
  };

  init();


  /**
   * Opens the Create Lockout modal
   * @memberof LockoutsController
   * @author Brandon Groff
   */
  $scope.add = function () {

    $MaterialModal.showModal({
      templateUrl: lockoutModule.path + "modals/lockout.create.html",
      controller: "LockoutCreateModal"
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload data
        init();
      });
    });

  };

  /**
   * Opens a Details Modal for the selected row's Student
   * @memberof LockoutsController
   * @param {object} row The row to get the user from and display
   * @author Brandon Groff
   */
  $scope.rowClick = function (row) {

    $MaterialModal.showModal({
      templateUrl: lockoutModule.path + "modals/lockout.details.html",
      controller: "LockoutDetailsModal",
      passData: row
    }).then(function (modal) {
      modal.close.then(function (result) {
        $scope.modalResult = result;
        //reload data
        init();
      });
    });
  }

  /**
   * function for Directory autocomplete, empty
   * @memberof LockoutsController
   * @author Brandon Groff
   * @param {Student} resident a Student object selected by the create modal
   */
  $scope.selectResident = function (resident) {

  };

});