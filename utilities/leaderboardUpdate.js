db = new Mongo().getDB('horse');

var dateObj = new Date();
var year = dateObj.getFullYear();
var month = dateObj.getMonth() + 1;
var date = dateObj.getDate();

if(month < 10) {
	month = '0' + month;
}

if(date < 10) {
	date = '0' + date;
}

var useDate = year + month + date;

getTracks(useDate);

function getTracks(useDate) {
	var cursor = db.trds.find({raceDate: parseInt(useDate)});
	while(cursor.hasNext()) {
		var trdData = cursor.next();
		var trackId = (trdData._id.toString()).substring(10,34);
		getTournamentsByAssocTrackId(trackId);
	}
}

function getTournamentsByAssocTrackId(trackId) {
	var cursor = db.tournaments.find({assocTrackId: trackId});
	while(cursor.hasNext()) {
		var tournamentData = cursor.next();
		var tournamentId = (tournamentData._id.toString()).substring(10,34);
		var tournamentCredits = tournamentData.credits;
		var tournamentName = tournamentData.name;
		getTournamentStandingsByTournamentId(tournamentId, tournamentCredits);
	}
}

function getTournamentStandingsByTournamentId(tournamentId, tournamentCredits) {
	var newCustomers = [];
	var cursor = db.tournamentstandings.find({tournamentId: tournamentId});
	while(cursor.hasNext()) {
		var tsData = cursor.next();
		tsData.customers.forEach(function(customer) {
			var thisCustomer = {};
			thisCustomer.customerId = customer.customerId;
			thisCustomer.credits = getCustomerTournamentCredits(customer.customerId, tournamentId, tournamentCredits);
			newCustomers.push(thisCustomer);
		});
print(' ');
print('tournamentId: '+tournamentId);
print('tournamentCredits: '+tournamentCredits);
print('newCustomers:');
print(JSON.stringify(newCustomers));
		db.tournamentstandings.update(
			{tournamentId: tournamentId},
			{$set: {customers: newCustomers}},
			false,
			false
		)
	}
}

function getCustomerTournamentCredits(customerId, tournamentId, tournamentCredits) {
	var credits = tournamentCredits || 500;
print(' ');
print('tournamentCredits: '+tournamentCredits);
	var cursor = db.wagers.find({
		customerId: customerId,
		tournamentId: tournamentId
	});
	while(cursor.hasNext()) {
		var wager = cursor.next();
		if(wager.scored) {
			credits += parseFloat(wager.result - wager.wagerTotal);
		} else {
			if(!wager.cancelled) {
				credits -= parseFloat(wager.wagerTotal);
			}
		}
	}
print(' ');
print('credits: '+parseFloat(credits));
	return parseFloat(credits);
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}










