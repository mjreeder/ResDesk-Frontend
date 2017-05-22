/**
 * @memberof resdesk.calendar
 * @ngdoc controller
 * @name EventCreateModal
 * @param {service} $scope Angular service
 * @param {service} $MaterialModalClose resdesk.modal provided service
 * @param {factory} CalendarAPI  Calendar api functions
 * @description
 *  Modal controller for creating an event.
 */
calendarModule.controller('EventCreateModal', function ($scope, $MaterialModalClose, CalendarAPI, $user, $timeout) {

  /**
   * @private
   * @type {object}
   * @memberof EventCreateModal
   * @description
   *  this modal jQuery element
   */
  var thisModal = $('#material-modal');


  /**
   * Called by materialize jQuery callback on modal appearance
   * @private
   * @memberOf EventCreateModal
   * @author Brandon Groff
   */
  var onLoad = function () {
    $scope.types = ['school', 'work', 'personal'];
    $scope.newItem = {
      bsu_id: $user.getUserInfo().bsu_id,
      type: '',
      start_time: moment($scope.givenData.event.start).toDate(),
      end_time: moment($scope.givenData.event.end).toDate()
    };
    $scope.$digest();
    $timeout(function(){
      $('select').material_select();
    }, 10);
  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberOf EventCreateModal
   * @author Brandon Groff
   */
  var onComplete = function () {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberOf EventCreateModal
   * @author Brandon Groff
   */
  $scope.close = function () {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @memberOf EventCreateModal
   * @author Brandon Groff
   */
  $scope.submit = function () {
    $scope.createdItem = CalendarAPI.createEvent($scope.newItem, $user.getUserInfo().currentHall);
    $scope.close();
  };


  /* Modal Initilization Block. DO NOT TOUCH */

  /**
   * Generic Modal initialization function
   * @private
   * @memberof EventCreateModal
   * @author Brandon Groff
   */
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
