angular.module('moneyPal.moneyCharts')
	.factory('moneyChartsService', function($http, loginDataService){

		var getMoneyEntries = function() {
			var user = loginDataService.getUserInfo();
			return $http.get('/dayCharts/'+user._id);
		};

		var deleteMoneyEntry = function(entry) {
			return $http.delete('/dayCharts/'+entry._id);
		};

		var createMoneyEntry = function(entry) {
			return $http.post('/dayCharts', entry);
		};

		var updateMoneyEntry = function(entry,id){
			return $http.put('/dayCharts/'+id, entry);
		};

		var getCostDay = function(year, month, day) {
			return $http.get('/charts/cost/day?year='+year+'&month='+month+'&day='+day);
		};

		var getCostMonth = function(year, month) {
			return $http.get('/charts/cost/month?year='+year+'&month='+month);
		};

		var getCostYear = function(year) {
			return $http.get('/charts/cost/year?year='+year);
		};

		var getCalendarCosts = function() {
			return $http.get('/charts/cost/calendar');
		};

		var getMoneyEntriesByDay = function(year, month, day) {
			return $http.get('/dayChartsByDay?year='+year+'&month='+month+'&day='+day);
		};

		var createAutomaticEntry = function(entry) {
			return $http.post('/automatic', entry);
		};

		var getAutomaticEntries = function() {
			return $http.get('/automatic/'+loginDataService.getUserInfo()._id);
		}

		var deleteAutomaticEntry = function(entry) {
			return $http.delete('/automatic/' + entry._id);
		}

		return {
			getMoneyEntries  	 : getMoneyEntries,
			deleteMoneyEntry 	 : deleteMoneyEntry,
			updateMoneyEntry 	 : updateMoneyEntry,
			createMoneyEntry 	 : createMoneyEntry,
			getCostDay		 	 : getCostDay, 
			getCostMonth     	 : getCostMonth, 
			getCostYear		 	 : getCostYear, 
			getCalendarCosts 	 : getCalendarCosts,
			getMoneyEntriesByDay : getMoneyEntriesByDay,
			createAutomaticEntry : createAutomaticEntry,
			getAutomaticEntries  : getAutomaticEntries,
			deleteAutomaticEntry : deleteAutomaticEntry,
		}

});