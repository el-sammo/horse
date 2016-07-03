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
