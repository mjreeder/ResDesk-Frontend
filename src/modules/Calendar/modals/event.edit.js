/**
 * @memberof resdesk.calendar
 * @ngdoc controller
 * @name EventEditModal
 * @param {service} $scope Angular service
 * @param {service} $MaterialModalClose resdesk.modal provided service
 * @param {factory} CalendarAPI  Calendar api functions
 * @description
 *  Modal controller for editing an event.
 */
calendarModule.controller('EventEditModal', function ($scope, $MaterialModalClose, CalendarAPI) {
  // console.log(eventData);
  /**
   * @private
   * @type {object}
   * @memberof EventEditModal
   * @description
   *  this modal jQuery element
   */
  var thisModal = $('#material-modal');

  /**
   * Called by materialize jQuery callback on modal appearance
   * @private
   * @memberOf EventEditModal
   * @author Brandon Groff
   */
  var onLoad = function() {

  };

  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberOf EventEditModal
   * @author Brandon Groff
   */
  var onComplete = function() {
    return $scope.createdItem;
  };


  /**
   * Close the modal
   * @memberOf EventEditModal
   * @author Brandon Groff
   */
  $scope.close = function() {
    // Add pre-close content here
    thisModal.modal('close');
  };

  /**
   * Submit the form
   * @memberOf EventEditModal
   * @author Brandon Groff
   */
  $scope.submit = function() {
//    $scope.createdItem = API.Lockouts.create($scope.resident);
    $scope.close();
  };


  /* Modal Initilization Block. DO NOT TOUCH */

  /**
   * Generic Modal initialization function
   * @private
   * @memberof EventEditModal
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
