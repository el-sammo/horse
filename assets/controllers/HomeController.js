(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Home
	///
	app.controller('HomeController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope', '$window', 
		'signupPrompter', 'customerMgmt', 'deviceMgr', 'trdMgmt'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope, $window,
		signupPrompter, customerMgmt, deviceMgr, trdMgmt
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		var getSessionPromise = customerMgmt.getSession();
		getSessionPromise.then(function(sessionData) {

			if(sessionData.customerId) {
				$rootScope.customerId = sessionData.customerId;
				$scope.customerId = $rootScope.customerId;
			}

			var getTrdsByDatePromise = trdMgmt.getTrdsByDate();
			getTrdsByDatePromise.then(function(trdData) {
				$scope.trdData = trdData;
console.log('$scope.trdData:');
console.log($scope.trdData);
			});

		});

		var distMap = [];
		distMap[.5625] = '4 1/2F',
		distMap[.625] = '5F',
		distMap[.6875] = '5 1/2F',
		distMap[.75] = '6F',
		distMap[.8125] = '6 1/2F',
		distMap[.875] = '7F',
		distMap[.9375] = '7 1/2F',
		distMap[1] = '1M',
		distMap[1.070] = '1M 70Y',
		distMap[1.125] = '1 1/8M',
		distMap[1.25] = '1 1/4M',
		distMap[1.375] = '1 3/8M',
		distMap[1.5] = '1 1/2M',
		distMap[1.625] = '1 5/8M',
		distMap[1.75] = '1 3/4M',
		distMap[1.875] = '1 7/8M',
		distMap[2] = '2M'

		$scope.convertDist = function(dist) {
			return distMap[dist];
		}

		$scope.convertPostTime = function(postTime) {
			var timePcs = postTime.toString().split(".");
			if(timePcs[1].length < 2) {
				timePcs[1] = timePcs[1]+'0';
			}
			return timePcs[0]+':'+timePcs[1];
		}

		$scope.showTrackRace = function(trackId, raceNum) {
			$scope.trId = trackId+'-'+raceNum;
		}

	}

}());
