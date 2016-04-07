(function(){
	angular.module('moneyPal', [
		'ngRoute',
		'ui.router',
		'moneyPal.core',
		'moneyPal.login',
		'moneyPal.moneyCharts',
		'moneyPal.layout',
		'moneyPal.moneyData',
	]);
}());