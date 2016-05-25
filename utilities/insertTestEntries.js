db = new Mongo().getDB('horse');

insertTestEntryData();

function insertTestEntryData() {

	var trackName = 'Belmont';
	var raceDate = 20160527;
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
					name: 'Helluva Choice',
					jockey: 'Irad Ortiz, Jr.',
					weight: 119,
					trainer: 'Steve Asmussen',
					claim: 0,
					meds: 'FTL'
				},
				{
					number: 2,
					post: 2,
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













