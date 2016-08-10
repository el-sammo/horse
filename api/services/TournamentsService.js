
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

	updateTS: function(tournamentId, customerId, credits) {
		return TournamentStandings.find({tournamentId: tournamentId}).then(function(tsData) {
			var customers = tsData[0].customers;
			var newCustomers = [];
			customers.forEach(function(customer) {
				if(customer.customerId === customerId) {
					newCustomers.push(
						{customerId: customerId, credits: parseFloat(credits)}
					);
				} else {
					newCustomers.push(customer);
				}
			});
			return TournamentStandings.update(
				{tournamentId: tournamentId},
				{customers: newCustomers},
				false, 
				false
			).then(function(updatedTSData) {
				return {success: true, updatedTSData: updatedTSData};
			}).catch(function(err) {
				console.log(err);
				return {success: false, reason: 'invalid tournamentId'};
			});
		}).catch(function(err) {
			console.log(err);
			return {success: false, reason: 'invalid tournamentId'};
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
	},

	addCustomer: function(tournamentId, customerId, tournamentCredits) {
console.log(' ');
console.log('tournamentCredits: '+tournamentCredits);
		var credits = tournamentCredits || 500;
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tsDataResults) {
			var tsData = tsDataResults[0];
			tsData.customers.push({customerId: customerId, credits: credits});
			return TournamentStandings.update(
				{tournamentId: tournamentId},
				{customers: tsData.customers},
				false,
				false
			).then(function(updatedTSData) {
				return {success: true, updatedTSData: updatedTSData};
			}).catch(function(err) {
				return {success: false, reason: 'invalid tournamentId or customers'};
			});
		}).catch(function(err) {
			return {success: false, reason: 'invalid tournamentId or customerId'};
		});
	},

	removeCustomer: function(tournamentId, customerId) {
		return TournamentStandings.find(
			{tournamentId: tournamentId}
		).then(function(tsDataResults) {
			var tsData = tsDataResults[0];
console.log(' ');
console.log('tsData:');
console.log(tsData);
			var updatedCustomers = [];
			tsData.customers.forEach(function(customer) {
				if(customer.customerId !== customerId) {
					updatedCustomers.push(customer)
				}
			});
console.log(' ');
console.log('updatedCustomers:');
console.log(updatedCustomers);
			return TournamentStandings.update(
				{tournamentId: tournamentId},
				{customers: updatedCustomers},
				false,
				false
			).then(function(updatedTSData) {
				return {success: true, updatedTSData: updatedTSData};
			}).catch(function(err) {
				return {success: false, reason: 'invalid tournamentId or customers'};
			});
		}).catch(function(err) {
			return {success: false, reason: 'invalid tournamentId or customerId'};
		});
	},

	createCustomTournament: function(tournamentData) {
		var assocTrackId = tournamentData.assocTrackId;
		var name = tournamentData.name;
		var tournyDate = tournamentData.tournyDate;
		var max = tournamentData.max;
		var entryFee = tournamentData.entryFee;
		var siteFee = tournamentData.siteFee;
		var startTime = tournamentData.startTime;
		var closed = false;
		var customers = tournamentData.customers;
		var credits = tournamentData.credits;
		var pubPriv = tournamentData.pubPriv;
		var custom = true;

		return Tournaments.create({
			assocTrackId: assocTrackId,
			name: name,
			tournyDate: tournyDate,
			max: max,
			entryFee: entryFee,
			siteFee: siteFee,
			startTime: startTime,
			closed: closed,
			customers: customers,
			credits: credits,
			pubPriv: pubPriv,
			custom: custom
		}).then(function(cctiResponse) {
			var tournamentId = cctiResponse.id;
			var newCustomers = [];
			customers.forEach(function(customer) {
				var newCustomer = {};
				newCustomer.customerId = customer;
				newCustomer.credits = credits;
				newCustomers.push(newCustomer);
			});
			return TournamentStandings.create({
				tournamentId: tournamentId,
				customers: newCustomers
			}).then(function(tsiResponse) {
console.log(' ');
console.log('tsiResponse:');
console.log(tsiResponse);
				return {success: true, tournamentData: cctiResponse};
			}).catch(function(err) {
console.log(' ');
console.log('createCustomTournament - TournamentStandings.create err:');
console.log(err);
				return {success: false, reason: 'invalid tournamentId or customers'};
			});
		}).catch(function(err) {
console.log(' ');
console.log('createCustomTournament - Tournaments.create err:');
console.log(err);
			return {success: false, reason: 'invalid tournamentData'};
		});
	}
}
