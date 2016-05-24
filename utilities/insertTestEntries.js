db = new Mongo().getDB('horse');

insertTestEntryData();

function insertTestEntryData() {

	// update this data
	var trackName: 'Belmont';
	var raceDate: 20160527;
	var races = [
		{
			number: 1, 
			distance: '5 Furlongs', 
			surface: 'Turf',
			time: 13:30,
			sexes: 'Open',
			ages: '2 Year Olds',
			type: 'Maiden Special Weight',
			claim: 0,
			purse: 75000
			entries: [
				number: 1,
				post: 1,
				name: 'Helluva Choice',
				jockey: 'Irad Ortiz, Jr.',
				weight: 119,
				trainer: 'Steve Asmussen',
				claim: 0,
				meds: 'FTL'
			]
		},
	];

	db.trd.insert({
		name: trackName,
		raceDate: raceDate,
		races: races
	});

}













