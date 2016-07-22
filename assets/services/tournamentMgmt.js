(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Tournament Management
	///

	app.factory('tournamentMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var tournament;
		var getTournamentPromise;
		var registerTournamentPromise;
		var getTournamentsByCustomerIdPromise;
		var getTournamentsByDatePromise;
		var getLeadersPromise;
		var updateTournamentCustomersCreditsPromise;

		var service = {
			getTournament: function(tournamentId) {
				var url = '/tournaments/' + tournamentId;
				getTournamentPromise = $http.get(url).then(function(res) {
					mergeIntoTournament(res.data);
					return tournament;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getTournamentPromise;
			},

			registerTournament: function(tournamentId, customerId) {
				var params = tournamentId +'-'+ customerId;
				var url = '/tournaments/register/' + params;
				registerTournamentPromise = $http.get(url).then(function(res) {
					return res;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return registerTournamentPromise;
			},

			getTournamentsByCustomerId: function(data) {
				var url = '/tournaments/byCustomerId/' + data;
				getTournamentsByCustomerIdPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getTournamentsByCustomerIdPromise;
			},

			getTournamentsByDate: function(date) {
				var url = '/tournaments/byDate/' + date;
				getTournamentsByDatePromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getTournamentsByDatePromise;
			},

			getLeaders: function(tournamentId) {
				var url = '/tournaments/leaders/' + tournamentId;
				getLeadersPromise = $http.get(url).then(function(leaders) {
					return leaders.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getLeadersPromise;
			},

			updateTournamentCustomersCredits: function(finalRaceId, acIds) {
				var url = '/tournaments/updateTCC/' + finalRaceId;
				return $http.put(url, acIds).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return {success: true};
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			createTournament: function(tournamentData) {
				var url = '/tournaments/create';
				return $http.post(url, tournamentData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoTournament(data, true);
						return tournament;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateTournament: function(tournamentData) {
				var url = '/tournaments/' + tournamentData.id;
				return $http.put(url, tournamentData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoTournament(data, true);
						return tournament;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

		};

		function mergeIntoTournament(data, replace) {
			if(! tournament) {
				tournament = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(tournament, function(val, key) {
					delete tournament[key];
				});
			}

			angular.forEach(data, function(val, key) {
				tournament[key] = val;
			});
		};

		return service;
	}

}());
