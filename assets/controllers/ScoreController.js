(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Score
	///

	app.controller('ScoreController', controller);
	
	controller.$inject = [
		'$scope', '$http', 'messenger', '$rootScope',
		'$window', '$routeParams', 'layoutMgmt',
		'deviceMgr', 'trdMgmt', 'customerMgmt'
	];

	function controller(
		$scope, $http, messenger, $rootScope,
		$window, $routeParams, layoutMgmt,
		deviceMgr, trdMgmt, customerMgmt
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		var sessionPromise = customerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			if(sessionData.customerId) {
				var getCustomerPromise = customerMgmt.getCustomer(sessionData.customerId);
				getCustomerPromise.then(function(customerData) {
					if(!customerData.admin) {
						$window.location.href = '/';
						return;
					}
				});
			} else {
				$window.location.href = '/';
				return;
			}

			var rpPcs = $routeParams.id.split('-');

			var trId = rpPcs[0];
			var raceNum = rpPcs[1];

			$scope.trId = trId;
			$scope.raceNum = raceNum;

			var getTrdPromise = trdMgmt.getTrd(trId);
			getTrdPromise.then(function(trdData) {
				trdData.races.forEach(function(race) {
					if(race.number == raceNum) {
console.log('race:');
console.log(race);
					}
				});
			});
		});

	}

}());
