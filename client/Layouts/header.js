(function() {
	var app = angular.module('moneyPal.layout', []);

	var headerController = function($scope, $interval, $location, loginDataService, moneyChartsService, authToken, $state, layoutService) {
		var user = loginDataService.getUserInfo();

		if(user == null || user == undefined) $location.path('/login');
		$scope.name = user.firstName + " " + user.lastName;

		getCosts();

		//SPY, NDAQ, DIA
		layoutService.getStock('DIA', '^GSPC', '^IXIC').success(function(resp) {
			$scope.stocks = resp.stocks;
		}).error(function(err) {
			console.log("Could not get yahoo data");
		});

		$scope.$on('updateCosts', function(event, args) {
			getCosts();
		});
		$scope.$on('changeProf', function(event,args) {
			user = loginDataService.getUserInfo();
			$scope.name = user.firstName + " " + user.lastName;
			getCosts();
		});

		function getCosts() {
			var date = new Date();

			moneyChartsService.getCostDay(date.getFullYear(), date.getMonth(), date.getDate()).success(function(resp) {
				$scope.totDayCost = sumCosts(resp.listOfCosts);

				moneyChartsService.getCostMonth(date.getFullYear(), date.getMonth()).success(function(resp) {
					$scope.totMonthCost = sumCosts(resp.listOfCosts);

					moneyChartsService.getCostYear(date.getFullYear()).success(function(resp) {
						$scope.totYearCost = sumCosts(resp.listOfCosts);
						$scope.dayPercent = percent_round(Math.abs($scope.totDayCost/user.salary));
						$scope.monthPercent = percent_round(Math.abs($scope.totMonthCost/user.salary));
						$scope.yearPercent = percent_round(Math.abs($scope.totYearCost/user.salary));
						
					}).error(function(err) {
						//Try to do nothing...
					});
				}).error(function(err) {
					//Try to do nothing...
				});
			}).error(function(err, status) {
				if (status == 401) {
					console.log("I hit an error in header");
					if(user != null) loginDataService.removeUserInfo();
					$location.path('/login');
				}
			});
		};

		$scope.logout = function(){
			loginDataService.logout().then(function(user){
				authToken.removeToken();
				loginDataService.removeUserInfo();
				$location.path('/login');
			}, function(err){
				return err;
			});
		}; 

		function sumCosts(entries) {
			var totCost = 0;
			entries.forEach(function(entry) {
				if (entry.isCost) totCost = totCost - entry.cost;
				else totCost = totCost + entry.cost;
			});
			return money_round(totCost);
		};

		function percent_round(num) {
    		return Math.ceil(num * 10000)/100;
		};

		function money_round(num) {
			return Math.ceil(num * 100)/100;
		};
		
	};
	app.controller("headerController", headerController);
}());