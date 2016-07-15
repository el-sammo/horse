/**
 * TournamentsController
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var Promise = require('bluebird');

var serverError = 'An error occurred. Please try again later.';

var httpAdapter = 'http';
var extra = {};

module.exports = {
	byName: function(req, res) {
		Tournaments.find({name: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byEntryFee: function(req, res) {
		Tournaments.find({entryFee: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byCustomerId: function(req, res) {
		var reqPcs = req.params.id.split('-');
		var customerId = reqPcs[0];
		var today = reqPcs[1];
		Tournaments.find({tournyDate: today}).sort({
			name: 'asc', entryFee: 'asc'
		}).then(function(tournaments) {
			var customerTournaments = [];
			tournaments.forEach(function(tournament) {
				tournament.customers.forEach(function(customer) {
					if(customer.customerId === customerId) {
						customerTournaments.push(tournament);
					}
				});
			});
			res.send(JSON.stringify(customerTournaments));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	byDate: function(req, res) {
		Tournaments.find({tournyDate: req.params.id}).sort({
			name: 'asc', entryFee: 'asc'
		}).limit(30).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	leaders: function(req, res) {
		if(req.params.id) {
			return tournamentLeaders(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid tournament data'}));
		}
	},
	
	updateTCC: function(req, res) {
		if(req.body) {
			return updateTournamentCustomers(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid updateTCC data'}));
		}
	},
	
	register: function(req, res) {
		var rpiPcs = req.params.id.split('-');
		if(rpiPcs.length > 1) {
			return tournamentRegister(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid registration data'}));
		}
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Tournaments.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

function tournamentRegister(req, res, self) {
	var rpiPcs = req.params.id.split('-');
	var tournamentId = rpiPcs[0];
	var customerId = rpiPcs[1];
	return Tournaments.find({id: tournamentId}).sort({
		name: 'asc', entryFee: 'asc'
	}).limit(30).then(function(results) {
		var tournamentData = results[0];
		if(tournamentData.closed) {
			return res.send(JSON.stringify({success: false, failMsg: 'Closed'}));
		}
		var customerFound = false;
		tournamentData.customers.forEach(function(customer) {
			if(customer.customerId === customerId) {
				customerFound = true;
			}
		});
		if(customerFound) {
			return res.send(JSON.stringify({success: false, failMsg: 'Already Registered'}));
		}
		var totalFee = parseFloat(parseFloat(tournamentData.entryFee) + parseFloat(tournamentData.siteFee));
		if(tournamentData.customers.length < tournamentData.max) {
			return TournamentsService.getCustomerBalance(customerId).then(function(balanceData) {
				if(balanceData.balance >= totalFee) {
					return TournamentsService.updateCustomerBalance(customerId, balanceData.balance, totalFee, 'subtract').then(function(customerData) {
						if(customerData.success) {
							tournamentData.customers.push({customerId: customerId, credits: 500});
							return Tournaments.update({id: tournamentData.id}, {customers: tournamentData.customers}, false, false).then(function(result) {
								res.send(JSON.stringify(result));
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
					return res.send(JSON.stringify({success: false, failMsg: 'Insufficient Funds'}));
				}
			}).catch(function(err) {
				res.json({error: 'Server error'}, 500);
				console.error(err);
				throw err;
			});
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Full'}));
		}
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function tournamentLeaders(req, res, self) {
	var tournamentId = req.params.id;
	return Tournaments.find({id: tournamentId}).then(function(results) {
		var tournamentData = results[0];
		tournamentData.customers.sort(dynamicSort("credits"));
		tournamentData.customers.reverse();
		res.send(JSON.stringify(tournamentData.customers));
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function updateTournamentCustomers(req, res, self) {
	var finalRaceId = req.params.id;
	var acIds = req.body;
	var tournamentId = acIds[0];
	acIds.reverse();
	acIds.pop();
	return TournamentsService.getWagers(finalRaceId).then(function(wagersData) {
		var wagers = wagersData.wagers;
		var newCustomers = [];
		acIds.forEach(function(customerId) {
			var newCustomer = {};
			newCustomer.customerId = customerId;
			newCustomer.credits = 0;
			wagers.forEach(function(wager) {
				if(wager.customerId === newCustomer.customerId) {
					newCustomer.credits = (newCustomer.credits + parseFloat(wager.result));
				}
			});
			newCustomers.push(newCustomer);
		});
		var finalCustomers = [];
		Tournaments.find({id: tournamentId}).then(function(getTournamentData) {
			getTournamentData[0].customers.forEach(function(gtTC) {
				var finalCustomer = {};
				finalCustomer.customerId = gtTC.customerId;
				finalCustomer.credits = parseFloat(gtTC.credits);
				newCustomers.forEach(function(newCustomerData) {
					if(newCustomerData.customerId === finalCustomer.customerId) {
						finalCustomer.credits = (parseFloat(finalCustomer.credits) + parseFloat(newCustomerData.credits));
					}
				});
				finalCustomers.push(finalCustomer);
			});
		});

		return Tournaments.update(
			{id: tournamentId},
			{customers: finalCustomers},
			false,
			false
		).then(function(results) {
			var tournamentData = results[0];
			res.send(JSON.stringify(tournamentData.customers));
			return {success: true, updatedTournamentData: tournamentData};
		}).catch(function(err) {
			return {error: 'Server error'};
			console.error(err);
			throw err;
		});
	}).catch(function(err) {
    return {error: 'Server error'};
    console.error(err);
    throw err;
	});
}

function dynamicSort(property) {
	var sortOrder = 1;
	if(property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	}
}

