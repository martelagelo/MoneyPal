angular.module('moneyPal.moneyData')
	.factory('moneyDataService', function($http, loginDataService){

	var getMoneyLocations = function() {
		return $http.get('/data/locations');
	};

	return {
		getMoneyLocations: getMoneyLocations
	};
});