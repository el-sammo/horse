/**
* Tournaments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var tablize = require('sd-datatables');

module.exports = {

  attributes: {
    assocTournyId: {
      type: 'string',
      required: true
		},
    name: {
      type: 'string',
      required: true
		},
    tournyDate: {
      type: 'number',
      required: true
		},
    max: {
      type: 'number',
      required: true
		},
    entryFee: {
      type: 'number',
      required: true
		},
    siteFee: {
      type: 'number',
      required: true
		},
    closed: {
      type: 'boolean',
      required: true
		}
  }

};

tablize(module.exports);

