db = new Mongo().getDB('horse');

getSSCustomers();

function getSSCustomers() {
	var cursor = db.customers.find({
		ss: true
	});
	while(cursor.hasNext()) {
		var customer = cursor.next();
		getRandP(customer);
	};
}

function getRandP(customer) {
	var randP = randomIntFromInterval(1,10);
	getRandA(customer, randP);
}

function getRandA(customer, randP) {
	var randA = randomIntFromInterval(1,10);
	updateCustomer(customer, randP, randA);
}

function updateCustomer(customer, randP, randA) {
	var wagerPreference = '';
	var wagerAggression = '';
	if(randP == 1 || randP == 4 || randP == 7 || randP == 10) {
		wagerPreference = 'horizontal';
		var randA = randomIntFromInterval(1,10);
		if(randA == 2 || randP == 5 || randP == 8) {
			wagerAggression = 'high';
		}
		if(randA == 3 || randP == 6 || randP == 9) {
			wagerAggression = 'low';
		}
		if(randA == 1 || randP == 4 || randP == 7|| randP == 10) {
			wagerAggression = 'medium';
		}
	}
	if(randP == 2 || randP == 5 || randP == 8) {
		wagerPreference = 'vertical';
		var randA = randomIntFromInterval(1,10);
		if(randA == 2 || randP == 5 || randP == 8) {
			wagerAggression = 'high';
		}
		if(randA == 3 || randP == 6 || randP == 9) {
			wagerAggression = 'medium';
		}
		if(randA == 1 || randP == 4 || randP == 7|| randP == 10) {
			wagerAggression = 'low';
		}
	}
	if(randP == 3 || randP == 6 || randP == 8) {
		wagerPreference = 'wps';
		var randA = randomIntFromInterval(1,10);
		if(randA == 2 || randP == 5 || randP == 8) {
			wagerAggression = 'medium';
		}
		if(randA == 3 || randP == 6 || randP == 9) {
			wagerAggression = 'low';
		}
		if(randA == 1 || randP == 4 || randP == 7|| randP == 10) {
			wagerAggression = 'high';
		}
	}
print(' ');
print('wagerPreference: '+wagerPreference);
print('wagerAggression: '+wagerAggression);
	
	db.customers.update(
		{fName: customer.fName, lName: customer.lName, username: customer.username, city: customer.city, dollars: customer.dollars}, 
		{$set: {wagerPreference: wagerPreference, wagerAggression: wagerAggression}}, 
		false, 
		false
	);
}

function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}










