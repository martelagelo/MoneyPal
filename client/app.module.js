(function(){
	angular.module('moneyPal', [
		'ngRoute',
		'ui.router',
		'moneyPal.login',
		'moneyPal.moneyCharts',
		'moneyPal.layout',
		'moneyPal.moneyData',
	]);
}());