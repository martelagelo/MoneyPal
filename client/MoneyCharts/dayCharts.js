(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('dayChartsController', dayChartsController);

	function dayChartsController($scope, loginDataService, moneyChartsService, authToken, $location, $state) {
		var user = loginDataService.getUserInfo();

		//console.log($location.search().param); 
		if(user === null) $location.path('/login');

		$scope.isNewEntry = false;
		var coord;
		//getLocation();
		var Param;

		if ($location.search().param == undefined) {
			Param = null;
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
			Param = $location.search().param;
			console.log(Param);
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

		$scope.createMoneyEntry = function() {
			if($scope.newDescription && $scope.newCost && $scope.newSelect) {

				if ($scope.newDate) var newDate = $scope.newDate;
				else var newDate = new Date();

				if ($scope.newSelect == "gain") var selectBool = false;
				else var selectBool = true;

				var entry = {
					entry: {
						date        : newDate,
						description : $scope.newDescription,
						cost        : $scope.newCost,
						userId      : user._id,
						isCost		: selectBool,
						year		: newDate.getFullYear(),
						month		: newDate.getMonth(),
						day 		: newDate.getDate(),
						dayOfWeek   : newDate.getDay(),
						location  	: $scope.curLocation,
						latlng      : {lat : coord.lat, lng : coord.lng},
					}
				};

				moneyChartsService.createMoneyEntry(entry).success(function(response) {
					swal("Success!", "Entry Created!", "success");
					//$state.reload();
					$scope.entries.push(entry.entry);
					$scope.editArray = makeEditArray($scope.entries);
					$scope.totCost = money_round(calculateTotalDailyCost($scope.entries));
					$scope.toggleNewEntry();

					$scope.$broadcast('updateCosts');
				}).error(function(err) {
					if(err.status === 401) $state.go('/login');
				});
			} else swal("Error", "An entry is missing.", "error");
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

				//if (param == null) $state.go('/dayCharts');
				//else $location.path('/dayCharts/').search({param: Param});

				var index = $scope.entries.indexOf(Entry);
  				$scope.entries.splice(index, 1); 
  				$scope.entries.push(response.data);

				$scope.editArray = makeEditArray($scope.entries);
				$scope.totCost = money_round(calculateTotalDailyCost($scope.entries));
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

		$scope.toggleNewEntry = function() {
			$scope.isNewEntry = !$scope.isNewEntry;
			if ($scope.isNewEntry == true) getLocation();
		}

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
		};

		function getLocation() {
			if (navigator.geolocation) {
		    	navigator.geolocation.getCurrentPosition(function(position) {
		      	var pos = {
		        	lat: position.coords.latitude,
		        	lng: position.coords.longitude
		      	};
		      	coord = pos;
		      	geocodeLatLng(pos);
		    }, function() {
		      	handleLocationError(true, infoWindow);
		    });
		  	} else {
		    	// Browser doesn't support Geolocation
		    	handleLocationError(false, infoWindow);
			}
		};

		function geocodeLatLng(pos) {
		  	var geocoder = new google.maps.Geocoder;
		  	geocoder.geocode({'location': pos}, function(results, status) {
		    	if (status === google.maps.GeocoderStatus.OK) {
		      		if (results[1]) {
		        		$scope.curLocation = String(results[1].formatted_address);
		        		console.log($scope.curLocation);
		      		} else {
		        		window.alert('No results found');
		      		}
		    	} else {
		      		window.alert('Geocoder failed due to: ' + status);
		    	}
		  });
		};

		function handleLocationError(browserHasGeolocation, infoWindow) {
			//Do Something;
		};
	
	};
}());