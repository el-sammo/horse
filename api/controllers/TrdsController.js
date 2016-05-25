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

	byDate: function(req, res) {
		Trds.find({raceDate: req.params.id}).sort({name: 'asc'}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	}
	
};

