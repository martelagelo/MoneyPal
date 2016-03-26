(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('dayChartsController', dayChartsController);

	function dayChartsController($scope, loginDataService, moneyChartsService, authToken, $location, $state) {
		var user = loginDataService.getUserInfo();

		//console.log($location.search().param); 
		if(user === null) $location.path('/login');

		if ($location.search().param == undefined) {
			$scope.date = new Date();
			$scope.allTransactions = true;
			moneyChartsService.getMoneyEntries().success(function(resp) {
				$scope.entries = resp.allMoneyEntries;
				$scope.editArray = makeEditArray(resp.allMoneyEntries);
				$scope.totCost = money_round(calculateTotalDailyCost(resp.allMoneyEntries));
			}).error(function(err, status) {
				if (status == 401) {
					console.log("I hit an error");
					if(user != null) loginDataService.removeUserInfo();
					$location.path('/login');
				}
				else {
					console.log("I hit an error");
					//$location.path('/login'); 
				}
        		return err; 
			});
		} else {
			var param = $location.search().param.split('-');
			$scope.date = new Date(param[0], param[1], param[2]);
			$scope.allTransactions = false;
			moneyChartsService.getMoneyEntriesByDay(param[0], param[1], param[2]).success(function(resp) {
				$scope.entries = resp.allMoneyEntries;
				$scope.editArray = makeEditArray(resp.allMoneyEntries);
				$scope.totCost = money_round(calculateTotalDailyCost(resp.allMoneyEntries));
			}).error(function(err, status) {
				if (status == 401) {
					console.log("I hit an error");
					if(user != null) loginDataService.removeUserInfo();
					$location.path('/login');
				}
				else {
					console.log("I hit an error");
					//$location.path('/login'); 
				}
        		return err; 
			});
		}
		
		$scope.goToToday = function() {
			var d = new Date();
			var param = ''+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+'';
			$location.path('/dayCharts/').search({param: param});
		}

		$scope.deleteMoneyEntry = function(entry) {
			moneyChartsService.deleteMoneyEntry(entry).success(function(resp) {
				var index = $scope.entries.indexOf(entry);
  				$scope.entries.splice(index, 1); 
  				$scope.totCost = money_round(calculateTotalDailyCost($scope.entries));
  				swal("Success!", "Entry deleted!", "success");
  				$scope.$broadcast('updateCosts');
				//$state.reload();
			}).error(function(err) {
				swal("Cancelled", "Could not delete entry", "error");
				return err;
				//Create a modal for failing to delete the report
			});
		};

		$scope.editMoneyEntry = function(Entry) {
			
			var select = document.getElementById(Entry._id+"_select");
			var selectValue = select.options[select.selectedIndex].value;

			if(selectValue == "expenditure") var selectBool = true;
			else var selectBool = false;

			var date = document.getElementById(Entry._id+"_date").valueAsDate;
			date.setDate(date.getDate()+1);
			
			var submitMoneyEntry = {
				entry:{
					date        : date,
					description : document.getElementById(Entry._id+"_des").value,
					cost        : document.getElementById(Entry._id+"_cost").value,
					userId      : user._id,
					isCost		: selectBool,
					year        : date.getFullYear(),
					month		: date.getMonth(),
					day 		: date.getDate(),
				}
			};
			moneyChartsService.updateMoneyEntry(submitMoneyEntry, Entry._id).success(function(response){
				swal("Success!", "Entry updated!", "success");
				$state.reload();
				$scope.$broadcast('updateCosts');
			}).error(function(err){
				if(err.status === 401) $state.go('/login');
			}); 
		};

		$scope.isEdit = function(entry) {
			return $scope.editArray[$scope.entries.indexOf(entry)];
		};

		$scope.toggleEdit = function(entry) {
			$scope.editArray[$scope.entries.indexOf(entry)] = !$scope.editArray[$scope.entries.indexOf(entry)]
			if($scope.editArray[$scope.entries.indexOf(entry)] == true) {
				document.getElementById(entry._id+"_date").valueAsDate = new Date(entry.year, entry.month, entry.day);
				document.getElementById(entry._id+"_des").value = entry.description;
				document.getElementById(entry._id+"_cost").value = entry.cost;
			}
		};

		function makeEditArray(entries) {
			var arr = [];
			arr.length = entries.length;
			for (var i = 0; i < arr.length; i++) {
				arr[i] = false;
			}
			return arr;
		};

		function calculateTotalDailyCost(entries) {
			var totCost = 0;
			entries.forEach(function(entry) {
				if (entry.isCost) totCost = totCost - entry.cost;
				else totCost = totCost + entry.cost;
			});
			return totCost;
		};

		function money_round(num) {
    		return Math.ceil(num * 100) / 100;
		}
	
	};
}());