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
		var totalFee = parseFloat(parseFloat(tournamentData.entryFee) + parseFloat(tournamentData.siteFee));
console.log('tournamentData:');
console.log(tournamentData);
		if(tournamentData.customers.length < tournamentData.max) {
			return TournamentsService.getCustomerBalance(customerId).then(function(balanceData) {
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
