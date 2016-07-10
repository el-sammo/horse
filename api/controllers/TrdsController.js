/**
 * TrdController
 *
 * @description :: Server-side logic for managing trds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  datatables: function(req, res) {
    var options = req.query;

    Trds.datatables(options).sort({name: 'asc'}).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  },

	toValidate: function(req, res) {
		var trId = req;
		Trds.find({id: trId}).then(function(result) {
//			res.send(result[0]);
			res.send(JSON.stringify(44));
		}).catch(function(err) {
      return ({error: 'Server error'});
      console.error(err);
      throw err;
		});
	},

	byDate: function(req, res) {
		Trds.find({raceDate: req.params.id}).sort({name: 'asc'}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	score: function(req, res) {
		if(req.body && req.body.trdData && req.body.trdData.id) {
			return scoreRace(req, res);
		} else {
			return res.send(JSON.stringify({success: false, failMsg: 'Invalid Score Data'}));
		}
	}
	
};

function scoreRace(req, res, self) {
	var trdData = req.body.trdData;
	var trId = req.body.trId;
	var raceNum = req.body.raceNum;
	var finalRaceId = trId +'-'+ raceNum;
	var scoreData;
	trdData.races.forEach(function(race) {
		if(parseInt(race.number) == parseInt(raceNum)) {
			scoreData = race.score;
		}
	});
	return Trds.update({id: trdData.id}, {races: trdData.races}, false, false).then(function(scoredData) {
console.log(' ');
console.log('scoredData[0].races[0].score:');
console.log(scoredData[0].races[0].score);
console.log(' ');
		return TrdsService.getAffectedWagers(finalRaceId).then(function(affectedWagers) {
console.log(' ');
console.log('affectedWagers:');
console.log(affectedWagers);
console.log(' ');
console.log(' ');
console.log('scoreData:');
console.log(scoreData);
console.log(' ');
			return affectedWagers.forEach(function(wager) {
				if(wager.wagerPool === 'Win') {
console.log('scoreData.firstNumber: '+scoreData.firstNumber);
					if(wager.wagerSelections.length > 1) {
						var winSelections = wager.wagerSelections.split(',');
console.log('winSelections:');
console.log(winSelections);
						if(winSelections.indexOf(scoreData.firstNumber) > -1) {
						}
					} else {
console.log('typeof wager.wagerSelections: '+typeof wager.wagerSelections);
console.log('wager.wagerSelections:');
console.log(wager.wagerSelections);
						if(wager.wagerSelections.toString() === scoreData.firstNumber) {
console.log('Win wager winner: '+wager.wagerSelections.toString());
							var result = parseFloat((parseFloat(wager.wagerAmount) / 2) * parseFloat(scoreData.firstWinPrice));
console.log('result: '+result);
						} else {
console.log('Win wager loser: '+winSelections.toStr());
						}
					}
				}
			});
		});
		
	//	res.send(JSON.stringify(results));
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}



