(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('dayChartsController', dayChartsController);

	function dayChartsController($scope, loginDataService, moneyChartsService, authToken, $location, $state) {
		var user = loginDataService.getUserInfo();
		
		if(user === null) $location.path('/login');
		else {
			$scope.date = new Date();
			moneyChartsService.getMoneyEntries().success(function(resp) {
				$scope.entries = resp.allMoneyEntries;
				$scope.user = resp.user;
				$scope.editArray = makeEditArray(resp.allMoneyEntries);
				$scope.totCost = money_round(calculateTotalDailyCost(resp.allMoneyEntries));
			}).error(function(err, status) {
				if (status == 401) {
					console.log("I hit here");
					if(user != null) loginDataService.removeUserInfo();
					$location.path('/login');
				}
				else {
					console.log("I hit there");
					$location.path('/login'); 
				}
        		return err; 
			});
		}

		$scope.deleteMoneyEntry = function(entry) {
			moneyChartsService.deleteMoneyEntry(entry).success(function(resp) {
				var index = $scope.entries.indexOf(entry);
  				$scope.entries.splice(index, 1); 
  				$scope.totCost = money_round(calculateTotalDailyCost($scope.entries));
  				swal("Success!", "Entry deleted!", "success");
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
				totCost = totCost - entry.cost;
			});
			return totCost;
		};

		function money_round(num) {
    		return Math.ceil(num * 100) / 100;
		}
	
	};
}());