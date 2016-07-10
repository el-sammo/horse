module.exports = {

	getAffectedWagers: function(finalRaceId) {
		return Wagers.find(
			{finalRaceId: finalRaceId}
		).then(function(affectedWagers) {
			return affectedWagers;
		}).catch(function(err) {
			return {success: false, reason: 'invalid finalRaceId'};
		});
	},

	scoreAffectedWagers: function(finalRaceId) {
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
	}

};

