(function(){
	angular.module('moneyPal', [
		'ui.router',
		'moneyPal.login',
		'moneyPal.moneyCharts',
		'moneyPal.layout',
		'moneyPal.moneyData',
	]);
}());