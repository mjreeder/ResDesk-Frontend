/**
 * @memberof resdesk.calendar
 * @ngdoc controller
 * @name EventViewModal
 * @param {service} $scope Angular service
 * @param {service} $MaterialModalClose resdesk.modal provided service
 * @param {factory} CalendarAPI  Calendar api functions
 * @description 
 *  Modal controller for only viewing an event. 
 */
calendarModule.controller('EventViewModal', function ($scope, $MaterialModalClose, CalendarAPI) {
  // this element
  var thisModal = $('#material-modal');
  
  /**
   * @private
   * @type {object}
   * @memberof EventViewModal
   * @description 
   *  this modal jQuery element
   */
  var onLoad = function() {
    
  };
  
  /**
   * Called after materialze jQuery callback for modal completion
   * @private
   * @memberOf EventViewModal
   * @author Brandon Groff
   */
  var onComplete = function() {
    return $scope.createdItem;
  };
  
  
  /**
   * Close the modal
   * @memberOf EventViewModal
   * @author Brandon Groff
   */
  $scope.close = function() {
    // Add pre-close content here
    thisModal.modal('close');
  };
  
  /**
   * Submit the form
   * @memberOf EventViewModal
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
   * @memberof EventViewModal
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