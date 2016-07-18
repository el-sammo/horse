db = new Mongo().getDB('horse');

var useDate = 20160718;

insertTestEntryData(useDate);
insertTournamentData(useDate);

function insertTournamentData(useDate) {
	var cursor = db.trds.find({name: 'Belmont', raceDate: useDate});
	var assocId = '';
	while(cursor.hasNext()) {
		var trdData = cursor.next();

		var trackId = trdData._id;
		assocId = trackId.str;

		var assocTrackId = assocId;
		var tournamentName = 'Belmont Daily';
		var tournyDate = useDate;
		var tournamentMax = 100;
		var entryFee = 10;
		var siteFee = 1;
		var closed = false;
		var customers = [
			{customerId: '577852a3ab57f32438ebe6ab', credits: 1583},
			{customerId: '57785312ab57f32438ebe6ac', credits: 322},
			{customerId: '57785346ab57f32438ebe6ad', credits: 686},
			{customerId: '5765aec37e7e6e33c9203f4d', credits: 505}
		];
	
		db.tournaments.insert({
			assocTrackId: assocTrackId,
			name: tournamentName,
			tournyDate: tournyDate,
			max: tournamentMax,
			entryFee: entryFee,
			siteFee: siteFee,
			closed: closed,
			customers: customers
		});
	}

	var btId = '';
	var cursor = db.tournaments.find({name: 'Belmont Daily', tournyDate: useDate});
	while(cursor.hasNext()) {
		var bTourny = cursor.next();
		btId = bTourny._id.str;
	}

	db.wagers.insert({
		tournamentId: btId,
		customerId: '577852a3ab57f32438ebe6ab',
		trackraceId: assocId + '-1',
		finalRaceId: assocId + '-1',
		wagerPool: 'Win',
		legs: 1,
		parts: 1,
		wagerSelections: '1,2,5,7',
		wagerAmount: '10.00',
		wagerTotal: '40.00',
		wagerPlacedAt: 1468441862503,
		cancelled: false,
		scored: false
	});

	db.wagers.insert({
		tournamentId: btId,
		customerId: '577852a3ab57f32438ebe6ab',
		trackraceId: assocId + '-1',
		finalRaceId: assocId + '-1',
		wagerPool: 'Win',
		legs: 1,
		parts: 1,
		wagerSelections: '2,5,7',
		wagerAmount: '10.00',
		wagerTotal: '30.00',
		wagerPlacedAt: 1468441862504,
		cancelled: false,
		scored: false
	});

	db.wagers.insert({
		tournamentId: btId,
		customerId: '57785312ab57f32438ebe6ac',
		trackraceId: assocId + '-1',
		finalRaceId: assocId + '-1',
		wagerPool: 'Win',
		legs: 1,
		parts: 1,
		wagerSelections: '1,2,5,6,7',
		wagerAmount: '10.00',
		wagerTotal: '50.00',
		wagerPlacedAt: 1468441862505,
		cancelled: false,
		scored: false
	});

	db.wagers.insert({
		tournamentId: btId,
		customerId: '57785312ab57f32438ebe6ac',
		trackraceId: assocId + '-1',
		finalRaceId: assocId + '-1',
		wagerPool: 'Win',
		legs: 1,
		parts: 1,
		wagerSelections: '6,7',
		wagerAmount: '10.00',
		wagerTotal: '20.00',
		wagerPlacedAt: 1468441862506,
		cancelled: false,
		scored: false
	});

	var cursor = db.trds.find({name: 'Del Mar', raceDate: useDate});
	var assocId = '';
	while(cursor.hasNext()) {
		var trdData = cursor.next();

		var trackId = trdData._id;
		assocId = trackId.str;

		var assocTrackId = assocId;
		var tournamentName = 'Del Mar Daily';
		var tournyDate = useDate;
		var tournamentMax = 100;
		var entryFee = 10;
		var siteFee = 1;
		var closed = false;
		var customers = [
			{customerId: '57784c9eab57f32438ebe6aa', credits: 14021},
			{customerId: '577852a3ab57f32438ebe6ab', credits: 1109},
			{customerId: '57785312ab57f32438ebe6ac', credits: 0},
			{customerId: '57785346ab57f32438ebe6ad', credits: 83},
			{customerId: '57785378ab57f32438ebe6ae', credits: 440},
			{customerId: '577853baab57f32438ebe6af', credits: 711},
			{customerId: '57785409ab57f32438ebe6b0', credits: 1003},
			{customerId: '57785437ab57f32438ebe6b1', credits: 44},
			{customerId: '57785498ab57f32438ebe6b2', credits: 6886},
			{customerId: '577854c7ab57f32438ebe6b3', credits: 4503},
			{customerId: '5789268eb0a218495caddcb6', credits: 500},
			{customerId: '5765aec37e7e6e33c9203f4d', credits: 500}
		];

		db.tournaments.insert({
			assocTrackId: assocTrackId,
			name: tournamentName,
			tournyDate: tournyDate,
			max: tournamentMax,
			entryFee: entryFee,
			siteFee: siteFee,
			closed: closed,
			customers: customers
		});
	}
}

