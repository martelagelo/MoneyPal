(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('automaticController', automaticController);

	function automaticController($scope, loginDataService, moneyChartsService, authToken, $location, $state) {
		var user = loginDataService.getUserInfo();

	};
}());