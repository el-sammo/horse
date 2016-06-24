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

		$scope.show1st = false;
		$scope.show1stFirstTie = false;
		$scope.show1stSecondTie = false;
		$scope.show2nd = false;
		$scope.show2ndFirstTie = false;
		$scope.show2ndSecondTie = false;
		$scope.show3rd = false;
		$scope.show3rdFirstTie = false;
		$scope.show3rdSecondTie = false;
		$scope.show4th = false;
		$scope.show4thFirstTie = false;
		$scope.show4thSecondTie = false;
		$scope.show5th = false;
		$scope.show5thFirstTie = false;
		$scope.show5thSecondTie = false;
		$scope.showExactaAA = false;
		$scope.showExactaAB = false;
		$scope.showExactaBA = false;
		$scope.showExactaBB = false;
		$scope.showTrifecta = false;
		$scope.showTrifectaAAA = false;
		$scope.showTrifectaAAB = false;
		$scope.showTrifectaABA = false;
		$scope.showTrifectaABB = false;
		$scope.showTrifectaBAA = false;
		$scope.showTrifectaBAB = false;
		$scope.showTrifectaBBA = false;
		$scope.showTrifectaBBB = false;
		$scope.showSuperfectaAAAA = false;
		$scope.showSuperfectaAAAB = false;
		$scope.showSuperfectaAABA = false;
		$scope.showSuperfectaAABB = false;
		$scope.showSuperfectaABAA = false;
		$scope.showSuperfectaABAB = false;
		$scope.showSuperfectaABBA = false;
		$scope.showSuperfectaABBB = false;
		$scope.showSuperfectaBAAA = false;
		$scope.showSuperfectaBAAB = false;
		$scope.showSuperfectaBABA = false;
		$scope.showSuperfectaBABB = false;
		$scope.showSuperfectaBBAA = false;
		$scope.showSuperfectaBBAB = false;
		$scope.showSuperfectaBBBA = false;
		$scope.showSuperfectaBBBB = false;
		$scope.showPentafectaAAAAA = false;
		$scope.showPentafectaAAAAB = false;
		$scope.showPentafectaAAABA = false;
		$scope.showPentafectaAAABB = false;
		$scope.showPentafectaAABAA = false;
		$scope.showPentafectaAABAB = false;
		$scope.showPentafectaAABBA = false;
		$scope.showPentafectaAABBB = false;
		$scope.showPentafectaABAAA = false;
		$scope.showPentafectaABAAB = false;
		$scope.showPentafectaABABA = false;
		$scope.showPentafectaABABB = false;
		$scope.showPentafectaABBAA = false;
		$scope.showPentafectaABBAB = false;
		$scope.showPentafectaABBBA = false;
		$scope.showPentafectaABBBB = false;
		$scope.showPentafectaBAAAA = false;
		$scope.showPentafectaBAAAB = false;
		$scope.showPentafectaBAABA = false;
		$scope.showPentafectaBAABB = false;
		$scope.showPentafectaBABAA = false;
		$scope.showPentafectaBABAB = false;
		$scope.showPentafectaBABBA = false;
		$scope.showPentafectaBABBB = false;
		$scope.showPentafectaBBAAA = false;
		$scope.showPentafectaBBAAB = false;
		$scope.showPentafectaBBABA = false;
		$scope.showPentafectaBBABB = false;
		$scope.showPentafectaBBBAA = false;
		$scope.showPentafectaBBBAB = false;
		$scope.showPentafectaBBBBA = false;
		$scope.showPentafectaBBBBB = false;
		$scope.showDouble = false;
		$scope.showDoubleAlt = false;
		$scope.showPickThree = false;
		$scope.showPickThreeAlt = false;
		$scope.showPickFour = false;
		$scope.showPickFourAlt = false;
		$scope.showPickFourConsolation = false;
		$scope.showPickFive = false;
		$scope.showPickFiveAlt = false;
		$scope.showPickFiveConsolation = false;
		$scope.showPickSix = false;
		$scope.showPickSixAlt = false;
		$scope.showPickSixConsolation = false;
		$scope.showPickSeven = false;
		$scope.showPickSevenAlt = false;
		$scope.showPickEight = false;
		$scope.showPickEightAlt = false;
		$scope.showPickNine = false;
		$scope.showPickNineAlt = false;
		$scope.showPickTen = false;
		$scope.showPickTenAlt = false;

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
						$scope.race = race;
