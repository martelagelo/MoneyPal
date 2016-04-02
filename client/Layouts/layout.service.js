angular.module('moneyPal.layout')
	.factory('layoutService', function($http){	

	var getStock = function(stock1, stock2, stock3) {
		return $http.get('/stock?stock1='+stock1+"&stock2="+stock2+"&stock3="+stock3);
	};

	return {
		getStock : getStock
	};
});