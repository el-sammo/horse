(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Wager Management
	///

	app.factory('wagerMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var wager;
		var getWagerPromise;
		var getWagersByCustomerIdPromise;
		var getLiveWagersByCustomerIdPromise;

		var service = {
			getWager: function(wagerId) {
				if(getWagerPromise) {
					return getWagerPromise;
				}

				var url = '/wagers/' + wagerId;
				getWagerPromise = $http.get(url).then(function(res) {
					return wager;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getWagerPromise;
			},

			getWagersByCustomerId: function(customerId) {
				var url = '/wagers/byCustomerId/' + customerId;
				getWagersByCustomerIdPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getWagersByCustomerIdPromise;
			},

			getLiveWagersByCustomerId: function(customerId) {
				var url = '/wagers/byCustomerIdLive/' + customerId;
				getLiveWagersByCustomerIdPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getLiveWagersByCustomerIdPromise;
			},

			submitWager: function(wagerData) {
				var url = '/wagers/submitWager';
				return $http.post(url, wagerData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return data;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			cancelWager: function(wagerData) {
				var url = '/wagers/cancelWager' + wagerData.id;
				return $http.put(url, wagerData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return wager;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

			// TODO - Get wager by username
			// :split services/signup.js

		};

		return service;
	}

}());
