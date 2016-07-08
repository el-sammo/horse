db = new Mongo().getDB('horse');

var useDate = 20160708;

insertTestEntryData(useDate);
insertTournamentData(useDate);

function insertTournamentData(useDate) {
	var cursor = db.trds.find({name: 'Belmont', raceDate: useDate});
	while(cursor.hasNext()) {
		var trdData = cursor.next();

		var trackId = trdData._id;
		var assocId = trackId.str;

		var assocTournyId = assocId;
		var tournamentName = 'Belmont Daily';
		var tournyDate = useDate;
		var tournamentMax = 100;
		var entryFee = 10;
		var siteFee = 1;
		var closed = false;
		var customers = [
			{customerId: '577852a3ab57f32438ebe6ab', credits: 1583},
			{customerId: '57785312ab57f32438ebe6ac', credits: 322},
			{customerId: '57785346ab57f32438ebe6ad', credits: 686}
		];
	
		db.tournaments.insert({
			assocTournyId: assocTournyId,
			name: tournamentName,
			tournyDate: tournyDate,
			max: tournamentMax,
			entryFee: entryFee,
			siteFee: siteFee,
			closed: closed,
			customers: customers
		});
	}

	var assocTournyId = 'ajaxdowns';
	var tournamentName = 'Ajax Downs Daily';
	var tournyDate = useDate;
	var tournamentMax = 10;
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
		{customerId: '577854c7ab57f32438ebe6b3', credits: 4503}
	];

	db.tournaments.insert({
		assocTournyId: assocTournyId,
		name: tournamentName,
		tournyDate: tournyDate,
		max: tournamentMax,
		entryFee: entryFee,
		siteFee: siteFee,
		closed: closed,
		customers: customers
	});

	var assocTournyId = 'churchilldowns';
	var tournamentName = 'Churchill Downs Daily';
	var tournyDate = useDate;
	var tournamentMax = 5;
	var entryFee = 10;
	var siteFee = 1;
	var closed = false;
	var customers = [
		{customerId: '57784c9eab57f32438ebe6aa', credits: 1201},
		{customerId: '577852a3ab57f32438ebe6ab', credits: 729},
		{customerId: '57785312ab57f32438ebe6ac', credits: 488},
		{customerId: '577854c7ab57f32438ebe6b3', credits: 1127}
	];

	db.tournaments.insert({
		assocTournyId: assocTournyId,
		name: tournamentName,
		tournyDate: tournyDate,
		max: tournamentMax,
		entryFee: entryFee,
		siteFee: siteFee,
		closed: closed,
		customers: customers
	});
}

function insertTestEntryData(useDate) {

	var trackName = 'Belmont';
	var raceDate = useDate;
	var races = [
		{
			number: 1, 
			distance: .75,
			surface: 'Turf',
			time: 13.30,
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
			]
		},
		{
			number: 2, 
			distance: .8125,
			surface: 'Dirt',
			time: 14.01,
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
			]
		},
		{
			number: 3, 
			distance: 1,
			surface: 'Turf',
			time: 14.32,
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
			]
		},
		{
			number: 4, 
			distance: .75,
			surface: 'Inner Turf',
			time: 15.04,
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
			]
		},
		{
			number: 5, 
			distance: .8125,
			surface: 'Dirt',
			time: 15.36,
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
			]
		},
	];

	db.trds.insert({
		name: trackName,
		raceDate: raceDate,
		races: races
	});

}













