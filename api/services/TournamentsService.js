
var Promise = require('bluebird');

module.exports = {
	getWagers: function(finalRaceId) {
		return Wagers.find(
			{finalRaceId: finalRaceId}
		).then(function(wagerData) {
			return {success: true, wagers: wagerData};
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	getCustomerBalance: function(customerId) {
		return Customers.find(
			{id: customerId}
		).then(function(customerData) {
			var balance = 0;
			if(customerData[0].balance) {
				balance = customerData[0].dollars;
			}
			return {success: true, balance: balance};
		}).catch(function(err) {
			return {success: false, reason: 'invalid customerId'};
		});
	},

	updateCustomerBalance: function(customerId, previousBalance, wagerAmount, doWhat) {
		if(doWhat === 'subtract') {
			var newBalance = parseFloat(parseFloat(previousBalance) - parseFloat(wagerAmount));
		}
		if(doWhat === 'add') {
			var newBalance = parseFloat(parseFloat(previousBalance) + parseFloat(wagerAmount));
		}
		return Customers.update(
			{id: customerId},
			{dollars: newBalance},
			false, 
			false
		).then(function(updatedCustomer) {
			return {success: true, updatedCustomer: updatedCustomer};
		}).catch(function(err) {
			console.log(err);
			return {success: false, reason: 'invalid customerId'};
		});
	},

	getTournamentByTrackId: function(trackId) {
		return Tournaments.find(
			{assocTrackId: trackId}
		).then(function(tournamentData) {
			return {success: true, tournamentData: tournamentData[0]};
		}).catch(function(err) {
			return {success: false, reason: 'invalid trackId'};
		});
	}
}
