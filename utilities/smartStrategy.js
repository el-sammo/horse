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
//getWagerRunners('2x4x3x5x5') // <-- debug code

function getTracks(useDate) {
	var cursor = db.trds.find({raceDate: parseInt(useDate)});
	while(cursor.hasNext()) {
		var trdData = cursor.next();
		var trackId = (trdData._id.toString()).substring(10,34);
		getTournamentsByAssocTrackId(trdData, trackId);
	}
}

function getTournamentsByAssocTrackId(trdData, trackId) {
	var cursor = db.tournaments.find({assocTrackId: trackId});
	while(cursor.hasNext()) {
		var tournamentData = cursor.next();
		var tournamentId = (tournamentData._id.toString()).substring(10,34);
		var tournamentName = tournamentData.name;
		getTournamentStandingsByTournamentId(trdData, trackId, tournamentId, tournamentName);
	}
}

function getTournamentStandingsByTournamentId(trdData, trackId, tournamentId, tournamentName) {
	var cursor = db.tournamentstandings.find({tournamentId: tournamentId});
	while(cursor.hasNext()) {
		var tsData = cursor.next();
		tsData.customers.forEach(function(customer) {
			getCustomer(trdData, trackId, customer.customerId, tournamentId, tournamentName);
		});
	}
}

function getCustomer(trdData, trackId, customerId, tournamentId, tournamentName) {
print('getCustomer() called with '+customerId);
	var _id = new ObjectId(customerId);
	var cursor = db.customers.find({_id: _id});
	while(cursor.hasNext()) {
		var customer = cursor.next();
		getCustomerBalance(trdData, trackId, customer, customerId, tournamentId, tournamentName);
	}
}

function getCustomerBalance(trdData, trackId, customer, customerId, tournamentId, tournamentName) {
print('getCustomerBalance() called with '+customerId);
	var credits = 500;
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
	if(credits > 0) {
		makeStrategicWager(trdData, trackId, customer, customerId, tournamentId, tournamentName, credits);
	}
}

