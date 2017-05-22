/**
 * @ngdoc module
 * @name resdesk.components
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.user
 * @requires resdesk.calendar
 * @requires resdesk.modal
 * @requires resdesk.toast
 * @description
 * Module containing modal services and functionality.
 */
var componentsModule = angular.module('resdesk.components', ['resdesk.config', 
                                                             'resdesk.helper', 
                                                             'resdesk.user', 
                                                             'resdesk.calendar', 
                                                             'resdesk.modal', 
                                                             'resdesk.toast']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk
 * @author Brandon Groff
 */
componentsModule.path = './src/components/Other/';
