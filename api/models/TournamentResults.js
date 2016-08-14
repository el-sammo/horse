/**
* TournamentResults.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    tournamentId: {
      type: 'string',
      required: true
		},
    customerId: {
      type: 'string',
      required: true
		},
    credits: {
      type: 'float',
      required: true
		},
    payout: {
      type: 'float',
      required: true
		}
  }

};

tablize(module.exports);

