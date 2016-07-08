
var Promise = require('bluebird');

module.exports = {
	getTrd: function(trId) {
		return Trds.find(
			{id: trId}
		).then(function(trds) {
			return {success: true, trd: trds[0]};
		}).catch(function(err) {
			return {success: false, reason: 'invalid trId'};
		});
	},

	getCustomerBalance: function(customerId) {
		return Customers.find(
			{id: customerId}
		).then(function(trds) {
			var balance = 0;
			if(trds[0].balance) {
				balance = trds[0].balance;
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
			{balance: newBalance},
			false, 
			false
		).then(function(updatedCustomer) {
			return {success: true, updatedCustomer: updatedCustomer};
		}).catch(function(err) {
			console.log(err);
			return {success: false, reason: 'invalid customerId'};
		});
	}
}
