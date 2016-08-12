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
// useDate = 20160806; // <-- debug code
print('useDate: '+useDate);

getTracks(useDate);
//getWagerRunners('2x4x3x5x5') // <-- debug code

function getTracks(useDate) {
print('getTracks() called');
	var cursor = db.trds.find({raceDate: parseInt(useDate)});
	while(cursor.hasNext()) {
		var trdData = cursor.next();
print('trdData found for '+trdData.name);
		var trackId = (trdData._id.toString()).substring(10,34);
		getTournamentsByAssocTrackId(trdData, trackId);
	}
}

function getTournamentsByAssocTrackId(trdData, trackId) {
print('getTournamentsByAssocTrackId() called');
	var cursor = db.tournaments.find({assocTrackId: trackId});
	while(cursor.hasNext()) {
		var tournamentData = cursor.next();
		var tournamentId = (tournamentData._id.toString()).substring(10,34);
		var tournamentName = tournamentData.name;
		getTournamentStandingsByTournamentId(trdData, trackId, tournamentId, tournamentName);
	}
}

function getTournamentStandingsByTournamentId(trdData, trackId, tournamentId, tournamentName) {
print('getTournamentStandingsByTournamentId() called');
	var cursor = db.tournamentstandings.find({tournamentId: tournamentId});
	while(cursor.hasNext()) {
		var tsData = cursor.next();
		tsData.customers.forEach(function(customer) {
			getCustomer(trdData, trackId, customer.customerId, tournamentId, tournamentName);
		});
	}
}

function getCustomer(trdData, trackId, customerId, tournamentId, tournamentName) {
print('getCustomer() called');
	var _id = new ObjectId(customerId);
	var cursor = db.customers.find({_id: _id});
	while(cursor.hasNext()) {
		var customer = cursor.next();
		// restricting to ss only
		if(customer.ss) {
			getCustomerBalance(trdData, trackId, customer, customerId, tournamentId, tournamentName);
		}
	}
}

function getCustomerBalance(trdData, trackId, customer, customerId, tournamentId, tournamentName) {
print('getCustomerBalance() called');
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
print('credits: '+credits);
	if(credits > 0) {
		makeStrategicWager(trdData, trackId, customer, customerId, tournamentId, tournamentName, credits);
	}
}

