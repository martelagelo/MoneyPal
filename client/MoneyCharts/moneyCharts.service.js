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
		}

		var getCostMonth = function(year, month) {
			return $http.get('/charts/cost/month?year='+year+'&month='+month);
		}

		var getCostYear = function(year) {
			return $http.get('/charts/cost/year?year='+year);
		}

		return {
			getMoneyEntries  : getMoneyEntries,
			deleteMoneyEntry : deleteMoneyEntry,
			updateMoneyEntry : updateMoneyEntry,
			createMoneyEntry : createMoneyEntry,
			getCostDay		 : getCostDay, 
			getCostMonth     : getCostMonth, 
			getCostYear		 : getCostYear, 
		}

});