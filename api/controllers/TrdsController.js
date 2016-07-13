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
		if(req.body && req.body.trdData && req.body.trdData.id && req.body.customerId && req.body.customerId === '5765aec37e7e6e33c9203f4d') {
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
		return TrdsService.getAffectedWagers(finalRaceId).then(function(affectedWagers) {
			var affectedCustomerIds = [];
			var first = true;
			affectedWagers.forEach(function(wager) {
				if(first) {
					affectedCustomerIds.push(wager.tournamentId);
					first = false;
				}
				if(affectedCustomerIds.indexOf(wager.customerId) < 0) {
					affectedCustomerIds.push(wager.customerId);
				}
				var result = parseInt(0);
				if(wager.wagerPool === 'Win') {
					if(wager.wagerSelections.length > 1) {
						var wagerSelections = wager.wagerSelections.split(',');
						if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
							result += ((wager.wagerAmount / 2) * scoreData.firstWinPrice);
						}
					} else {
						if(wager.wagerSelections.toString() === scoreData.firstNumber) {
							result += ((wager.wagerAmount / 2) * scoreData.firstWinPrice);
						}
					}
				}
				if(wager.wagerPool === 'Place') {
					if(wager.wagerSelections.length > 1) {
						var wagerSelections = wager.wagerSelections.split(',');
						if(wagerSelections.indexOf(scoreData.firstNumber) > -1) {
							result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
						}
						if(wagerSelections.indexOf(scoreData.secondNumber) > -1) {
							result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
						}
					} else {
						if(wager.wagerSelections.toString() === scoreData.firstNumber) {
							result += ((wager.wagerAmount / 2) * scoreData.firstPlacePrice);
						}
						if(wager.wagerSelections.toString() === scoreData.secondNumber) {
							result += ((wager.wagerAmount / 2) * scoreData.secondPlacePrice);
						}
					}
				}
				TrdsService.scoreWager(wager.id, result).then(function(updateWagerResponse) {
					if(updateWagerResponse.success) {
//						TrdsService.updateCredits(wager.tournamentId, wager.customerId, result).then(function(updateCreditsResponse) {
// TODO How do I force each updateCredits() call to complete before starting the next?
//							if(!updateCreditsResponse.success) {
//console.log('updateCreditsResponse error:');
//console.log(updateCreditsResponse.err);
//							}
//						});
					} else {
console.log('updateWagerResponse error:');
console.log(updateWagerResponse.err);
					}
				});
			});
			return res.send(JSON.stringify({success: true, acIds: affectedCustomerIds}));
		});
		
	//	res.send(JSON.stringify(results));
	}).catch(function(err) {
		res.json({error: 'Server error'}, 500);
		console.error(err);
		throw err;
	});
}



