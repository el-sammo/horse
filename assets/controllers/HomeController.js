(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Home
	///
	app.controller('HomeController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope', '$window', 
		'$modal', 'signupPrompter', 'deviceMgr', 'layoutMgmt',
		'customerMgmt', 'trdMgmt', 'wagerMgmt', 'tournamentMgmt',
		'messenger'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope, $window,
		$modal, signupPrompter, deviceMgr, layoutMgmt, 
		customerMgmt, trdMgmt, wagerMgmt, tournamentMgmt,
		messenger
	) {

		$scope.leaderboardsShow = false;
		$scope.horseCenterShow = true;

		$scope.wagerData = {};

//		$scope.signUp = signupPrompter.prompt();

		$scope.logIn = function() {
			layoutMgmt.logIn();
		}

		$scope.signUp = function() {
			layoutMgmt.signUp();
		}

		$scope.logOut = function() {
			layoutMgmt.logOut();
		}

		$rootScope.$on('customerLoggedIn', function(evt, args) {
			$scope.customerId = args;
			$scope.showLogin = false;
			$scope.showLogout = true;
			$scope.showSignup = false;

			var getCustomerPromise = customerMgmt.getCustomer($scope.customerId);
			getCustomerPromise.then(function(customer) {
console.log('getCustomerPromise called');
				$scope.customer = customer;
			});

			if($scope.activeTournamentId) {
				updateActiveTournamentBalance($scope.activeTournamentId, $scope.customerId);
			}
			$scope.showHistory();
		});

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

		var updateBalance = function() {
console.log('updateBalance() called');
			var getSessionPromise = customerMgmt.getSession();
			getSessionPromise.then(function(sessionData) {
console.log('getSessionPromise called');
				if(sessionData.customerId) {
					var getCustomerPromise = customerMgmt.getCustomer(sessionData.customerId);
					getCustomerPromise.then(function(customer) {
console.log('getCustomerPromise called');
						$scope.customer = customer;
					});
				}
			});
		}

		var updateActiveTournamentBalance = function(tournamentId, customerId) {
console.log('updateActiveTournamentBalance() called');
			var getTournamentPromise = tournamentMgmt.getTournament(tournamentId);
			getTournamentPromise.then(function(tournamentData) {
console.log('getTournamentPromise called');
				$scope.activeTournamentCredits = tournamentData.name +' Credits: 0';
				tournamentData.customers.forEach(function(customer) {
					if(customer.customerId === customerId) {
						$scope.activeTournamentCredits = tournamentData.name +' Credits: '+customer.credits;
					}
				});
			});
		}

		var getTournamentsByDatePromise = tournamentMgmt.getTournamentsByDate(todayDate);
		getTournamentsByDatePromise.then(function(currentTournamentsData) {
console.log('getTournamentsByDatePromise called');
			$scope.currentTournaments = currentTournamentsData;
		});

		var getTrdsByDatePromise = trdMgmt.getTrdsByDate(todayDate);
		getTrdsByDatePromise.then(function(trdsData) {
console.log('getTrdsByDatePromise called');
			$scope.trdData = trdsData;
		});

		var getSessionPromise = customerMgmt.getSession();
		getSessionPromise.then(function(sessionData) {
console.log('getSessionPromise called');

			if(sessionData.customerId) {
				$rootScope.customerId = sessionData.customerId;
				$scope.customerId = $rootScope.customerId;
				$scope.showLogin = false;
				$scope.showSignup = false;
				$scope.showLogout = true;

				var getCustomerPromise = customerMgmt.getCustomer($scope.customerId);
				getCustomerPromise.then(function(customer) {
console.log('getCustomerPromise called');
					$scope.customer = customer;
				});

			} else {
				$scope.showLogin = true;
				$scope.showSignup = true;
				$scope.showLogout = false;
			}

			var tournaments = [];
			$scope.currentTournaments.forEach(function(tournament) {
				var tournamentData = {};
				tournamentData.id = tournament.id;
				tournamentData.name = tournament.name;
				tournamentData.entryFee = tournament.entryFee;
				tournamentData.siteFee = tournament.siteFee;
				tournamentData.customersCount = tournament.customers.length;
				tournamentData.max = tournament.max;
				if(tournament.closed) {
					if(tournament.scored) {
						tournamentData.tournamentStatus = 'Final';
					} else {
						tournamentData.tournamentStatus = 'In Progress';
					}
				} else {
					if(tournament.customers.length == tournament.max) {
						tournamentData.tournamentStatus = 'Full';
					} else {
						tournamentData.tournamentStatus = 'Registering';
					}
				}
				tournaments.push(tournamentData);
			});
			$scope.tournamentsData = tournaments;

		});

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
		partMap['Daily Double'] = 1;
		partMap['Pick 3'] = 1;
		partMap['Pick 4'] = 1;
		partMap['Pick 5'] = 1;
		partMap['Pick 6'] = 1;
		partMap['Pick 7'] = 1;
		partMap['Pick 8'] = 1;
		partMap['Pick 9'] = 1;
		partMap['Pick 10'] = 1;

		var amountMap = [];
		amountMap[.1] = ['.10','.20','.50','1.00','2.00','3.00','4.00','5.00','6.00','10.00','20.00','50.00','100.00'];
		amountMap[.5] = ['.50','1.00','2.00','3.00','4.00','5.00','6.00','10.00','20.00','50.00','100.00'];
		amountMap[1] = ['1.00','2.00','3.00','4.00','5.00','6.00','10.00','20.00','50.00','100.00'];
		amountMap[2] = ['2.00','3.00','4.00','5.00','6.00','10.00','20.00','50.00','100.00'];

		$scope.showTrack = function(trackId) {
console.log('$scope.showTrack() called');
			$scope.trackShow = trackId;
			$scope.showTrackRace(trackId, 1, false);
		}

		$scope.showTrackRace = function(trackId, raceNum, override) {
console.log('$scope.showTrackRace() called');
			$scope.trdData.forEach(function(trd) {
				if(trd.id === trackId) {
					var trdRaceCount = trd.races.length;
					trd.races.forEach(function(race) {
						if(race.number == raceNum) {
							if(!race.closed || override) {
								$scope.race = race;
								$scope.raceNum = raceNum;
								$scope.trId = trackId+'-'+raceNum;
								$scope.showRaceWager(trackId, raceNum, 'Win', 2);
							} else {
								raceNum ++;
								if(raceNum > trdRaceCount) {
									override = true;
									$scope.showTrackRace(trackId, trdRaceCount, true);
								} else {
									$scope.showTrackRace(trackId, raceNum, false);
								}
							}
						}
					});
				}
			});
		}

		$scope.showLeg = function(legNum) {
console.log('$scope.showLeg() called');
			$scope.legShow = legNum;
		}

		$scope.showRaceWager = function(trackId, raceNumber, wager, min) {
console.log('$scope.showRaceWager() called');
			$scope.clearSelectedRunners();
			$scope.selectedWager = wager;
			$scope.wagerTmpl = wager;
			$scope.wager = wager;
			$scope.ticketCost = '';

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
				wagerRunners.push(race.entries);
			});

			$scope.legs = legMap[wager];
			$scope.parts = partMap[wager];

			$scope.singleDesc = wager;

			$scope.wagerRunners = wagerRunners;

			$scope.showLeg(1);

			$scope.amountOptions = {
				repeatSelect: null,
				availableOptions: amountMap[min]
			}

		}

		$scope.updateSelectedRunnersDisplay = function() {
console.log('$scope.updateSelectedRunnersDisplay() called');
			$scope.formattedRunners = '';
			$scope.ticketCost = '';
			$scope.multiplier = 1;
			if($scope.legs > 1) {
				var trIdPcs = $scope.trId.split('-');
				$scope.finalRaceId = trIdPcs[0] + '-' + (parseInt(trIdPcs[1]) + (parseInt($scope.legs) - 1));
				var trueLeg1Count = 1;
				if($scope.leg1Runners && ($scope.leg1Runners.length > 0)) {
					var first = true;
					$scope.leg1Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg1Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg1Count;
				} 
				$scope.formattedRunners += ' / ';
				var trueLeg2Count = 1;
				if($scope.leg2Runners && ($scope.leg2Runners.length > 0)) {
					var first = true;
					$scope.leg2Runners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners += runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								trueLeg2Count ++;
							}
						}
					});
					$scope.multiplier = $scope.multiplier * trueLeg2Count;
				}
				if($scope.legs > 2) {
					$scope.formattedRunners += ' / ';
					var trueLeg3Count = 1;
					if($scope.leg3Runners && ($scope.leg3Runners.length > 0)) {
						var first = true;
						$scope.leg3Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg3Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg3Count;
					} 
				}
				if($scope.legs > 3) {
					$scope.formattedRunners += ' / ';
					var trueLeg4Count = 1;
					if($scope.leg4Runners && ($scope.leg4Runners.length > 0)) {
						var first = true;
						$scope.leg4Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg4Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg4Count;
					} 
				}
				if($scope.legs > 4) {
					$scope.formattedRunners += ' / ';
					var trueLeg5Count = 1;
					if($scope.leg5Runners && ($scope.leg5Runners.length > 0)) {
						var first = true;
						$scope.leg5Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg5Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg5Count;
					} 
				}
				if($scope.legs > 5) {
					$scope.formattedRunners += ' / ';
					var trueLeg6Count = 1;
					if($scope.leg6Runners && ($scope.leg6Runners.length > 0)) {
						var first = true;
						$scope.leg6Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg6Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg6Count;
					} 
				}
				if($scope.legs > 6) {
					$scope.formattedRunners += ' / ';
					var trueLeg7Count = 1;
					if($scope.leg7Runners && ($scope.leg7Runners.length > 0)) {
						var first = true;
						$scope.leg7Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg7Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg7Count;
					} 
				}
				if($scope.legs > 7) {
					$scope.formattedRunners += ' / ';
					var trueLeg8Count = 1;
					if($scope.leg8Runners && ($scope.leg8Runners.length > 0)) {
						var first = true;
						$scope.leg8Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg8Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg8Count;
					} 
				}
				if($scope.legs > 8) {
					$scope.formattedRunners += ' / ';
					var trueLeg9Count = 1;
					if($scope.leg9Runners && ($scope.leg9Runners.length > 0)) {
						var first = true;
						$scope.leg9Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg9Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg9Count;
					} 
				}
				if($scope.legs > 9) {
					$scope.formattedRunners += ' / ';
					var trueLeg10Count = 1;
					if($scope.leg10Runners && ($scope.leg10Runners.length > 0)) {
						var first = true;
						$scope.leg10Runners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
									trueLeg10Count ++;
								}
							}
						});
						$scope.multiplier = $scope.multiplier * trueLeg10Count;
					} 
				}
				$scope.ticketCost = ($scope.multiplier * parseFloat($scope.wagerData.amount)).toFixed(2);
			} else {
				$scope.finalRaceId = $scope.trId;
				var firstRunnersTrueArray = [];
				var secondRunnersTrueArray = [];
				var thirdRunnersTrueArray = [];
				var fourthRunnersTrueArray = [];
				var fifthRunnersTrueArray = [];
				if(partMap[$scope.wager] > 1) {
					if($scope.firstRunners && ($scope.firstRunners.length > 0)) {
						var first = true;
						$scope.firstRunners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
								}
								firstRunnersTrueArray.push(runner);
							}
						});
					} 
					$scope.formattedRunners += ' / ';
					if($scope.secondRunners && ($scope.secondRunners.length > 0)) {
						var first = true;
						$scope.secondRunners.forEach(function(runner) {
							if(runner > 0) {
								if(first) {
									$scope.formattedRunners += runner;
									first = false;
								} else {
									$scope.formattedRunners += ',' + runner;
								}
								secondRunnersTrueArray.push(runner);
							}
						});
					}
					if(partMap[$scope.wager] > 2) {
						$scope.formattedRunners += ' / ';
						if($scope.thirdRunners && ($scope.thirdRunners.length > 0)) {
							var first = true;
							$scope.thirdRunners.forEach(function(runner) {
								if(runner > 0) {
									if(first) {
										$scope.formattedRunners += runner;
										first = false;
									} else {
										$scope.formattedRunners += ',' + runner;
									}
									thirdRunnersTrueArray.push(runner);
								}
							});
						}
					}
					if(partMap[$scope.wager] > 3) {
						$scope.formattedRunners += ' / ';
						if($scope.fourthRunners && ($scope.fourthRunners.length > 0)) {
							var first = true;
							$scope.fourthRunners.forEach(function(runner) {
								if(runner > 0) {
									if(first) {
										$scope.formattedRunners += runner;
										first = false;
									} else {
										$scope.formattedRunners += ',' + runner;
									}
									fourthRunnersTrueArray.push(runner);
								}
							});
						}
					}
					if(partMap[$scope.wager] > 4) {
						$scope.formattedRunners += ' / ';
						if($scope.fifthRunners && ($scope.fifthRunners.length > 0)) {
							var first = true;
							$scope.fifthRunners.forEach(function(runner) {
								if(runner > 0) {
									if(first) {
										$scope.formattedRunners += runner;
										first = false;
									} else {
										$scope.formattedRunners += ',' + runner;
									}
									fifthRunnersTrueArray.push(runner);
								}
							});
						}
					}
					var multiPartMultiplier = getMultiMulti(
						firstRunnersTrueArray,
						secondRunnersTrueArray,
						thirdRunnersTrueArray,
						fourthRunnersTrueArray,
						fifthRunnersTrueArray
					);
					if(!multiPartMultiplier) {
						multiPartMultiplier = 1;
					}
					if($scope.wagerData.amount) {
						$scope.ticketCost = (multiPartMultiplier * parseFloat($scope.wagerData.amount)).toFixed(2);
					} else {
						$scope.ticketCost = (multiPartMultiplier * 2).toFixed(2);
					}
				} else {
					// WPS
					var first = true;
					var selectedRunnerCount = 1;
					$scope.selectedRunners.forEach(function(runner) {
						if(runner > 0) {
							if(first) {
								$scope.formattedRunners = runner;
								first = false;
							} else {
								$scope.formattedRunners += ',' + runner;
								selectedRunnerCount ++;
							}
						}
					});
					if($scope.wagerData.amount) {
						$scope.ticketCost = (selectedRunnerCount * parseFloat($scope.wagerData.amount)).toFixed(2);
					} else {
						$scope.ticketCost = (selectedRunnerCount * 2).toFixed(2);
					}
				}
			}
		}

		var getMultiMulti = function(firsts, seconds, thirds, fourths, fifths) {
			var usedNumbers = [];
			var wagerCombos = [];
			var multiple = 0;

			if(
				firsts.length > 0 && 
				seconds.length > 0 &&
				thirds.length > 0 &&
				fourths.length > 0 &&
				fifths.length > 0 &&
				$scope.wager === 'Pentafecta' &&
				multiple < 1
				) {
				firsts.forEach(function(first) {
					usedNumbers.push(first);
					seconds.forEach(function(second) {
						if(usedNumbers.indexOf(second) < 0) {
							usedNumbers.push(second);
							thirds.forEach(function(third) {
								if(usedNumbers.indexOf(third) < 0) {
									usedNumbers.push(third);
									fourths.forEach(function(fourth) {
										if(usedNumbers.indexOf(fourth) < 0) {
											usedNumbers.push(fourth);
											fifths.forEach(function(fifth) {
												if(usedNumbers.indexOf(fifth) < 0) {
													multiple ++;
													usedNumbers = [usedNumbers[0], usedNumbers[1], usedNumbers[2], usedNumbers[3]];
												}
											});
											usedNumbers = [usedNumbers[0], usedNumbers[1], usedNumbers[2]];
										}
									});
									usedNumbers = [usedNumbers[0], usedNumbers[1]];
								}
							});
							usedNumbers = [usedNumbers[0]];
						}
					});
					usedNumbers = [];
				});
			}
			if(
				firsts.length > 0 && 
				seconds.length > 0 &&
				thirds.length > 0 &&
				fourths.length > 0 &&
				$scope.wager === 'Superfecta' &&
				multiple < 1
				) {
				firsts.forEach(function(first) {
					usedNumbers.push(first);
					seconds.forEach(function(second) {
						if(usedNumbers.indexOf(second) < 0) {
							usedNumbers.push(second);
							thirds.forEach(function(third) {
								if(usedNumbers.indexOf(third) < 0) {
									usedNumbers.push(third);
									fourths.forEach(function(fourth) {
										if(usedNumbers.indexOf(fourth) < 0) {
											multiple ++;
											usedNumbers = [usedNumbers[0], usedNumbers[1], usedNumbers[2]];
										}
									});
									usedNumbers = [usedNumbers[0], usedNumbers[1]];
								}
							});
							usedNumbers = [usedNumbers[0]];
						}
					});
					usedNumbers = [];
				});
			}
			if(
				firsts.length > 0 && 
				seconds.length > 0 &&
				thirds.length > 0 &&
				$scope.wager === 'Trifecta' &&
				multiple < 1
				) {
				firsts.forEach(function(first) {
					usedNumbers.push(first);
					seconds.forEach(function(second) {
						if(usedNumbers.indexOf(second) < 0) {
							usedNumbers.push(second);
							thirds.forEach(function(third) {
								if(usedNumbers.indexOf(third) < 0) {
									usedNumbers.push(third);
									multiple ++;
									usedNumbers = [usedNumbers[0], usedNumbers[1]];
								}
							});
							usedNumbers = [usedNumbers[0]];
						}
					});
					usedNumbers = [];
				});
			}
			if(
				firsts.length > 0 && 
				seconds.length > 0 &&
				$scope.wager === 'Exacta' &&
				multiple < 1
				) {
				firsts.forEach(function(first) {
					usedNumbers.push(first);
					seconds.forEach(function(second) {
						if(usedNumbers.indexOf(second) < 0) {
							multiple ++;
						}
					});
					usedNumbers = [];
				});
			}
			return multiple;
		}

		$scope.clearSelectedRunners = function() {
console.log('$scope.clearSelectedRunners() called');
			$scope.formattedRunners = '';
			$scope.selectedRunners = [];
			$scope.firstRunners = [];
			$scope.secondRunners = [];
			$scope.thirdRunners = [];
			$scope.fourthRunners = [];
			$scope.fifthRunners = [];
			$scope.leg1Runners = [];
			$scope.leg2Runners = [];
			$scope.leg3Runners = [];
			$scope.leg4Runners = [];
			$scope.leg5Runners = [];
			$scope.leg6Runners = [];
			$scope.leg7Runners = [];
			$scope.leg8Runners = [];
			$scope.leg9Runners = [];
			$scope.leg10Runners = [];
		}

		$scope.selectedRunners = [];
		$scope.firstRunners = [];
		$scope.secondRunners = [];
		$scope.thirdRunners = [];
		$scope.fourthRunners = [];
		$scope.fifthRunners = [];
		$scope.leg1Runners = [];
		$scope.leg2Runners = [];
		$scope.leg3Runners = [];
		$scope.leg4Runners = [];
		$scope.leg5Runners = [];
		$scope.leg6Runners = [];
		$scope.leg7Runners = [];
		$scope.leg8Runners = [];
		$scope.leg9Runners = [];
		$scope.leg10Runners = [];

		$scope.submitWager = function(activeTournamentId) {
console.log('$scope.submitWager() called');
			if(!$scope.customerId || !$scope.customer.id) {
				layoutMgmt.logIn();
			} else {
				var customerId = $scope.customerId || $scope.customer.id;
				var tournamentId = activeTournamentId;
				// wager schema
				var wagerSubmission = {
					tournamentId: tournamentId,
					customerId: customerId,
					trackRaceId: $scope.trId,
					finalRaceId: $scope.finalRaceId,
					wagerPool: $scope.wager,
					legs: $scope.legs,
					parts: $scope.parts,
					wagerSelections: $scope.formattedRunners,
					wagerAmount: $scope.wagerData.amount,
					wagerTotal: $scope.ticketCost
				}
				wagerMgmt.submitWager(wagerSubmission).then(function(response) {
					$scope.tabShow = 'wagerResponse';
					if(response.data.success) { 
						$scope.successfulWager = response.data.confirmedWager;
						$scope.wagerError = '';
						updateActiveTournamentBalance(tournamentId, customerId);
					} else {
						if(response.data.failMsg === 'Incomplete Wager Data') {
							$scope.successfulWager = '';
							$scope.wagerError = 'General Wager Error - Please Refresh Your Browser';
							if(response.data.missingPcs.length < 2 && response.data.missingPcs.indexOf('wagerAmount') >=0) {
								$scope.wagerError = 'Please Select a Wager Amount';
							}
						} else {
							$scope.wagerError = response.data.failMsg;
						}
					}
				});
			}
		}

		$scope.cancelWager = function(wagerId) {
console.log('$scope.cancelWager() called');
			if(!$scope.customerId) {
				layoutMgmt.logIn();
			} else {
				var cancelWagerPromise = wagerMgmt.cancelWager(wagerId);
				cancelWagerPromise.then(function(response) {
console.log('cancelWagerPromise called');
					$scope.tabShow = 'wagerResponse';
					$scope.successfulWager = response[0];
					var tournamentId = $scope.successfulWager.tournamentId;
					var customerId = $scope.successfulWager.customerId;
					updateActiveTournamentBalance(tournamentId, customerId);
				});
			}
		}

		$scope.scoreRace = function(trdId, raceNum) {
			$window.location.href = location.origin + "/app/scoreRace/" + trdId + '-' + raceNum;
		};

		$scope.showHistory = function() {
console.log('$scope.showHistory() called');
			if(!$scope.customerId && !$scope.customer) {
				layoutMgmt.logIn();
			} else {
				$scope.tabShow = 'wagerHistory';
				var customerId = $scope.customerId || $scope.customer.id;
				var dateObj = new Date();
				var ms = dateObj.getTime();
				var msPerDay = 86400000;
				var todayMill = ((ms - (ms % msPerDay)) - 64800000);
				var params = customerId + '-' + todayMill;
				var getWagersByCustomerIdSinceMillisecondsPromise = wagerMgmt.getWagersByCustomerIdSinceMilliseconds(params);
				getWagersByCustomerIdSinceMillisecondsPromise.then(function(wagerHistory) {
console.log('getWagersByCustomerIdSinceMillisecondsPromise called');
					var formattedHistory = [];
					wagerHistory.forEach(function(wager) {
						var formattedWager = {};
						formattedWager.id = wager.id;
						formattedWager.date = wager.createdAt.substr(0,10) +' '+wager.createdAt.substr(11,8);
						formattedWager.track = wager.track;
						var trIdPcs = wager.trackRaceId.split('-');
						var trackId = trIdPcs[0];
						var raceNumber = trIdPcs[1];
						var getTrdPromise = trdMgmt.getTrd(trackId);
						getTrdPromise.then(function(trdData) {
console.log('getTrdPromise called');
							formattedWager.race = trdData.name.substr(0,3) +'-'+ raceNumber;
						});
						formattedWager.amount = wager.wagerAmount;
						formattedWager.type = wager.abbrev;
						formattedWager.selection = wager.wagerSelections;
						formattedWager.total = wager.wagerTotal;
						var result;
						if(wager.scored) {
							result = wager.result.toFixed(2);
						} else {
							if(wager.cancelled) {
								result = 'C';
							} else {
								if(wager.raceClosed) {
									result = 'Pending';
								} else {
									result = 'Cancel';
								}
							}
						}
						formattedWager.result = result;
						formattedHistory.push(formattedWager);
					});
					if($scope.wagerHistory && $scope.wagerHistory.length > 0) {
						$scope.wagerHistory = formattedHistory;
					}	else {
						$scope.wagerHistory = [{race: 'No Wagers'}];
					}
				});
			}
		};

		$scope.showHorseCenter = function() {
			$scope.leaderboardsShow = false;
			$scope.tournamentsShow = false;
			$scope.horseCenterShow = true;
			$scope.showTournament = false;
			$scope.showLeaders = false;
		};

		$scope.showLeaderboards = function() {
			$scope.horseCenterShow = false;
			$scope.tournamentsShow = false;
			$scope.leaderboardsShow = true;
			$scope.showTournament = false;
			$scope.showLeaders = false;
		};

		$scope.showTournaments = function() {
			$scope.horseCenterShow = false;
			$scope.leaderboardsShow = false;
			$scope.tournamentsShow = true;
			$scope.showTournament = false;
			$scope.showLeaders = false;
		};

		$scope.showConfirmation = function() {
			if(!$scope.customerId) {
				layoutMgmt.logIn();
			} else {
				$scope.tabShow === 'wagerResponse';
			}
		};

		$scope.closeRace = function(trdId, raceNum) {
			$scope.trdData.forEach(function(trd) {
				if(trd.id === trdId) {
					var newTrdData = trd;
					newTrdData.races.forEach(function(race) {
						if(race.number == raceNum) {
							race.closed = true;
						}
					});
					var updateTrdDataPromise = trdMgmt.updateTrd(newTrdData);
					updateTrdDataPromise.then(function(updateTrdDataPromiseResponse) {
						var closeWagersPromise = wagerMgmt.closeWagers(trdId+'-'+raceNum);
						closeWagersPromise.then(function(closeWagersPromiseResponse) {
							$window.location.href = location.origin + "/app/";
						});
					});
				}
			});
		};

		$scope.showResults = function(trdId, raceNum) {
console.log('$scope.showResults() called with trdId: '+trdId+' and race number: '+raceNum);
		}

		$scope.showTournamentDetails = function(tournyId) {
console.log('$scope.showTournamentDetails() called');
			var getTournamentPromise = tournamentMgmt.getTournament(tournyId);
			getTournamentPromise.then(function(tournamentData) {
console.log('getTournamentPromise called');
				$scope.tournamentData = tournamentData;
			});
			if(!$scope.showLeaders) {
				$scope.showTournament = true;
			}
		}

		$scope.showTournamentLeaders = function(tournyId) {
console.log('$scope.showTournamentLeaders() called');
			$scope.showLeaders = true;
			var getLeadersPromise = tournamentMgmt.getLeaders(tournyId);
			getLeadersPromise.then(function(leadersData) {
console.log('getLeadersPromise called');
				$scope.tournamentLeadersDataTournamentName = leadersData[leadersData.length - 1];
				leadersData.pop();
				var leaderBoardData = [];
				leadersData.forEach(function(leader) {
					var getCustomerPromise = customerMgmt.getCustomer(leader.customerId);
					getCustomerPromise.then(function(customerData) {
console.log('getCustomerPromise called');
						var thisLeader = {};
						thisLeader.id = leader.customerId;
						thisLeader.fName = customerData.fName;
						thisLeader.lName = customerData.lName;
						thisLeader.city = customerData.city;
						thisLeader.username = customerData.username;
						thisLeader.credits = leader.credits;
						leaderBoardData.push(thisLeader);
					});
				});
				$scope.leadersData = leaderBoardData;
			});
			$scope.showTournamentDetails(tournyId);
		}

		$scope.tournamentRegister = function(tournyId) {
console.log('$scope.tournamentRegister() called');
// TODO debug this, including handling errors
			if(!$scope.customerId) {
				layoutMgmt.logIn();
			} else {
				var registerTournamentPromise = tournamentMgmt.registerTournament(tournyId, $scope.customerId);
				registerTournamentPromise.then(function(response) {
console.log('response.data:');
console.log(response.data);
				});
			}
		}

		if($scope.customerId) {
			$scope.showHistory();
		} else {
			$scope.wagerHistory = [{race: 'No Wagers'}];
			$scope.tabShow = 'wagerHistory';
		}

		$scope.setActiveTournament = function(tournament) {
console.log('$scope.setActiveTournament() called');
			if($scope.customerId || ($scope.customer && $scope.customer.id)) {
				var customerId = $scope.customerId || $scope.customer.id;
				tournament.customers.forEach(function(customer) {
					if(customer.customerId === customerId) {
						updateActiveTournamentBalance(tournament.id, customerId);
					}
				});
			} else {
				$scope.activeTournamentCredits = 'Not Registered for '+tournament.name;
			}
			$scope.showTrack(tournament.assocTrackId);
			$scope.activeTournamentId = tournament.id;
		}

	}
}());
