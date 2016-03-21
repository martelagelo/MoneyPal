(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('newMoneyEntryController', newMoneyEntryController);

	function newMoneyEntryController($scope, loginDataService, moneyChartsService, authToken, $location) {
		var user = loginDataService.getUserInfo();
		
		if(user === null) $location.path('/login');
		getLocation();

		$scope.submitMoneyEntry = function() {
			if($scope.description && $scope.cost && $scope.entryType) {
				if(!isNaN($scope.cost)) {
					var des = $scope.description;
					var cost = $scope.cost;

					if($scope.entryType == "expenditure") var selectBool = true;
					else if($scope.entryType == "gain") var selectBool = false;

					if($scope.inputDate === null || $scope.inputDate === undefined) var curDate = new Date();
					else var curDate = $scope.inputDate;

					if(!$scope.location) var location = $scope.curLocation;
					else var location = $scope.location;

					var entry = {
						entry: {
							date        : curDate,
							description : des,
							cost        : cost,
							userId      : user._id,
							isCost		: selectBool,
							year		: curDate.getFullYear(),
							month		: curDate.getMonth(),
							day 		: curDate.getDate(),
							dayOfWeek   : curDate.getDay(),
							location  	: location,
						}
					};
					moneyChartsService.createMoneyEntry(entry).success(function(response) {
						swal("Success!", "Entry Created!", "success");
						$location.path('/dayCharts');
					}).error(function(err) {
						if(err.status === 401) $state.go('/login');
					})
				} else {
					swal("Error", "Cost must be a valid number", "error");
				}
			} else if (!$scope.description) {
				swal("Error", "You need to input a description", "error");
			} else if (!$scope.cost) {
				swal("Error", "You need to input a cost", "error");
			} else if (!$scope.entryType) {
				swal("Error", "You need to select an entry type", "error");
			}
		};

		function getLocation() {
			if (navigator.geolocation) {
		    	navigator.geolocation.getCurrentPosition(function(position) {
		      	var pos = {
		        	lat: position.coords.latitude,
		        	lng: position.coords.longitude
		      	};
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