console.log('$scope.race:');
console.log($scope.race);
						race.wagers.forEach(function(wager) {
							if(wager.wager === 'Win') {
								$scope.show1st = true;
							}
							if(wager.wager === 'Place') {
								$scope.show2nd = true;
							}
							if(wager.wager === 'Show') {
								$scope.show3rd = true;
							}
							if(wager.wager === 'Exacta') {
								$scope.showExactaAA = true;
							}
							if(wager.wager === 'Trifecta') {
								$scope.showTrifectaAAA = true;
							}
							if(wager.wager === 'Superfecta') {
								$scope.show4th = true;
								$scope.showSuperfectaAAAA = true;
							}
							if(wager.wager === 'Pentafecta') {
								$scope.show5th = true;
								$scope.showPentafectaAAAAA = true;
							}
							if(wager.wager === 'Daily Double') {
								$scope.show1st = true;
							}
							if(wager.wager === 'Pick 3') {
								$scope.showPickThree = true;
							}
							if(wager.wager === 'Pick 4') {
								$scope.showPickFour = true;
							}
							if(wager.wager === 'Pick 5') {
								$scope.showPickFive = true;
							}
							if(wager.wager === 'Pick 6') {
								$scope.showPickSix = true;
								$scope.showPickSixAlt = true;
							}
							if(wager.wager === 'Pick 7') {
								$scope.showPickSeven = true;
							}
							if(wager.wager === 'Pick 8') {
								$scope.showPickEight = true;
							}
							if(wager.wager === 'Pick 9') {
								$scope.showPickNine = true;
							}
							if(wager.wager === 'Pick 10') {
								$scope.showPickTen = true;
							}
						});
					}
				});
			});
		});

		$scope.getJockey = function(whichJockey) {
			var finderMap = [];
			finderMap['first'] = $scope.firstNumber;
			finderMap['first1stTie'] = $scope.first1stTieNumber;
			finderMap['first2ndTie'] = $scope.first2ndTieNumber;
			finderMap['second'] = $scope.secondNumber;
			finderMap['second1stTie'] = $scope.second1stTieNumber;
			finderMap['second2ndTie'] = $scope.second2ndTieNumber;
			finderMap['third'] = $scope.thirdNumber;
			finderMap['third1stTie'] = $scope.third1stTieNumber;
			finderMap['third2ndTie'] = $scope.third2ndTieNumber;
			finderMap['fourth'] = $scope.fourthNumber;
			finderMap['fourth1stTie'] = $scope.fourth1stTieNumber;
			finderMap['fourth2ndTie'] = $scope.fourth2ndTieNumber;
			finderMap['fifth'] = $scope.fifthNumber;
			finderMap['fifth1stTie'] = $scope.fifth1stTieNumber;
			finderMap['fifth2ndTie'] = $scope.fifth2ndTieNumber;

			var getNumber = finderMap[whichJockey];

			$scope.race.entries.forEach(function(entry) {
				if(entry.number == getNumber) {
					if(whichJockey === 'first') {
						$scope.firstJockey = entry.jockey;
					}
					if(whichJockey === 'first1stTie') {
						$scope.first1stTieJockey = entry.jockey;
					}
					if(whichJockey === 'first2ndTie') {
						$scope.first2ndTieJockey = entry.jockey;
					}
					if(whichJockey === 'second') {
						$scope.secondJockey = entry.jockey;
					}
					if(whichJockey === 'second1stTie') {
						$scope.second1stTieJockey = entry.jockey;
					}
					if(whichJockey === 'second2ndTie') {
						$scope.second2ndTieJockey = entry.jockey;
					}
					if(whichJockey === 'third') {
						$scope.thirdJockey = entry.jockey;
					}
					if(whichJockey === 'third1stTie') {
						$scope.third1stTieJockey = entry.jockey;
					}
					if(whichJockey === 'third2ndTie') {
						$scope.third2ndTieJockey = entry.jockey;
					}
					if(whichJockey === 'fourth') {
						$scope.fourthJockey = entry.jockey;
					}
					if(whichJockey === 'fourth1stTie') {
						$scope.fourth1stTieJockey = entry.jockey;
					}
					if(whichJockey === 'fourth2ndTie') {
						$scope.fourth2ndTieJockey = entry.jockey;
					}
					if(whichJockey === 'fifth') {
						$scope.fifthJockey = entry.jockey;
					}
					if(whichJockey === 'fifth1stTie') {
						$scope.fifth1stTieJockey = entry.jockey;
					}
					if(whichJockey === 'fifth2ndTie') {
						$scope.fifth2ndTieJockey = entry.jockey;
					}
				}
			});
		};


	}
}());
