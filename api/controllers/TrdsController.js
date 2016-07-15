/**
 * TrdController
 *
 * @description :: Server-side logic for managing trds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  datatables: function(req, res) {
    var options = req.query;

    Trds.datatables(options).sort({name: 'asc'}).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  },

	toValidate: function(req, res) {
		var trId = req;
		Trds.find({id: trId}).then(function(result) {
//			res.send(result[0]);
			res.send(JSON.stringify(44));
		}).catch(function(err) {
      return ({error: 'Server error'});
      console.error(err);
      throw err;
		});
	},

	byDate: function(req, res) {
		Trds.find({raceDate: req.params.id}).sort({name: 'asc'}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	score: function(req, res) {
		if(req.body && req.body.trdData && req.body.trdData.id && req.body.customerId && req.body.customerId === '5765aec37e7e6e33c9203f4d') {
			return scoreRace(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid Score Data'}));
		}
	}
	
};

function scoreRace(req, res, self) {
	var trdData = req.body.trdData;
	var trId = req.body.trId;
	var raceNum = req.body.raceNum;
	var finalRaceId = trId +'-'+ raceNum;
	var scoreData;
	trdData.races.forEach(function(race) {
		if(parseInt(race.number) == parseInt(raceNum)) {
			scoreData = race.score;
		}
	});
	return Trds.update({id: trdData.id}, {races: trdData.races}, false, false).then(function(scoredData) {
		var affectedCustomerIds = [];
		return TrdsService.getTournamentId(trdData.id).then(function(tournamentIdData) {
			affectedCustomerIds.push(tournamentIdData.tournamentId);
			return TrdsService.getAffectedWagers(finalRaceId).then(function(affectedWagers) {
				affectedWagers.forEach(function(wager) {
					if(affectedCustomerIds.indexOf(wager.customerId) < 0) {
						affectedCustomerIds.push(wager.customerId);
					}
					var result = parseInt(0);
					if(wager.wagerPool === 'Win') {
console.log('evaluating win');
						if(wager.wagerSelections.length > 1) {
							var wagerSelections = wager.wagerSelections.split(',');
							if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.firstWinPrice);
							}
						} else {
							if(wager.wagerSelections.toString() === scoreData.firstNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.firstWinPrice);
							}
						}
					}
					if(wager.wagerPool === 'Place') {
console.log('evaluating place');
						if(wager.wagerSelections.length > 1) {
							var wagerSelections = wager.wagerSelections.split(',');
							if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
							}
							if(wagerSelections.indexOf(scoreData.secondNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
							}
						} else {
							if(wager.wagerSelections.toString() === scoreData.firstNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
							}
							if(wager.wagerSelections.toString() === scoreData.secondNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
							}
						}
					}
					if(wager.wagerPool === 'Show') {
console.log('evaluating show');
						if(wager.wagerSelections.length > 1) {
							var wagerSelections = wager.wagerSelections.split(',');
							if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.firstShowPrice);
							}
							if(wagerSelections.indexOf(scoreData.secondNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.secondShowPrice);
							}
							if(wagerSelections.indexOf(scoreData.thirdNumber) > -1) {
								result += ((wager.wagerAmount / 2) * scoreData.thirdShowPrice);
							}
						} else {
							if(wager.wagerSelections.toString() === scoreData.firstNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
							}
							if(wager.wagerSelections.toString() === scoreData.secondNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
							}
							if(wager.wagerSelections.toString() === scoreData.thirdNumber) {
								result += ((wager.wagerAmount / 2) * scoreData.thirdShowPrice);
							}
						}
					}
					if(wager.wagerPool === 'Exacta') {
console.log('evaluating exacta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var firstCorrect = false;
						var secondCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								result += ((wager.wagerAmount / 2) * scoreData.exactaPrice);
console.log('result: '+result);
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Trifecta') {
console.log('evaluating trifecta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								if(thirdRunners.length > 1) {
									var thirdRunnersPcs = thirdRunners.split(',');
									if(thirdRunnersPcs.indexOf(scoreData.thirdNumber) > -1) {
										thirdCorrect = true;
									}
								} else {
									if(thirdRunners.toString() === scoreData.thirdNumber) {
										thirdCorrect = true;
									}
								}
								if(thirdCorrect) {
									result += ((wager.wagerAmount / 2) * scoreData.trifectaPrice);
console.log('result: '+result);
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Superfecta') {
console.log('evaluating superecta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var fourthRunners = wsPcs[3];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var fourthCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								if(thirdRunners.length > 1) {
									var thirdRunnersPcs = thirdRunners.split(',');
									if(thirdRunnersPcs.indexOf(scoreData.thirdNumber) > -1) {
										thirdCorrect = true;
									}
								} else {
									if(thirdRunners.toString() === scoreData.thirdNumber) {
										thirdCorrect = true;
									}
								}
								if(thirdCorrect) {
									if(fourthRunners.length > 1) {
										var fourthRunnersPcs = fourthRunners.split(',');
										if(fourthRunnersPcs.indexOf(scoreData.fourthNumber) > -1) {
											fourthCorrect = true;
										}
									} else {
										if(fourthRunners.toString() === scoreData.fourthNumber) {
											fourthCorrect = true;
										}
									}
									if(fourthCorrect) {
										result += ((wager.wagerAmount / 2) * scoreData.superfectaPrice);
console.log('result: '+result);
									} else {
console.log('fourth NOT correct');
									}
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Pentafecta') {
console.log('evaluating pentafecta');
						var wsPcs = wager.wagerSelections.split(' / ');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var fourthRunners = wsPcs[3];
						var fifthRunners = wsPcs[4];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var fifthCorrect = false;
						if(firstRunners.length > 1) {
							var firstRunnersPcs = firstRunners.split(',');
							if(firstRunnersPcs.indexOf(scoreData.firstNumber) > -1) {
								firstCorrect = true;
							}
						} else {
							if(firstRunners.toString() === scoreData.firstNumber) {
								firstCorrect = true;
							}
						}
						if(firstCorrect) {
							if(secondRunners.length > 1) {
								var secondRunnersPcs = secondRunners.split(',');
								if(secondRunnersPcs.indexOf(scoreData.secondNumber) > -1) {
									secondCorrect = true;
								}
							} else {
								if(secondRunners.toString() === scoreData.secondNumber) {
									secondCorrect = true;
								}
							}
							if(secondCorrect) {
								if(thirdRunners.length > 1) {
									var thirdRunnersPcs = thirdRunners.split(',');
									if(thirdRunnersPcs.indexOf(scoreData.thirdNumber) > -1) {
										thirdCorrect = true;
									}
								} else {
									if(thirdRunners.toString() === scoreData.thirdNumber) {
										thirdCorrect = true;
									}
								}
								if(thirdCorrect) {
									if(fourthRunners.length > 1) {
										var fourthRunnersPcs = fourthRunners.split(',');
										if(fourthRunnersPcs.indexOf(scoreData.fourthNumber) > -1) {
											fourthCorrect = true;
										}
									} else {
										if(fourthRunners.toString() === scoreData.fourthNumber) {
											fourthCorrect = true;
										}
									}
									if(fourthCorrect) {
										if(fifthRunners.length > 1) {
											var fifthRunnersPcs = fifthRunners.split(',');
											if(fifthRunnersPcs.indexOf(scoreData.fifthNumber) > -1) {
												fifthCorrect = true;
											}
										} else {
											if(fifthRunners.toString() === scoreData.fifthNumber) {
												fifthCorrect = true;
											}
										}
										if(fifthCorrect) {
											result += ((wager.wagerAmount / 2) * scoreData.pentafectaPrice);
console.log('result: '+result);
										} else {
console.log('fifth NOT correct');
										}
									} else {
console.log('fourth NOT correct');
									}
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Daily Double') {
console.log('evaluating dd');
						var wsPcs = wager.wagerSelections.split(' / ');
						var ddPcs = scoreData.dailyDouble.split('/');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var firstWinners = ddPcs[0];
						var secondWinners = ddPcs[1];
						var firstCorrect = false;
						var secondCorrect = false;
						var firstRunnersArray = firstRunners.split(',');
						var secondRunnersArray = secondRunners.split(',');
						var firstWinnersArray = firstWinners.split(',');
						var secondWinnersArray = secondWinners.split(',');
						firstWinnersArray.forEach(function(firstWinner) {
							firstRunnersArray.forEach(function(firstRunner) {
								if(firstWinner.toString() === firstRunner.toString()) {
									firstCorrect = true;
								}
							});
						});
						if(firstCorrect) {
							secondWinnersArray.forEach(function(secondWinner) {
								secondRunnersArray.forEach(function(secondRunner) {
									if(secondWinner.toString() === secondRunner.toString()) {
										secondCorrect = true;
									}
								});
							});
							if(secondCorrect) {
								result += ((wager.wagerAmount / 2) * scoreData.dailyDoublePrice);
console.log('result: '+result);
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Pick 3') {
console.log('evaluating p3');
						var wsPcs = wager.wagerSelections.split(' / ');
						var p3Pcs = scoreData.pick3.split('/');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var firstWinners = p3Pcs[0];
						var secondWinners = p3Pcs[1];
						var thirdWinners = p3Pcs[2];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var firstRunnersArray = firstRunners.split(',');
						var secondRunnersArray = secondRunners.split(',');
						var thirdRunnersArray = thirdRunners.split(',');
						var firstWinnersArray = firstWinners.split(',');
						var secondWinnersArray = secondWinners.split(',');
						var thirdWinnersArray = thirdWinners.split(',');
						firstWinnersArray.forEach(function(firstWinner) {
							firstRunnersArray.forEach(function(firstRunner) {
								if(firstWinner.toString() === firstRunner.toString()) {
									firstCorrect = true;
								}
							});
						});
						if(firstCorrect) {
							secondWinnersArray.forEach(function(secondWinner) {
								secondRunnersArray.forEach(function(secondRunner) {
									if(secondWinner.toString() === secondRunner.toString()) {
										secondCorrect = true;
									}
								});
							});
							if(secondCorrect) {
								thirdWinnersArray.forEach(function(thirdWinner) {
									thirdRunnersArray.forEach(function(thirdRunner) {
										if(thirdWinner.toString() === thirdRunner.toString()) {
											thirdCorrect = true;
										}
									});
								});
								if(thirdCorrect) {
									result += ((wager.wagerAmount / 2) * scoreData.pick3Price);
console.log('result: '+result);
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Pick 4') {
console.log('evaluating p4');
						var wsPcs = wager.wagerSelections.split(' / ');
						var p4Pcs = scoreData.pick4.split('/');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var fourthRunners = wsPcs[2];
						var firstWinners = p4Pcs[0];
						var secondWinners = p4Pcs[1];
						var thirdWinners = p4Pcs[2];
						var fourthWinners = p4Pcs[2];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var fourthCorrect = false;
						var firstRunnersArray = firstRunners.split(',');
						var secondRunnersArray = secondRunners.split(',');
						var thirdRunnersArray = thirdRunners.split(',');
						var fourthRunnersArray = fourthRunners.split(',');
						var firstWinnersArray = firstWinners.split(',');
						var secondWinnersArray = secondWinners.split(',');
						var thirdWinnersArray = thirdWinners.split(',');
						var fourthWinnersArray = fourthWinners.split(',');
						firstWinnersArray.forEach(function(firstWinner) {
							firstRunnersArray.forEach(function(firstRunner) {
								if(firstWinner.toString() === firstRunner.toString()) {
									firstCorrect = true;
								}
							});
						});
						if(firstCorrect) {
							secondWinnersArray.forEach(function(secondWinner) {
								secondRunnersArray.forEach(function(secondRunner) {
									if(secondWinner.toString() === secondRunner.toString()) {
										secondCorrect = true;
									}
								});
							});
							if(secondCorrect) {
								thirdWinnersArray.forEach(function(thirdWinner) {
									thirdRunnersArray.forEach(function(thirdRunner) {
										if(thirdWinner.toString() === thirdRunner.toString()) {
											thirdCorrect = true;
										}
									});
								});
								if(thirdCorrect) {
									fourthWinnersArray.forEach(function(fourthWinner) {
										fourthRunnersArray.forEach(function(fourthRunner) {
											if(fourthWinner.toString() === fourthRunner.toString()) {
												fourthCorrect = true;
											}
										});
									});
									if(fourthCorrect) {
										result += ((wager.wagerAmount / 2) * scoreData.pick4Price);
console.log('result: '+result);
									} else {
console.log('fourth NOT correct');
									}
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
					if(wager.wagerPool === 'Pick 5') {
console.log('evaluating p5');
						var wsPcs = wager.wagerSelections.split(' / ');
						var p5Pcs = scoreData.pick5.split('/');
						var firstRunners = wsPcs[0];
						var secondRunners = wsPcs[1];
						var thirdRunners = wsPcs[2];
						var fourthRunners = wsPcs[2];
						var fifthRunners = wsPcs[2];
						var firstWinners = p5Pcs[0];
						var secondWinners = p5Pcs[1];
						var thirdWinners = p5Pcs[2];
						var fourthWinners = p5Pcs[2];
						var fifthWinners = p5Pcs[2];
						var firstCorrect = false;
						var secondCorrect = false;
						var thirdCorrect = false;
						var fourthCorrect = false;
						var fifthCorrect = false;
						var firstRunnersArray = firstRunners.split(',');
						var secondRunnersArray = secondRunners.split(',');
						var thirdRunnersArray = thirdRunners.split(',');
						var fourthRunnersArray = fourthRunners.split(',');
						var fifthRunnersArray = fifthRunners.split(',');
						var firstWinnersArray = firstWinners.split(',');
						var secondWinnersArray = secondWinners.split(',');
						var thirdWinnersArray = thirdWinners.split(',');
						var fourthWinnersArray = fourthWinners.split(',');
						var fifthWinnersArray = fifthWinners.split(',');
						firstWinnersArray.forEach(function(firstWinner) {
							firstRunnersArray.forEach(function(firstRunner) {
								if(firstWinner.toString() === firstRunner.toString()) {
									firstCorrect = true;
								}
							});
						});
						if(firstCorrect) {
							secondWinnersArray.forEach(function(secondWinner) {
								secondRunnersArray.forEach(function(secondRunner) {
									if(secondWinner.toString() === secondRunner.toString()) {
										secondCorrect = true;
									}
								});
							});
							if(secondCorrect) {
								thirdWinnersArray.forEach(function(thirdWinner) {
									thirdRunnersArray.forEach(function(thirdRunner) {
										if(thirdWinner.toString() === thirdRunner.toString()) {
											thirdCorrect = true;
										}
									});
								});
								if(thirdCorrect) {
									fourthWinnersArray.forEach(function(fourthWinner) {
										fourthRunnersArray.forEach(function(fourthRunner) {
											if(fourthWinner.toString() === fourthRunner.toString()) {
												fourthCorrect = true;
											}
										});
									});
									if(fourthCorrect) {
										fifthWinnersArray.forEach(function(fifthWinner) {
											fifthRunnersArray.forEach(function(fifthRunner) {
												if(fifthWinner.toString() === fifthRunner.toString()) {
													fifthCorrect = true;
												}
											});
										});
										if(fifthCorrect) {
											result += ((wager.wagerAmount / 2) * scoreData.pick5Price);
console.log('result: '+result);
										} else {
console.log('fifth NOT correct');
										}
									} else {
console.log('fourth NOT correct');
									}
								} else {
console.log('third NOT correct');
								}
							} else {
console.log('second NOT correct');
							}
						} else {
console.log('first NOT correct');
						}
					}
// TODO P6, P7, P8, P9, P10
					TrdsService.scoreWager(wager.id, result).then(function(updateWagerResponse) {
						if(!updateWagerResponse.success) {
console.log('updateWagerResponse error:');
console.log(updateWagerResponse.err);
						}
					});
				});
				return res.send(JSON.stringify({success: true, acIds: affectedCustomerIds}));
			});
		});
		
	//	res.send(JSON.stringify(results));
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}



