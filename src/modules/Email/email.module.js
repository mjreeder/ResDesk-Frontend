/**
 * @ngdoc module
 * @name resdesk.email
 * @requires ui.router
 * @requires resdesk.config
 * @requires resdesk.helper
 * @requires resdesk.toast
 * @description
 * ResDesk email service
 */
var emailModule = angular.module('resdesk.email', ['resdesk.config', 'resdesk.helper', 'resdesk.toast']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.email
 * @author Brandon Groff
 */
emailModule.path = './src/modules/Email/';

