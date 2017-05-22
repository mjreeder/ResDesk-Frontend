/* Original: https://github.com/dwmkerr/angular-toast-service */
/**
 * @memberof resdesk.toast
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
 *   Service for creating toast notifications.
 *   
 *   Original Sources: 
 *   [https://github.com/dwmkerr/angular-modal-service](https://github.com/dwmkerr/angular-modal-service)
 *   [https://github.com/dwmkerr/angular-toast-service](https://github.com/dwmkerr/angular-toast-service)
 */
toastModule.factory('$MaterialToast', function ($animate, $document, $compile, $controller, $rootScope, $q, $templateRequest, $timeout) {


  /**
   * Part of $MaterialToast, constructor for creating a toast
   * @ngdoc class
   * @class
   * @memberof resdesk.toast
   * @author Brandon Groff
   * @returns {MaterialToast} a MaterialToast object instance
   */
  function MaterialToast() {

    var self = this;
    
    /**
     * @property {object} the default options for MaterialToast
     * @memberof MaterialToast
     * @description 
     * ------------------------------------------------------------------------
     * |    Key            |     Value                                        |   
     * |-------------------|--------------------------------------------------|
     * | templateUrl       | (string) toastModule.path + 'toast.default.html' | 
     * | showForTime       | (int) 5000 <- ms, or 5 sec                       |
     * | onClick           | (function) empty function                        |
     * | onClose           | (function) empty function                        |
     * | controller        | (Angular controller as string) 'DefaultToast'    |
     * | notificationLevel | (enum string, [normal, warning, error]) 'normal' |
     * | message           | (string) empty string                            |
     * ------------------------------------------------------------------------
     */
    var defaults = {
      templateUrl: toastModule.path + 'toast.default.html',
      showForTime: 5000,
      onClick: function(){
        //nothing
      },
      onClose: function() {
        //nothing
      },
      controller: 'DefaultToast',
      notificationLevel: 'normal', //levels: normal, warning, error,
      message:''
    };
     

    /**
     * @func getTemplate gets the html template for the modal
     * @private
     * @author Brandon Groff
     * @memberof MaterialToast
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
     * @memberof MaterialToast
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
     * @description Show a toast message (with optional click action)
     * @function showToast
     * @memberof MaterialToast
     * @author Brandon Groff
     * @param   {string} message            The message the toast will show
     * @param   {object} options = defaults an object of different options
     * @returns {Promise} a Promise object
     */
    this.showToast = function (message, options = angular.copy(defaults)) {
      
      if (!options.template && !options.templateUrl) {
        options.templateUrl = defaults.templateUrl;
      }
      
      if (!options.showForTime) {
        options.showForTime = defaults.showForTime;
      }
      
      if (!options.onClick) {
        options.onClick = defaults.onClick;
      }
      
      if (!options.onClose) {
        options.onClose = defaults.onClose;
      }
      
      if (!options.controller) {
        options.controller = defaults.controller;
      }
      
      if (!options.notificationLevel) {
        options.notificationLevel = defaults.notificationLevel;
      }

      //  Get the body of the document, we'll add the toast to this.
      var body = angular.element($document[0].body);

      //  Create a deferred we'll resolve when the toast is ready.
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

          //  Create a new scope for the toast.
          var toastScope = (options.scope || $rootScope).$new();
        
          toastScope.message = message;
          toastScope.onToastClick = options.onClick;
          toastScope.showForTime = options.showForTime;
          toastScope.onClose = options.onClose;
          toastScope.notificationLevel = options.notificationLevel;

          //  Create the inputs object to the controller - this will include
          //  the scope, as well as all inputs provided.
          //  We will also create a deferred that is resolved with a provided
          //  close function. The controller can then call 'close(result)'.
          //  The controller can also provide a delay for closing - this is
          //  helpful if there are closing animations which must finish first.
          var closeDeferred = $q.defer();
          var closedDeferred = $q.defer();
          var inputs = {
            $scope: toastScope,
            $MaterialToastClose: function (result, delay) {
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
          var toastElement = linkFn(toastScope);
          inputs.$element = toastElement;



          //  Finally, append the toast to the dom.
          if (options.appendElement) {
            // append to custom append element
            appendChild(options.appendElement, toastElement);
          } else {
            // append to body when no custom append element is specified
            appendChild(body, toastElement);
          }

          //  Create the controller, explicitly specifying the scope to use.
          // Must do this after the elements are added to the DOM because jQuery
          var controllerObjBefore = toastScope[options.controllerAs];
          var toastController = $controller(options.controller, inputs, false, options.controllerAs);

          if (options.controllerAs && controllerObjBefore) {
            angular.extend(toastController, controllerObjBefore);
          }

          //  We now have a toast object...
          var toast = {
            controller: toastController,
            scope: toastScope,
            element: toastElement,
            close: closeDeferred.promise,
            closed: closedDeferred.promise
          };

          //  ...which is passed to the caller via the promise.
          deferred.resolve(toast);

          function cleanUpClose(result) {

            //  Resolve the 'close' promise.
            closeDeferred.resolve(result);

            //  Let angular remove the element and wait for animations to finish.
            $animate.leave(toastElement)
              .then(function () {
                //  Resolve the 'closed' promise.
                closedDeferred.resolve(result);

                //  We can now clean up the scope
                if (toastScope == null) {
                  return;
                }

                toastScope.$destroy();

                //  Unless we null out all of these objects we seem to suffer
                //  from memory leaks, if anyone can explain why then I'd
                //  be very interested to know.
                inputs.close = null;
                deferred = null;
                closeDeferred = null;
                toast = null;
                inputs = null;
                toastElement = null;
                toastScope = null;
              });

          }

        })
        .then(null, function (error) { // 'catch' doesn't work in IE8.
          deferred.reject(error);
        });

      return deferred.promise;
    };
    
    /**
     * @description A quick accessor for showToast with notificationLevel set to error
     * @function showError
     * @memberof MaterialToast
     * @author Brandon Groff
     * @param   {string} message            The message the toast will show
     * @param   {object} options = defaults an object of different options
     * @returns {Promise} a Promise object
     */
    this.showError = function(message, options = angular.copy(defaults)){
      options.notificationLevel = 'error';
      return self.showToast(message, options);
    }
    
    /**
     * @description A quick accessor for showToast with notificationLevel set to warning
     * @function showWarning
     * @memberof MaterialToast
     * @author Brandon Groff
     * @param   {string} message            The message the toast will show
     * @param   {object} options = defaults an object of different options
     * @returns {Promise} a Promise object
     */
    this.showWarning = function(message, options = angular.copy(defaults)){
      options.notificationLevel = 'warning';
      return self.showToast(message, options);
    }

  }

  return new MaterialToast();
});