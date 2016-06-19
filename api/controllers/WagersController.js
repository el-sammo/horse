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

		if(
			req.body && 
			req.body.customerId &&
			req.body.trackRaceId &&
			req.body.finalRaceId &&
			req.body.wagerPool &&
			req.body.legs &&
			req.body.parts &&
			req.body.wagerSelections &&
			req.body.wagerAmount &&
			req.body.wagerTotal
		) {
			return validateWager(req, res);
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

		return trackData.trd.races.forEach(function(race) {
			if(race.number == trIdPcs[1]) {
				return race.wagers.forEach(function(wager) {
					if(wagerData.wagerPool === wager.wager) {
						if(parseFloat(wagerData.wagerAmount) >= wager.min) {
							return WagersService.getCustomerBalance(wagerData.customerId).then(function(balanceData) {
								if(balanceData.balance >= wagerData.wagerTotal) {
									if(wagerData.legs > 1) {
										// multi-leg
									}
									if(wagerData.parts > 1) {
										// multi-part
									}
									// WPS
									var allUsedNumbers = [];
									var wsPcs = wagerData.wagerSelections.split(' / ');
									// [ '2', '3,6,7', '1,3,6,7' ]
									wsPcs.forEach(function(group) {
										var groupPcs = group.split(',');
										groupPcs.forEach(function(number) {
											if(allUsedNumbers.indexOf(number) < 0) {
												allUsedNumbers.push(number);
											}
										});
									});
									race.entries.forEach(function(entry) {
										allUsedNumbers.forEach(function(number) {
											if(parseInt(number) == entry.number) {
												if(entry.active) {
												} else {
													return res.send(JSON.stringify({success: false, failMsg: 'Invalid Runner'}));
												}
											}
										});
									});
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
									return res.send(JSON.stringify({success: false, failMsg: 'Insufficient Customer Balance'}));
								}
							});
						} else {
							return res.send(JSON.stringify({success: false, failMsg: 'Invalid Wager Amount'}));
						}
					} else {
						return res.send(JSON.stringify({success: false, failMsg: 'Invalid Wager Pool'}));
					}
				});
			} else {
				return res.send(JSON.stringify({success: false, failMsg: 'Invalid Race'}));
			}
		});
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
