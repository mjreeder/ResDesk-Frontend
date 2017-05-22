/**
 * @memberof resdesk.modal
 * @ngdoc service
 * @param {service} $animate Angular ngAnimate service
 * @param {service} $document Angular document wrapper
 * @param {service} $compile Angular built-in service
 * @param {service} $controller Angular built-in service
 * @param {service} $rootScoe Angular built-in service
 * @param {service} $q Angular built-in Promise service
 * @param {service} $templateRequest Angular built-in service
 * @param {service} $timeout Angular built-in timeout service
 *                              
 * @description 
 *   Service for creating modals.
 *   
 *   Original Source: [https://github.com/dwmkerr/angular-modal-service](https://github.com/dwmkerr/angular-modal-service)
 */
modalModule.factory('$MaterialModal', function ($animate, $document, $compile, $controller, $rootScope, $q, $templateRequest, $timeout) {


  /**
   * Part of $MaterialModal, constructor for creating a modal
   * @ngdoc class
   * @memberof resdesk.modal
   * @author Brandon Groff
   * @returns {MaterialModal} a MaterialModal object instance
   */
  function MaterialModal() {

    var self = this;

    /**
     * @func getTemplate gets the html template for the modal
     * @private
     * @author Brandon Groff
     * @memberof MaterialModal
     * @param   {string} template    the inlined html template
     * @param   {string} templateUrl a url to the html template
     * @returns {Promise} a promise which gets the template, either from the template parameter or via a request to the template url parameter.
     */
    var getTemplate = function (template, templateUrl) {
      var deferred = $q.defer();
      if (template) {
        deferred.resolve(template);
      } else if (templateUrl) {
        $templateRequest(templateUrl, true)
          .then(function (template) {
            deferred.resolve(template);
          }, function (error) {
            deferred.reject(error);
          });
      } else {
        deferred.reject("No template or templateUrl has been specified.");
      }
      return deferred.promise;
    };

    /**
     * @func appendChild Adds an element to the DOM as the last child of its container like append, but uses $animate to handle animations. 
     * @private
     * @author Brandon Groff
     * @memberof MaterialModal
     * @param   {object}  parent the html element to insert the modal into, usually <body>
     * @param   {string}  child   the modal element to insert
     * @returns {Promise} Returns a promise that is resolved once all animation is complete.
     */
    var appendChild = function (parent, child) {
      var children = parent.children();
      if (children.length > 0) {
        return $animate.enter(child, parent, children[children.length - 1]);
      }
      return $animate.enter(child, parent);
    };

    /**
     * @description class function to display the modal
     * @function showModal
     * @public
     * @memberof MaterialModal
     * @author Brandon Groff
     * @param   {object}   options modal options, including `controller`, `template`, `templateUrl`, `passData`, `inputs`, `appendElement`, and `controllerAs`
     * @returns {Promise} a deferred promise that should resolve when the modal is closed
     */
    this.showModal = function (options) {

      //  Get the body of the document, we'll add the modal to this.
      var body = angular.element($document[0].body);

      //  Create a deferred we'll resolve when the modal is ready.
      var deferred = $q.defer();

      //  Validate the input parameters.
      var controllerName = options.controller;
      if (!controllerName) {
        deferred.reject("No controller has been specified.");
        return deferred.promise;
      }

      //  Get the actual html of the template.
      getTemplate(options.template, options.templateUrl)
        .then(function (template) {

          //  Create a new scope for the modal.
          var modalScope = (options.scope || $rootScope).$new();
          var rootScopeOnClose = $rootScope.$on('$locationChangeSuccess', cleanUpClose);

          modalScope.givenData = options.passData;

          //  Create the inputs object to the controller - this will include
          //  the scope, as well as all inputs provided.
          //  We will also create a deferred that is resolved with a provided
          //  close function. The controller can then call 'close(result)'.
          //  The controller can also provide a delay for closing - this is
          //  helpful if there are closing animations which must finish first.
          var closeDeferred = $q.defer();
          var closedDeferred = $q.defer();
          var inputs = {
            $scope: modalScope,
            $MaterialModalClose: function (result, delay) {
              if (delay === undefined || delay === null) delay = 0;
              $timeout(function () {

                cleanUpClose(result);

              }, delay);
            }
          };

          //  If we have provided any inputs, pass them to the controller.
          if (options.inputs) angular.extend(inputs, options.inputs);

          //  Compile then link the template element, building the actual element.
          //  Set the $element on the inputs so that it can be injected if required.
          var linkFn = $compile(template);
          var modalElement = linkFn(modalScope);
          inputs.$element = modalElement;



          //  Finally, append the modal to the dom.
          if (options.appendElement) {
            // append to custom append element
            appendChild(options.appendElement, modalElement);
          } else {
            // append to body when no custom append element is specified
            appendChild(body, modalElement);
          }

          //  Create the controller, explicitly specifying the scope to use.
          // Must do this after the elements are added to the DOM because jQuery
          var controllerObjBefore = modalScope[options.controllerAs];
          var modalController = $controller(options.controller, inputs, false, options.controllerAs);

          if (options.controllerAs && controllerObjBefore) {
            angular.extend(modalController, controllerObjBefore);
          }

          //  We now have a modal object...
          var modal = {
            controller: modalController,
            scope: modalScope,
            element: modalElement,
            close: closeDeferred.promise,
            closed: closedDeferred.promise
          };
        
        
          //Recalculate the content body from the footer height
          var offsetHeight = $('#material-modal .modal-footer').outerHeight();
          $('#material-modal .modal-content').css('height', 'calc(100% - '+offsetHeight+'px)');

          //focus the first input, if there is one
          $('.focus-first').focus();

          //  ...which is passed to the caller via the promise.
          deferred.resolve(modal);

          /**
           * @memberof MaterialModal.showModal
           * @private
           * @func cleanUpClose properly handle closing the modal
           * @author Brandon Groff
           * @param {any} result the object/string/etc. returned from the modal, if any
           */
          function cleanUpClose(result) {

            //  Resolve the 'close' promise.
            closeDeferred.resolve(result);

            //  Let angular remove the element and wait for animations to finish.
            $animate.leave(modalElement)
              .then(function () {
                //  Resolve the 'closed' promise.
                closedDeferred.resolve(result);

                //  We can now clean up the scope
                if (modalScope == null) {
                  return;
                }

                modalScope.$destroy();

                //  Unless we null out all of these objects we seem to suffer
                //  from memory leaks, if anyone can explain why then I'd
                //  be very interested to know.
                inputs.close = null;
                deferred = null;
                closeDeferred = null;
                modal = null;
                inputs = null;
                modalElement = null;
                modalScope = null;
              });

            // remove event watcher
            rootScopeOnClose && rootScopeOnClose();
          }

        })
        .then(null, function (error) { // 'catch' doesn't work in IE8.
          deferred.reject(error);
        });

      return deferred.promise;
    };

  }

  return new MaterialModal();
});