function insertTestEntryData(useDate) {

	var trackName = 'Belmont';
	var raceDate = useDate;
	var races = [
		{
			number: 1, 
			distance: .75,
			surface: 'Turf',
			time: '13.30',
			sexes: 'Open',
			ages: '2 Year Olds',
			type: 'Maiden Special Weight',
			claim: 0,
			purse: 75000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 2
				},
				{
					wager: 'Trifecta',
					min: 1
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				},
				{
					wager: 'Pick 3',
					min: 1
				},
				{
					wager: 'Pick 5',
					min: .5
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Helluva Choice',
					jockey: 'Irad Ortiz, Jr.',
					weight: 119,
					trainer: 'Steve Asmussen',
					claim: 0,
					meds: 'FTL',
					altRunner: {
						number: '1A',
						post: 8,
						active: true,
						name: 'Ah Shit',
						jockey: 'El Sammo',
						weight: 119,
						trainer: 'Del Toro',
						claim: 0,
						meds: 'FTL'
					}
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Made You Look',
					jockey: 'Javier Castellano',
					weight: 119,
					trainer: 'Todd Pletcher',
					claim: 0,
					meds: 'FTL'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'Red Lodge',
					jockey: 'John Velazquez',
					weight: 116,
					trainer: 'Wesley Ward',
					claim: 0,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: false,
					name: 'California Swing',
					jockey: 'Jose Ortiz',
					weight: 119,
					trainer: 'Christophe Clement',
					claim: 0,
					meds: ''
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Lethal Shot',
					jockey: 'Kendrick Carmouche',
					weight: 119,
					trainer: 'Tim Ice',
					claim: 0,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Keep Quiet (FR)',
					jockey: 'Luis Saez',
					weight: 119,
					trainer: 'Mark Casse',
					claim: 0,
					meds: 'FTL'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Dangerous Dan',
					jockey: 'Joel Rosario',
					weight: 119,
					trainer: 'Wesley Ward',
					claim: 0,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 2, 
			distance: .8125,
			surface: 'Dirt',
			time: '14.01',
			sexes: 'Fillies and Mares',
			ages: '3 Year Olds and Up',
			type: 'Claiming',
			claim: 14000,
			purse: 26000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 2
				},
				{
					wager: 'Trifecta',
					min: 1
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				},
				{
					wager: 'Pick 3',
					min: 1
				},
				{
					wager: 'Pick 4',
					min: .5
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Over My Head',
					jockey: 'Jomar Torres',
					weight: 114,
					trainer: 'John Morrison',
					claim: 14000,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Half Dreamin',
					jockey: 'Cornelio Velasquez',
					weight: 121,
					trainer: 'Linda Rice',
					claim: 14000,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: false,
					name: 'Reign',
					jockey: 'Jacqueline Davis',
					weight: 121,
					trainer: 'Randy Persaud',
					claim: 14000,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Just Sisters',
					jockey: 'Kendrick Carmouche',
					weight: 121,
					trainer: 'Danny Gargan',
					claim: 14000,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Valkimqua',
					jockey: 'Jose Ortiz',
					weight: 121,
					trainer: 'Chris Englehart',
					claim: 14000,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: false,
					name: 'Spectacular Flash',
					jockey: 'Irad Ortiz, Jr.',
					weight: 121,
					trainer: 'Ralph Nicks',
					claim: 14000,
					meds: 'L',
					equip: 'Blk-On'
				}
			],
			closed: false
		},
		{
			number: 3, 
			distance: 1,
			surface: 'Turf',
			time: '14.32',
			sexes: 'Fillies and Mares',
			ages: '3 Year Olds and Up',
			type: 'Allowance Optional Claiming',
			claim: 62500,
			purse: 80000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 2
				},
				{
					wager: 'Trifecta',
					min: 1
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				},
				{
					wager: 'Pick 3',
					min: 1
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Quest (GB)',
					jockey: 'Joel Rosario',
					weight: 122,
					trainer: 'Christophe Clement',
					claim: 0,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Coming Attraction',
					jockey: 'Javier Castellano',
					weight: 122,
					trainer: 'Claude McGaughey III',
					claim: 0,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'Shopper',
					jockey: 'Junior Alvarado',
					weight: 120,
					trainer: 'William Mott',
					claim: 0,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'My Cara Mia',
					jockey: 'Manuel Franco',
					weight: 120,
					trainer: 'Mitchell Friedman',
					claim: 0,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Royal Temptress (IRE)',
					jockey: 'Kendrick Carmouche',
					weight: 120,
					trainer: 'Barclay Tagg',
					claim: 0,
					meds: 'L',
					equip: 'Blk-On'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Rachel\'s Temper',
					jockey: 'Jose Ortiz',
					weight: 120,
					trainer: 'David Cannizzo',
					claim: 0,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Paige',
					jockey: 'Jose Ortiz',
					weight: 120,
					trainer: 'Christophe Clement',
					claim: 0,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 4, 
			distance: .75,
			surface: 'Inner Turf',
			time: '15.04',
			sexes: 'Open',
			ages: '3 Year Olds and Up',
			type: 'Starter Allowance',
			claim: 0,
			purse: 55000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 2
				},
				{
					wager: 'Trifecta',
					min: 1
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Completely Bonkers',
					jockey: 'Cornerlio Velasquez',
					weight: 119,
					trainer: 'Linda Rice',
					claim: 0,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Baltic Art (GER)',
					jockey: 'Joel Rosario',
					weight: 119,
					trainer: 'Wesley Ward',
					claim: 0,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'Bankers Holiday',
					jockey: 'Luis Saez',
					weight: 124,
					trainer: 'Joe Sharp',
					claim: 0,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Kerry Boy',
					jockey: 'Ruben Silvera',
					weight: 121,
					trainer: 'Gabriel Goodwin',
					claim: 0,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Crescent Street',
					jockey: 'John Velazquez',
					weight: 121,
					trainer: 'Richard Schosberg',
					claim: 0,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Our Karma',
					jockey: 'Angel Arroyo',
					weight: 119,
					trainer: 'Joseph Imperio',
					claim: 0,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Cort',
					jockey: 'Gabriel Saez',
					weight: 121,
					trainer: 'George Weaver',
					claim: 0,
					meds: 'L'
				},
				{
					number: 8,
					post: 8,
					active: true,
					name: 'Fratello Del Nord',
					jockey: 'Manuel Franco',
					weight: 124,
					trainer: 'Chris Englehart',
					claim: 0,
					meds: 'L'
				},
				{
					number: 9,
					post: 9,
					active: false,
					name: 'Ross J Dawg',
					jockey: 'Irad Ortiz, Jr.',
					weight: 121,
					trainer: 'Steve Klesaris',
					claim: 0,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 5, 
			distance: .8125,
			surface: 'Dirt',
			time: '15.36',
			sexes: 'Fillies and Mares',
			ages: '3 Year Olds and Up',
			type: 'Maiden Claiming',
			claim: 20000,
			purse: 29000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 2
				},
				{
					wager: 'Trifecta',
					min: 1
				},
				{
					wager: 'Superfecta',
					min: .1
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Lebowski',
					jockey: 'Kendrick Carmouche',
					weight: 118,
					trainer: 'John Toscano, Jr.',
					claim: 20000,
					meds: 'FTL'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Appealing Miss',
					jockey: 'Eric Cancel',
					weight: 124,
					trainer: 'John Kimmel',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'Causeway Cutie',
					jockey: 'Jacqueline Davis',
					weight: 118,
					trainer: 'Neal Terracciano',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Tizthefastlaine',
					jockey: 'Irad Ortiz, Jr.',
					weight: 124,
					trainer: 'Anthony Dutrow',
					claim: 20000,
					meds: 'L',
					equip: 'Blk-Off'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Hoosier Scout',
					jockey: 'Luis Saez',
					weight: 118,
					trainer: 'Dominick Schettino',
					claim: 20000,
					meds: 'L',
					equip: 'Blk-On'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Warriors Diva',
					jockey: 'Cornelio Velasquez',
					weight: 118,
					trainer: 'Linda Rice',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Um Melakeh',
					jockey: 'Manuel Franco',
					weight: 118,
					trainer: 'David Donk',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 8,
					post: 8,
					active: true,
					name: 'Indygo Tigress',
					jockey: 'Dylan Davis',
					weight: 118,
					trainer: 'Gary Contessa',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 9,
					post: 9,
					active: true,
					name: 'Modern Harmony',
					jockey: 'Jomar Torres',
					weight: 111,
					trainer: 'Kim Laudati',
					claim: 20000,
					meds: 'L'
				}
			],
			closed: false
		}
	];

	db.trds.insert({
		name: trackName,
		raceDate: raceDate,
		races: races
	});

	var trackName = 'Del Mar';
	var raceDate = useDate;
	var races = [
		{
			number: 1, 
			distance: 1,
			surface: 'Dirt',
			time: '17.00',
			sexes: 'Open',
			ages: '3 Year Olds And Up',
			type: 'Claiming',
			claim: 10000,
			purse: 23000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 1
				},
				{
					wager: 'Trifecta',
					min: .5
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				},
				{
					wager: 'Pick 3',
					min: 1
				},
				{
					wager: 'Pick 5',
					min: .5
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Hadfunlastnight',
					jockey: 'J. Theriot',
					weight: 120,
					trainer: 'G. Papaprodromou',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'My Secret Affair',
					jockey: 'F. Prat',
					weight: 120,
					trainer: 'E. Truman',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'Successful Runner',
					jockey: 'S. Elliott',
					weight: 120,
					trainer: 'C. Hartman',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Saddle Soar',
					jockey: 'A. Lezcano',
					weight: 122,
					trainer: 'M. Pearson',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Jackson Sundown',
					jockey: 'T. Pereira',
					weight: 120,
					trainer: 'M. Bellocq',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Tiz Jolie',
					jockey: 'R. Bejarano',
					weight: 120,
					trainer: 'P. Lobo',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Tribal Again',
					jockey: 'M. Pedroza',
					weight: 120,
					trainer: 'K. Mulhall',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 8,
					post: 8,
					active: true,
					name: 'My Old Bud',
					jockey: 'A. Quinonez',
					weight: 120,
					trainer: 'S. Ruiz',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 9,
					post: 9,
					active: true,
					name: 'Accelerant',
					jockey: 'S. Gonzalez',
					weight: 120,
					trainer: 'V. Fernandez',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 10,
					post: 10,
					active: true,
					name: 'Lucky Shoes to Win',
					jockey: 'C. Lindsay',
					weight: 111,
					trainer: 'R. Agarie',
					claim: 10500,
					meds: 'L'
				},
				{
					number: 11,
					post: 11,
					active: true,
					name: 'Big Tire',
					jockey: 'S. Gonzalez',
					weight: 122,
					trainer: 'M. Glatt',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 12,
					post: 12,
					active: false,
					name: 'What We Doing',
					jockey: 'S. Gonzalez',
					weight: 122,
					trainer: 'K. Mulhall',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 13,
					post: 13,
					active: true,
					name: 'Broadway Nika',
					jockey: 'A. Delgadillo',
					weight: 120,
					trainer: 'W. Spawr',
					claim: 12500,
					meds: 'L'
				},
				{
					number: 14,
					post: 14,
					active: true,
					name: 'Spud Spivens',
					jockey: 'S. Elloitt',
					weight: 122,
					trainer: 'S. Ruiz',
					claim: 12500,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 2, 
			distance: .625,
			surface: 'Dirt',
			time: '17.33',
			sexes: 'Fillies',
			ages: '2 Year Olds',
			type: 'Maiden Special Weight',
			claim: 0,
			purse: 63000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 1
				},
				{
					wager: 'Trifecta',
					min: .5
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				},
				{
					wager: 'Pick 3',
					min: 1
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Louder California',
					jockey: 'B. Boulanger',
					weight: 120,
					trainer: 'R. Deleon',
					claim: 0,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'I\'ll Be Around',
					jockey: 'F. Perez',
					weight: 120,
					trainer: 'G. Sherlock',
					claim: 0,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: false,
					name: 'Coco Smooches',
					jockey: 'E. Maldonado',
					weight: 120,
					trainer: 'G. Sherlock',
					claim: 0,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Starr of Quality',
					jockey: 'F. Prat',
					weight: 121,
					trainer: 'M. McCarthy',
					claim: 0,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Cougar Creek',
					jockey: 'C. Lindsay',
					weight: 113,
					trainer: 'D. O\'Neill',
					claim: 0,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Veiled Heat',
					jockey: 'T. Baze',
					weight: 120,
					trainer: 'J. Fanning',
					claim: 0,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Veiled Heat',
					jockey: 'M. Gutierrez',
					weight: 120,
					trainer: 'D. O\'Neill',
					claim: 0,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 3, 
			distance: 1.0625,
			surface: 'Turf',
			time: '18.03',
			sexes: 'Open',
			ages: '3 Year Olds and Up',
			type: 'Allowance',
			claim: 0,
			purse: 65000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 1
				},
				{
					wager: 'Trifecta',
					min: .5
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				},
				{
					wager: 'Pick 3',
					min: 1
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Ace Deuce',
					jockey: 'J. Theriot',
					weight: 122,
					trainer: 'V. Belvoir',
					claim: 0,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Sir Cal',
					jockey: 'J. Talamo',
					weight: 125,
					trainer: 'R. Becerra',
					claim: 0,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'Rye',
					jockey: 'K. Desormeaux',
					weight: 118,
					trainer: 'W. Morey',
					claim: 0,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'American Aristocrat',
					jockey: 'C. Lindsay',
					weight: 115,
					trainer: 'T. McCanna',
					claim: 0,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Glory Bound',
					jockey: 'F. Prat',
					weight: 118,
					trainer: 'C. Dollase',
					claim: 0,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Do Some Magic',
					jockey: 'S. Elliott',
					weight: 125,
					trainer: 'M. Jones',
					claim: 0,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Temple Keys',
					jockey: 'R. Bejarano',
					weight: 125,
					trainer: 'R. Baltas',
					claim: 0,
					meds: 'L'
				},
				{
					number: 8,
					post: 8,
					active: true,
					name: 'Anatolian Heat',
					jockey: 'M. Garcia',
					weight: 121,
					trainer: 'P. Miller',
					claim: 0,
					meds: 'L'
				},
				{
					number: 9,
					post: 9,
					active: true,
					name: 'Silver Champ',
					jockey: 'K. John',
					weight: 122,
					trainer: 'J. Kasparoff',
					claim: 0,
					meds: 'L'
				},
				{
					number: 10,
					post: 10,
					active: true,
					name: 'Preacher Roe',
					jockey: 'E. Maldonado',
					weight: 122,
					trainer: 'A. Kitchingman',
					claim: 0,
					meds: 'L'
				},
				{
					number: 11,
					post: 11,
					active: true,
					name: 'Lindante',
					jockey: 'V. Espinoza',
					weight: 125,
					trainer: 'J. Fanning',
					claim: 0,
					meds: 'L'
				},
				{
					number: 12,
					post: 12,
					active: true,
					name: 'Tengas Ransom',
					jockey: 'T. Baze',
					weight: 121,
					trainer: 'J. Mullins',
					claim: 0,
					meds: 'L'
				},
				{
					number: 13,
					post: 13,
					active: true,
					name: 'Zip the Monkey',
					jockey: 'S. Gonzalez',
					weight: 125,
					trainer: 'M. Jones',
					claim: 0,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 4, 
			distance: .8125,
			surface: 'Dirt',
			time: '18.33',
			sexes: 'Open',
			ages: '3 Year Olds and Up',
			type: 'Caliming',
			claim: 18000,
			purse: 31000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 1
				},
				{
					wager: 'Trifecta',
					min: .5
				},
				{
					wager: 'Superfecta',
					min: .1
				},
				{
					wager: 'Daily Double',
					min: 2
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Drover Crazy',
					jockey: 'M. Garcia',
					weight: 120,
					trainer: 'C. Dollase',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 2,
					post: 2,
					active: true,
					name: 'Nextdoorneighbor',
					jockey: 'T. Baze',
					weight: 120,
					trainer: 'S. Ruiz',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 3,
					post: 3,
					active: true,
					name: 'My Samurai Warrior',
					jockey: 'S. Gonzalez',
					weight: 120,
					trainer: 'M. Glatt',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Limited Response',
					jockey: 'M. Pedroza',
					weight: 120,
					trainer: 'V. Fernandez',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'Cougar Country',
					jockey: 'C. Salcedo',
					weight: 113,
					trainer: 'R. Becerra',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Thesheetsguy',
					jockey: 'A. Cedillo',
					weight: 120,
					trainer: 'D. Pederson',
					claim: 20000,
					meds: 'L'
				},
				{
					number: 7,
					post: 7,
					active: true,
					name: 'Madelyn\'s Wild Max',
					jockey: 'S. Elliott',
					weight: 122,
					trainer: 'C. Hartman',
					claim: 20000,
					meds: 'L'
				}
			],
			closed: false
		},
		{
			number: 5, 
			distance: 1.0625,
			surface: 'Turf',
			time: '19.03',
			sexes: 'Fillies and Mares',
			ages: '3 Year Olds and Up',
			type: 'Allowance',
			claim: 0,
			purse: 65000,
			wagers: [
				{
					wager: 'Win',
					min: 2
				},
				{
					wager: 'Place',
					min: 2
				},
				{
					wager: 'Show',
					min: 2
				},
				{
					wager: 'Exacta',
					min: 1
				},
				{
					wager: 'Trifecta',
					min: .5
				},
				{
					wager: 'Superfecta',
					min: .1
				}
			],
			entries: [
				{
					number: 1,
					post: 1,
					active: true,
					name: 'Moon Over Paris',
					jockey: 'A. Solis',
					weight: 125,
					trainer: 'J. Shirreffs',
					claim: 0,
					meds: 'FTL'
				},
				{
					number: 2,
					post: 2,
					active: false,
					name: 'Lily Kai',
					jockey: 'SCRATCH',
					weight: 120,
					trainer: 'SCRATCH',
					claim: 0
				},
				{
					number: 3,
					post: 3,
					active: false,
					name: 'Proficiently',
					jockey: 'SCRATCH',
					weight: 118,
					trainer: 'SCRATCH',
					claim: 0
				},
				{
					number: 4,
					post: 4,
					active: true,
					name: 'Zip N Bayou',
					jockey: 'T. Pereira',
					weight: 122,
					trainer: 'J. Hollendorfer',
					claim: 0,
					meds: 'L'
				},
				{
					number: 5,
					post: 5,
					active: true,
					name: 'La Boheme (GER)',
					jockey: 'F. Prat',
					weight: 125,
					trainer: 'R. Mandella',
					claim: 0,
					meds: 'L'
				},
				{
					number: 6,
					post: 6,
					active: true,
					name: 'Arethusa (GB)',
					jockey: 'A. Quinonez',
					weight: 122,
					trainer: 'D. Blacker',
					claim: 0,
					meds: 'FTL'
				},
				{
					number: 7,
					post: 7,
					active: false,
					name: 'Friulian',
					jockey: 'SCRATCH',
					weight: 118,
					trainer: 'SCRATCH',
					claim: 0
				},
				{
					number: 8,
					post: 8,
					active: true,
					name: 'Crimson and Gold',
					jockey: 'R. Bejarano',
					weight: 121,
					trainer: 'P. Gallagher',
					claim: 0,
					meds: 'L'
				},
				{
					number: 9,
					post: 9,
					active: true,
					name: 'Stylish in Black',
					jockey: 'M. Gutierrez',
					weight: 125,
					trainer: 'B. Grayson',
					claim: 0,
					meds: 'L'
				},
				{
					number: 10,
					post: 10,
					active: true,
					name: 'Cover Song',
					jockey: 'M. Smith',
					weight: 118,
					trainer: 'C. Gaines',
					claim: 0,
					meds: 'L'
				},
				{
					number: 11,
					post: 11,
					active: true,
					name: 'Grandma\'s Hands (IRE)',
					jockey: 'T. Baze',
					weight: 125,
					trainer: 'N. Drysdale',
					claim: 0,
					meds: 'L'
				},
				{
					number: 12,
					post: 12,
					active: true,
					name: 'Wishful Thinking',
					jockey: 'K. Desormeaux',
					weight: 121,
					trainer: 'M. Puype',
					claim: 0,
					meds: 'L'
				},
				{
					number: 13,
					post: 13,
					active: true,
					name: 'Amber Louise',
					jockey: 'N. Arroyo, Jr.',
					weight: 118,
					trainer: 'M. Pender',
					claim: 0,
					meds: 'L'
				},
				{
					number: 14,
					post: 14,
					active: false,
					name: 'Dynamic Mizzes K',
					jockey: 'SCRATCH',
					weight: 125,
					trainer: 'SCRATCH',
					claim: 0
				},
			],
			closed: false
		}
	];

	db.trds.insert({
		name: trackName,
		raceDate: raceDate,
		races: races
	});

}













