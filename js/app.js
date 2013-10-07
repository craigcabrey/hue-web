'use strict';

/* App Module */

angular.module('hueWeb', ['hueWebFilters', 'hueWebServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/api/bridges', {templateUrl: 'partials/phone-list.html', controller: BridgeListCtrl}).
      when('/api/bridges:bridgeId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/phones'});
}]);