function makeStrategicWager(trdData, trackId, customer, customerId, tournamentId, tournamentName, credits) {
print(' ');
print(' ');
print(' ');
print('makeStrategicWager() called for '+customer.fName+' ('+customer.wagerPreference+'-'+customer.wagerAggression+') and '+credits+' credits');
print(' ');
	var raceFound = false;
	var wagerFound = false;
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
		if(customer.wagerPreference === 'horizontal') {
			if(customer.wagerAggression === 'high') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x5x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x5x6');
						wager.wagerAmount = 5;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerAmount = 15;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4');
						wager.wagerAmount = 5;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4');
						wager.wagerAmount = 20;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4');
						wager.wagerAmount = 5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4');
						wager.wagerAmount = 10;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('1x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x2');
						wager.wagerAmount = 5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4');
						wager.wagerAmount = 5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
			if(customer.wagerAggression === 'medium') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x5x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x4x5');
						wager.wagerAmount = 4;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerAmount = 6;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('1x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerAmount = 3;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
			if(customer.wagerAggression === 'low') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x5x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x4x5');
						wager.wagerAmount = 4;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x6x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 8;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('4x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 4;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Pick 5') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 4);
						wager.wagerPool = 'Pick 5';
						wager.wagerAbbrev = 'P5';
						wager.legs = 5;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('1x2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 4') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 3);
						wager.wagerPool = 'Pick 4';
						wager.wagerAbbrev = 'P4';
						wager.legs = 4;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = .5;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Pick 3') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 2);
						wager.wagerPool = 'Pick 3';
						wager.wagerAbbrev = 'P3';
						wager.legs = 3;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Daily Double') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + parseInt(parseInt(foundRace.number) + 1);
						wager.wagerPool = 'Daily Double';
						wager.wagerAbbrev = 'DD';
						wager.legs = 2;
						wager.parts = 1;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
		}
		if(customer.wagerPreference === 'vertical') {
			if(customer.wagerAggression === 'high') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x5x3x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('2x5x6');
						wager.wagerAmount = 5;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x5x2x4');
						wager.wagerAmount = 3;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('2x4x6');
						wager.wagerAmount = 5;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 8;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x3x4x1');
						wager.wagerAmount = 5;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('2x5x3');
						wager.wagerAmount = 4;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x4');
						wager.wagerAmount = 6;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('1x2x3x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('2x3x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('2x5');
						wager.wagerAmount = 6;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
			if(customer.wagerAggression === 'medium') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('4x5x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('5x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('6x5x2x4');
						wager.wagerAmount = 1;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('4x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 8;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('2x5x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 4;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x2x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('4x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('3x5');
						wager.wagerAmount = 4;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
			if(customer.wagerAggression === 'low') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x5x6x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('5x6x5');
						wager.wagerAmount = 2;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 10;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('4x6x2x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('5x4x6');
						wager.wagerAmount = 2;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 8;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x3x4x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('2x5x4');
						wager.wagerAmount = 3;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('5x6');
						wager.wagerAmount = 4;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Superfecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Superfecta';
						wager.wagerAbbrev = 'Super';
						wager.legs = 1;
						wager.parts = 4;
						wager.wagerSelections = getWagerRunners('2x2x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Trifecta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Trifecta';
						wager.wagerAbbrev = 'Tri';
						wager.legs = 1;
						wager.parts = 3;
						wager.wagerSelections = getWagerRunners('4x3x5');
						wager.wagerAmount = 1;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
					if(wagerTypes.indexOf('Exacta') && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Exacta';
						wager.wagerAbbrev = 'Exacta';
						wager.legs = 1;
						wager.parts = 2;
						wager.wagerSelections = getWagerRunners('4x5');
						wager.wagerAmount = 3;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
		}
		if(customer.wagerPreference === 'wps') {
			if(customer.wagerAggression === 'high') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 150;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 120;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 60;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 30;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
			if(customer.wagerAggression === 'medium') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 100;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 70;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 40;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 20;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
			if(customer.wagerAggression === 'low') {
				if(credits >= 300) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 75;
						wager.wagerTotal = 300;
						wagerFound = true;
					}
				}
				if(credits >= 240) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 60;
						wager.wagerTotal = 240;
						wagerFound = true;
					}
				}
				if(credits >= 120) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 30;
						wager.wagerTotal = 120;
						wagerFound = true;
					}
				}
				if(credits >= 60) {
					if(wagerTypes.indexOf('Win') > -1 && !wagerFound) {
						wager.finalRaceId = trackId + '-' + foundRace.number;
						wager.wagerPool = 'Win';
						wager.wagerAbbrev = 'Win';
						wager.legs = 1;
						wager.parts = 1;
						wager.wagerSelections = randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6) + ',' + randomIntFromInterval(1,6);
						wager.wagerAmount = 15;
						wager.wagerTotal = 60;
						wagerFound = true;
					}
				}
			}
		}
		
		var dateObj = new Date();

		wager.wagerPlacedAt = dateObj.getTime();
		wager.cancelled = false;
		wager.scored = false;
		wager.raceClosed = false;
		wager.tournamentName = tournamentName;
		wager.ss = true;

		if(
			wager.finalRaceId &&
			wager.wagerPool &&
			wager.wagerAbbrev &&
			wager.legs &&
			wager.parts &&
			wager.wagerSelections &&
			wager.wagerAmount &&
			wager.wagerTotal &&
			wagerFound
		) {
print(JSON.stringify(wager));
			db.wagers.insert(wager);
		}
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
			var runnerNum = randomIntFromInterval(1,6);
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
	return wagerSelections;
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}










