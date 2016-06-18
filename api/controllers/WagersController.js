/**
 * WagersController
 *
 * @description :: Server-side logic for managing wagers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Promise = require('bluebird');
var serverError = 'An error occurred. Please try again later.';
var httpAdapter = 'http';

module.exports = {
  submitWager: function(req, res) {
    var isAjax = req.headers.accept.match(/application\/json/);

		if(req.body && req.body.wagerData) {
			return validateWager(req, res);
		}
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

function createANetProfile(req, res, self) {
  Customers.findOne(req.body.customerId).then(function(customer) {
    if(! customer) {
			console.log('customers ajax failed in CustomersController-createANetProfile() for CustomerID '+req.body.customerId);
			// TODO: what should this return?
	 		return errorHandler(customersError)();
		}

		AuthorizeCIM.createCustomerProfile({customerProfile: {
				merchantCustomerId: 1521518,
				description: customer.id,
				email: customer.email
			}
    }, function(err, response) {
			if(err) {
				console.log('AuthorizeCIM.createCustomerProfile() FAILED for customerId: '+customer.id)
				return errorHandler(err)();
			}
      return res.send(JSON.stringify({success: true, customerProfileId: response.customerProfileId}));
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
