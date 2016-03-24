(function() {
	var app = angular.module('moneyPal');

	app.config(function($stateProvider,$urlRouterProvider,$httpProvider){
		$urlRouterProvider.when('','/login');
		$urlRouterProvider.otherwise(function ($injector, $location) {
    		return '/error';
  		});
		$stateProvider
			.state("login", {
				url: "/login",
				templateUrl: "/Login/login.html",
				controller: "loginController"
			})
			.state("dayCharts", {
				url:"/dayCharts",
				templateUrl: "/MoneyCharts/dayCharts.html",
				controller: "dayChartsController"
			})
			.state("newMoneyEntry", {
				url:"/newMoneyEntry",
				templateUrl: "/MoneyCharts/newMoneyEntry.html",
				controller: "newMoneyEntryController"
			})
			.state("monthCharts", {
				url:"/monthCharts",
				templateUrl: "/MoneyCharts/monthCharts.html",
			})
			.state("header",{
				url:"/header",
				templateUrl:"/Layouts/header.html",
				controller:"headerController"
			})
			.state("sidebar", {
				url:"/sidebar",
				templateUrl:"/Layouts/sidebar.html",
				controller:"sidebarController"
			})
			.state("changePassword", {
				url:"/changePassword",
				templateUrl:"/Login/changePassword.html",
				controller:"changePasswordController"
			})
			.state("moneyMap", {
				url:"/moneyMap", 
				templateUrl:"/MoneyData/moneyMap.html",
			})
		$httpProvider.interceptors.push('authInterceptor');
	});	
}());