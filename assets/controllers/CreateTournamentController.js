(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Create Tournament Controller
	///


	app.controller('CreateTournamentController', controller);
	
	controller.$inject = [
		'$rootScope', '$scope', '$http', '$modal', 
		'navMgr', 'pod', 'layoutMgmt',
		'customerMgmt', 'trdMgmt', 'tournamentMgmt'
	];

	function controller(
		$rootScope, $scope, $http, $modal, 
		navMgr, pod, layoutMgmt,
		customerMgmt, trdMgmt, tournamentMgmt
	) {

		if(!$scope.$parent.customerId) {
			layoutMgmt.logIn();
		}

		$scope.tournament = {};

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

		var getCustomerPromise = customerMgmt.getCustomer($scope.$parent.customerId);
		getCustomerPromise.then(function(customer) {
			var getTrdsPromise = trdMgmt.getTrdsByDate(todayDate);
			getTrdsPromise.then(function(trdsData) {
				$scope.tracks = trdsData;
				$scope.updateTournamentName(customer, trdsData[0].name);
			});
		});

		$scope.updateTournamentName = function(customer, assocTrackName) {
			$scope.tournament.name = customer.city + ' ' +customer.fName + '\'s ' + assocTrackName + ' Tournament';
		}

	}

}());
