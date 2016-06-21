/**
 * WagersController
 *
 * @description :: Server-side logic for managing wagers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Promise = require('bluebird');
var serverError = 'An error occurred. Please try again later.';
var httpAdapter = 'http';

var trdsController = require('./TrdsController');

module.exports = {
  submitWager: function(req, res) {
    var isAjax = req.headers.accept.match(/application\/json/);
    var completeWager = true;
    var missingPcs = [];

		if(req.body) {
			if(!req.body.customerId) {
				completeWager = false;
				missingPcs.push('customerId');
			}
			if(!req.body.trackRaceId) {
				completeWager = false;
				missingPcs.push('trackRaceId');
			}
			if(!req.body.finalRaceId) {
				completeWager = false;
				missingPcs.push('finalRaceId');
			}
			if(!req.body.wagerPool) {
				completeWager = false;
				missingPcs.push('wagerPool');
			}
			if(!req.body.legs) {
				completeWager = false;
				missingPcs.push('legs');
			}
			if(!req.body.parts) {
				completeWager = false;
				missingPcs.push('parts');
			}
			if(!req.body.wagerSelections) {
				completeWager = false;
				missingPcs.push('wagerSelections');
			}
			if(!req.body.wagerAmount) {
				completeWager = false;
				missingPcs.push('wagerAmount');
			}
			if(!req.body.wagerTotal) {
				completeWager = false;
				missingPcs.push('wagerTotal');
			}

			if(completeWager) {
				return validateWager(req, res);
			} else {
console.log('missingPcs:');
console.log(missingPcs);
				return res.send(JSON.stringify({success: false, failMsg: 'Incomplete Wager Data', missingPcs: missingPcs}));
			}
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'General Wager Data Error'}));
		}
  },

  addNewWager: function(req, res) {
console.log('WagersControllerAPI.addNewWager() called with:');
console.log(req);
//		Wagers.insert({req.body}).then(function(result) {
//			res.send(JSON.stringify(result));
//		}).catch(function(err) {
//      res.json({error: 'Server error'}, 500);
//      console.error(err);
//      throw err;
//		});
  },

  cancelWager: function(req, res) {
		Wagers.remove({id: req.params.id}).then(function(result) {
			res.send(JSON.stringify(result));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
  },

	byCustomerId: function(req, res) {
		Wagers.find({username: req.params.id}).sort({
			created: 'asc'
		}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byTrackRaceId: function(req, res) {
		Wagers.find({trId: req.params.wagerData.trackRaceId}).sort({
			updated: 'asc'
		}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byFinalRaceId: function(req, res) {
		Wagers.find({trId: req.params.wagerData.finalRaceId}).sort({
			updated: 'asc'
		}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Wagers.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  },
	
  welcomed: function(req, res) {
    req.session.welcomed = true;
		res.send({'welcome': true});
  }
};

function validateWager(req, res, self) {
	var wagerData = req.body;
	var trIdPcs = wagerData.trackRaceId.split('-');
  return WagersService.getTrd(trIdPcs[0]).then(function(trackData) {
    if(! trackData) {
			console.log('trackData ajax failed in WagerController-validateWager() for trackRaceId '+wagerData.trackRaceId);
			// TODO: what should this return?
	 		return errorHandler(trdsError)();
		}

		var validStartingRace = false;

		trackData.trd.races.forEach(function(race) {
			if(race.number == trIdPcs[1]) {
				validStartingRace = true;
				var validWagerPool = false;
				var validWager = true;
				var wagerMin = 2;
				race.wagers.forEach(function(wager) {
					if(wagerData.wagerPool == wager.wager) {
						validWagerPool = true;
						wagerMin = wager.min;
					} 
				});
				if(!validWagerPool) {
					validWager = false;
console.log('Invalid Wager Pool');
					return res.send(JSON.stringify({success: false, failMsg: 'Invalid Wager Pool'}));
				} 
				if(parseFloat(wagerData.wagerAmount) < wagerMin) {
					validWager = false;
console.log('Invalid Wager Amount');
					return res.send(JSON.stringify({success: false, failMsg: 'Invalid Wager Amount'}));
				}
				return WagersService.getCustomerBalance(wagerData.customerId).then(function(balanceData) {
					if(balanceData.balance < wagerData.wagerTotal) {
						validWager = false;
console.log('Insufficient Customer Balance');
						return res.send(JSON.stringify({success: false, failMsg: 'Insufficient Customer Balance'}));
					} else {
						if(wagerData.legs > 1) {

							// multi-leg
console.log('validating multi-leg');

							var wsPcsCounter = 0;
							var wsPcs = wagerData.wagerSelections.split(' / ');
							var raceCounter = trIdPcs[1];
							if(wagerData.legs != wsPcs.length) {
								validWager = false;
								return res.send(JSON.stringify({success: false, failMsg: 'Missing Leg Runner'}));
							}
							wsPcs.forEach(function(wsPc) {
								if(wsPc.length < 1) {
									validWager = false;
									return res.send(JSON.stringify({success: false, failMsg: 'Missing Leg Runner'}));
								}
							});
							while(raceCounter < (parseInt(trIdPcs[1]) + wsPcs.length)) {
								trackData.trd.races.forEach(function(race) {
									if(race.number == raceCounter) {
										var raceRunners = wsPcs[wsPcsCounter];
										var rrPcs = raceRunners.split(',');
										rrPcs.forEach(function(rr) {
											race.entries.forEach(function(entry) {
												if(entry.number == parseInt(rr)) {
													if(!entry.active) {
														validWager = false;
														return res.send(JSON.stringify({success: false, failMsg: 'Invalid Runner'}));
													}
												}
											});
										});
										wsPcsCounter ++;
									}
								});
								raceCounter++;
							}
							if(validWager) {
console.log('appears to be a valid multi-leg wager');
								return WagersService.updateCustomerBalance(wagerData.customerId, balanceData.balance, wagerData.wagerTotal).then(function(customerData) {
									if(customerData.success) {
										return Wagers.create(wagerData).then(function(confirmedWagerData) {
											return res.send(JSON.stringify({success: true, confirmedWager: confirmedWagerData}));
										}).catch(function(err) {
											res.json({error: 'Server error'}, 500);
											console.error(err);
											throw err;
										});
									}
									return res.send(JSON.stringify({success: false, failMsg: 'Customer Balance Error'}));
								}).catch(function(err) {
									res.json({error: 'Server error'}, 500);
									console.error(err);
									throw err;
								});
							} else {
console.log('appears to be an INVALID multi-leg wager');
							}
						} else {
							var allUsedNumbers = [];
							if(wagerData.parts < 2) {

							// wps 
console.log('validating wps');

								if(typeof wagerData.wagerSelections === 'number') {
									allUsedNumbers.push(wagerData.wagerSelections);
								} else {
									var wsPcs = wagerData.wagerSelections.split(',');
									// [ '2', '3,6,7', '1,3,6,7' ]
									wsPcs.forEach(function(number) {
										if(allUsedNumbers.indexOf(number) < 0) {
											allUsedNumbers.push(number);
										}
									});
								}
								race.entries.forEach(function(entry) {
									allUsedNumbers.forEach(function(number) {
										if(parseInt(number) == entry.number) {
											if(!entry.active) {
												validWager = false;
												return res.send(JSON.stringify({success: false, failMsg: 'Invalid Runner'}));
											}
										}
									});
								});
								if(validWager) {
console.log('appears to be a valid wps wager');
									return WagersService.updateCustomerBalance(wagerData.customerId, balanceData.balance, wagerData.wagerTotal).then(function(customerData) {
										if(customerData.success) {
											return Wagers.create(wagerData).then(function(confirmedWagerData) {
												return res.send(JSON.stringify({success: true, confirmedWager: confirmedWagerData}));
											}).catch(function(err) {
												res.json({error: 'Server error'}, 500);
												console.error(err);
												throw err;
											});
										}
										return res.send(JSON.stringify({success: false, failMsg: 'Customer Balance Error'}));
									}).catch(function(err) {
										res.json({error: 'Server error'}, 500);
										console.error(err);
										throw err;
									});
								} else {
console.log('appears to be an INVALID wps wager');
								}
							} else {

							// multi-part 
console.log('validating multi-part');

								var wsPcs = wagerData.wagerSelections.split(' / ');
								// [ '2', '3,6,7', '1,3,6,7' ]
								if(wsPcs.length != wagerData.parts) {
									validWager = false;
									return res.send(JSON.stringify({success: false, failMsg: 'Missing Part Runner'}));
								}
								wsPcs.forEach(function(wsPc) {
									if(wsPc.length < 1) {
										validWager = false;
										return res.send(JSON.stringify({success: false, failMsg: 'Missing Part Runner'}));
									} else {
										wsPcs.forEach(function(number) {
											if(allUsedNumbers.indexOf(number) < 0) {
												allUsedNumbers.push(number);
											}
										});
									}
								});
								race.entries.forEach(function(entry) {
									allUsedNumbers.forEach(function(number) {
										if(parseInt(number) == entry.number) {
											if(!entry.active) {
												validWager = false;
												return res.send(JSON.stringify({success: false, failMsg: 'Invalid Runner'}));
											}
										}
									});
								});
								if(validWager) {
console.log('appears to be a valid multi-part wager');
									return WagersService.updateCustomerBalance(wagerData.customerId, balanceData.balance, wagerData.wagerTotal).then(function(customerData) {
										if(customerData.success) {
											return Wagers.create(wagerData).then(function(confirmedWagerData) {
												return res.send(JSON.stringify({success: true, confirmedWager: confirmedWagerData}));
											}).catch(function(err) {
												res.json({error: 'Server error'}, 500);
												console.error(err);
												throw err;
											});
										}
										return res.send(JSON.stringify({success: false, failMsg: 'Customer Balance Error'}));
									}).catch(function(err) {
										res.json({error: 'Server error'}, 500);
										console.error(err);
										throw err;
									});
								} else {
console.log('appears to be an INVALID multi-part wager');
								}
							}
						}
					}
				});
			}
		});
		if(!validStartingRace) {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid Race'}));
		}
  });

  ///
  // Convenience subfunctions
  ///

  function respond(err) {
    var isAjax = req.headers.accept.match(/application\/json/);
    var errCode = 400;

    if(err) {
      if(isAjax) {
        if(err == loginError) errCode = 401;
        return res.send(JSON.stringify({error: err}), errCode);
      }

      return res.view({
        layout: layout,
        error: err
      }, view);
    }

    return res.redirect(nextUrl);
  };

  function errorHandler(errMsg) {
		console.log(errMsg);
    return function(err) {
      if(err) {
				console.error(err);
			}
      respond(errMsg);
    };
  };
}
