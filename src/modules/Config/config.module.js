/**
 * @ngdoc module
 * @name resdesk.config
 * @description
 * ResDesk global config module
 */
var configModule = angular.module('resdesk.config', []);

/**
 * set production environment
 * @name path
 * @type {boolean}
 * @memberOf resdesk.config
 * @author Brandon Groff
 */
var prod = false;

/**
 * the productation base API url
 * @name path
 * @type {string}
 * @memberOf resdesk.config
 * @author Brandon Groff
 */
var prodUrl = 'http://bgroff-pi2.dhcp.bsu.edu/ResDesk/Backend/Public/api/v1';

/**
 * Unused: the dev base API url
 * @name path
 * @type {string}
 * @memberOf resdesk.config
 * @author Brandon Groff
 */
var devUrl = 'http://localhost:8888/ResDesk/Backend/Public/api/v1';

/**
 * @ngdoc constant
 * @memberOf resdesk.config
 * @name AppConfig
 * @description
 * ResDesk global config object
 */
configModule.constant('AppConfig', {
  prod: prod,
  dev: !prod,
  baseUrl: prod ? prodUrl : devUrl
});
