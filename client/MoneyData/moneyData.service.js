angular.module('moneyPal.moneyData')
	.factory('moneyDataService', function($http, loginDataService){

	var getMoneyLocations = function() {
		return $http.get('/data/locations');
	};

	var getTopics = function() {
		return $http.get('/topic');
	};

	var getFilteredTopics = function() {
		return $http.get('/topic/filtered');
	};

	return {
		getMoneyLocations : getMoneyLocations,
		getTopics 		  : getTopics,
		getFilteredTopics : getFilteredTopics
	};
});