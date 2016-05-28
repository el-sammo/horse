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

		var legMap = [];
		legMap['Win'] = 1;
		legMap['Place'] = 1;
		legMap['Show'] = 1;
		legMap['Exacta'] = 1;
		legMap['Trifecta'] = 1;
		legMap['Superfecta'] = 1;
		legMap['Pentafecta'] = 1;
		legMap['Daily Double'] = 2;
		legMap['Pick 3'] = 3;
		legMap['Pick 4'] = 4;
		legMap['Pick 5'] = 5;
		legMap['Pick 6'] = 6;
		legMap['Pick 7'] = 7;
		legMap['Pick 8'] = 8;
		legMap['Pick 9'] = 9;
		legMap['Pick 10'] = 10;

		var partMap = [];
		partMap['Win'] = 1;
		partMap['Place'] = 1;
		partMap['Show'] = 1;
		partMap['Exacta'] = 2;
		partMap['Trifecta'] = 3;
		partMap['Superfecta'] = 4;
		partMap['Pentafecta'] = 5;

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

		$scope.showRaceWager = function(trackId, raceNumber, wager) {
			$scope.wagerTmpl = wager;

			var track = $.grep(
				$scope.trdData, function(e) { 
					return e.id == trackId; 
				}
			);

			var races = [];
			if(legMap[wager] < 2) {
				races.push(
					(
						$.grep(
							track[0].races, function(e) { 
								return e.number == raceNumber; 
							}
						)
					)
				[0]);
			} else {
				races.push(
					(
						$.grep(
							track[0].races, function(e) { 
								return e.number == raceNumber; 
							}
						)
					)
				[0]);
				var nextLeg = races[0].number;
				while(races.length < legMap[wager]) {
					nextLeg ++;
					races.push(
						(
							$.grep(
								track[0].races, function(e) { 
									return e.number == nextLeg; 
								}
							)
						)
					[0]);
				}
			}

			var wagerRunners = [];
			races.forEach(function(race) {
				wagerRunners.push(races[0].entries);
			});

console.log('wagerRunners:');
console.log(wagerRunners);

			$scope.legs = legMap[wager];
			$scope.parts = partMap[wager];

			$scope.singleDesc = 'To '+wager;

			$scope.wagerRunners = wagerRunners;
		}


	}

}());
