db = new Mongo().getDB('horse');

var d = new Date();
var year = d.getFullYear();
var month = d.getMonth() - 1;
var date = d.getDate();

print('year: '+year);
print('month: '+month);
print('date: '+date);

if(month < 10) {
	month = '0' + month;
}

var useDate = year + month + date;
print('useDate: '+useDate);

getTournaments(useDate);

function getTournaments(useDate) {
	var cursor = db.trds.find({raceDate: useDate});
	while(cursor.hasNext()) {
		var trdData = cursor.next();
		var trackId = trdData.id;
print(trackId);
	}
}