function makeStrategicWager(trdData, trackId, customer, customerId, tournamentId, tournamentName, credits) {
print('makeStrategicWager() called with customerId '+customerId+' and credits '+credits);
	var raceFound = false;
	var foundRace;
	trdData.races.forEach(function(race) {
		if(!raceFound) {
			if(!race.closed) {
				raceFound = true;
				foundRace = race;
			}
		}
	});
	if(raceFound) {
		var wagerTypes = [];
		foundRace.wagers.forEach(function(wager) {
			wagerTypes.push(wager.wager);
		});
		var wager = {};
		wager.tournamentId = tournamentId;
		wager.customerId = customerId;
		wager.trackRaceId = trackId + '-' + foundRace.number;
print('customer.wagerPreference: '+customer.wagerPreference);
print('customer.wagerAggression: '+customer.wagerAggression);
print('credits: '+credits);
		if(customer.wagerPreference === 'horizontal') {
			if(customer.wagerAgression === 'high') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x5x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 300;
						// 2x4x3x5x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerAmount = 1;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerTotal = 300;
						// 4x5x3x5 @ 1
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x5x6');
						wager.wagerTotal = 300;
						// 2x5x6 @ 5
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerTotal = 300;
						// 4x5 @ 15
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						// 2x4x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						// 4x3x4x5 @ 2
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4');
						wager.wagerAmount = 5;
						wager.wagerTotal = 240;
						// 4x3x4 @ 5
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4');
						wager.wagerAmount = 20;
						wager.wagerTotal = 240;
						// 3x4 @ 20
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						// 2x2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 120;
						// 2x3x4x5 @ 1
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4');
						wager.wagerAmount = 5;
						wager.wagerTotal = 120;
						// 2x3x4 @ 5
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4');
						wager.wagerAmount = 10;
						wager.wagerTotal = 120;
						// 3x4 @ 10
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('1x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						// 1x2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						// 2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x2');
						wager.wagerAmount = 5;
						wager.wagerTotal = 60;
						// 2x3x2 @ 5
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4');
						wager.wagerAmount = 5;
						wager.wagerTotal = 60;
						// 3x4 @ 5
					}
				}
			}
			if(customer.wagerAgression === 'medium') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x5x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 300;
						// 2x4x3x5x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						// 4x5x3x5 @ 1
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x4x5');
						wager.wagerAmount = 4;
						wager.wagerTotal = 300;
						// 4x4x5 @ 4
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						// 5x6 @ 10
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						// 2x4x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 240;
						// 4x3x4x5 @ 1
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						// 4x5x6 @ 2
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 240;
						// 4x6 @ 10
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						// 2x2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						// 4x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 120;
						// 3x4x5 @ 2
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerAmount = 6;
						wager.wagerTotal = 120;
						// 4x5 @ 6
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.wagerSelections = getWagerRunners('1x2x3x4x5');
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						// 1x2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						// 2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						// 3x4x5 @ 1
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerAmount = 3;
						wager.wagerTotal = 60;
						// 4x5 @ 3
					}
				}
			}
			if(customer.wagerAgression === 'low') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x5x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 300;
						// 2x4x3x5x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						// 4x5x3x5 @ 1
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x4x5');
						wager.wagerAmount = 4;
						wager.wagerTotal = 300;
						// 4x4x5 @ 4
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						// 5x6 @ 10
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						// 2x4x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x6x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						// 4x6x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						// 4x5x6 @ 2
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 8;
						wager.wagerTotal = 240;
						// 5x6 @ 8
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						// 2x2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						// 4x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 120;
						// 3x4x5 @ 2
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 4;
						wager.wagerTotal = 120;
						// 5x6 @ 4
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Pick 5')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('1x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						// 1x2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 4')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						// 2x3x4x5 @ .50
					}
					if(wagerTypes.indexOf('Pick 3')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						// 3x4x5 @ 1
					}
					if(wagerTypes.indexOf('Daily Double')) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 60;
						// 5x6 @ 2
					}
				}
			}
		}
		
		var dateObj = newv Date();

		wager.wagerPlacedAt = dateObj.getTime();
		wager.cancelled = false;
		wager.scored = false;
		wager.raceClosed = false;
		wager.tournamentName = tournamentName;
	}
}

function getWagerRunners(runnerMix) {
	var wagerSelections = '';
	var allSections = [];
	var firstSection = true;
	var rmPcs = runnerMix.split('x');
	var rmPcsCount = rmPcs.length;
	var newRMPcs = [];
	while(rmPcsCount > 0) {
		var selectorNumber = randomIntFromInterval(1,rmPcsCount) - 1;
		newRMPcs.push(rmPcs[selectorNumber]);
		rmPcs.splice(selectorNumber,1);
		rmPcsCount = rmPcs.length;
	}

	newRMPcs.forEach(function(runnerCount) {
		var sectionRunners = [];
		while(runnerCount > 0) {
			var runnerNum = randomIntFromInterval(1,14);
			if(sectionRunners.indexOf(runnerNum) < 0) {
				sectionRunners.push(runnerNum);
				runnerCount --;
			}
		}
		sectionRunners.sort(function(a, b){return a-b});
		allSections.push(sectionRunners);
	});
	allSections.forEach(function(sectionRunners) {
		var firstRunner = true;
		sectionRunners.forEach(function(runnerNumber) {
			if(firstSection) {
				if(firstRunner) {
					wagerSelections += runnerNumber;
					firstRunner = false;
				} else {
					wagerSelections += ','+runnerNumber;
				}
			} else {
				if(firstRunner) {
					wagerSelections += ' / ';
					wagerSelections += runnerNumber;
					firstRunner = false;
				} else {
					wagerSelections += ','+runnerNumber;
				}
			}
		});
		firstSection = false;
	});
print('wagerSelections: '+wagerSelections);
	return wagerSelections;
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}










