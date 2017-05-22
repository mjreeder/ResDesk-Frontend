/**
 * @ngdoc module
 * @name resdesk.toast
 * @requires ngAnimate
 * @requires resdesk.helper
 * @description
 * Module containing modal services and functionality.
 */
var toastModule = angular.module('resdesk.toast', ['ngAnimate', 'resdesk.helper']);

/**
 * the module path
 * @name path
 * @type {string}
 * @memberOf resdesk.toast
 * @author Brandon Groff
 */
toastModule.path = './src/components/Toast/';
