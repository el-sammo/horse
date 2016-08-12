(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Account
	///

	app.controller('AccountController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$rootScope', '$window',
		'messenger', 'payMethodMgmt', 'layoutMgmt', 'customerMgmt',
		'accountMgmt', 'deviceMgr', 'tournamentMgmt'
	];

	function controller(
		$scope, $http, $rootScope, $window, 
		messenger, payMethodMgmt, layoutMgmt, customerMgmt,
		accountMgmt, deviceMgr, tournamentMgmt
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		$scope.logOut = layoutMgmt.logOut;

		$scope.showLogin = false;
		$scope.showLogout = true;
		$scope.showSignup = false;

		$scope.addPM = payMethodMgmt.modals.add;
		$scope.removePM = payMethodMgmt.modals.remove;
		$scope.changeAddress = accountMgmt.modals.changeAddress;

		$scope.logOut = layoutMgmt.logOut;

		var sessionPromise = customerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			if(!sessionData.customerId) {
				$window.location.href = '/';
				return;
			}

			var dateObj = new Date();
			var year = dateObj.getFullYear();
			var month = (dateObj.getMonth() + 1);
			var date = dateObj.getDate();

			if(month < 10) {
				month = '0' + month;
			}

			if(date < 10) {
				date = '0' + date;
			}

			var todayDate = year + month + date;

			var getCurrentTournamentsPromise = tournamentMgmt.getTournamentsByDate(todayDate);
			getCurrentTournamentsPromise.then(function(tournamentsData) {
				var dateObj = new Date();
				var nowMills = dateObj.getTime();
				tournamentsData.forEach(function(tournament) {
					tournament.mtp = parseInt((tournament.startTime - nowMills) / 1000);
				});
				$scope.currentTournaments = tournamentsData;
			});

			var customerId = sessionData.customerId;

			$scope.testCharge = function(paymentMethodId) {
console.log('$scope.testCharge() called with PMID: '+paymentMethodId);				
				var testData = {
					total: .02,
					customerId: customerId,
					paymentMethodId: paymentMethodId
				}
console.log('testData:');				
console.log(testData);				

				var createTestChargePromise = reservationMgmt.createTestCharge(testData);
				createTestChargePromise.then(function(response) {
console.log('response:');
console.log(response);
				});
			}

			customerMgmt.getCustomer(customerId).then(function(customer) {
				$scope.customer = customer;

//				var getCustomerTournamentsPromise = tournamentMgmt.getTournamentsByCustomerId(customer.id);
//				getCustomerTournamentsPromise.then(function(tournamentsData) {
//
//					var completedHistory = [];
//					tournamentsData.forEach(function(tournament) {
//						if(tournament.createdAt) {
//							tournament.tournamentDate = tournament.createdAt.substr(0,10);
//						}
//						tournament.totalFee = parseFloat(tournament.entryFee + tournament.siteFee);
//						tournament.result = 0;
//						tournament.results.forEach(function(result) {
//							if(result.customerId === customerId) {
//								tournament.result = result.amount;
//							}
//						});
//						completedHistory.push(tournament);
//					});
//					$scope.tournaments = completedHistory;
//				});
			});
		});

		$rootScope.$on('customerChanged', function(evt, customer) {
			$scope.customer = customer;
		});
	}
}());
