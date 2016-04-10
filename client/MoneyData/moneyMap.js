(function(){
	angular.module('moneyPal.moneyData')
	.controller('moneyMapController', moneyMapController);

	function moneyMapController($scope, loginDataService, authToken, $location, moneyDataService) {

		moneyDataService.getMoneyLocations().success(function(resp) {
			initAutocomplete(resp.listOfLocations);
		}).error(function(err, status) {
			$location.path('/login'); 
		});

		function initAutocomplete(entries) {
        	var map = new google.maps.Map(document.getElementById('googleMap'), {
          		center: {lat: 38.5, lng: -98},
          		zoom: 4,
          		mapTypeId: google.maps.MapTypeId.ROADMAP
        	});
        	codeAddress(map, entries);
      	};

      	function codeAddress(map, entries) {
      		var geocoder = new google.maps.Geocoder;
		    entries.forEach(function(entry) {
		    	if(entry.location === null) {
		    		//console.log(entry.description + ": Did not have a location");
				} else {
					if (!entry.latlng || entry.latlng == null) {
						geocoder.geocode({'address': entry.location}, function(results, status) {
					      	if (status == google.maps.GeocoderStatus.OK) {
					        	var marker = new google.maps.Marker({
					            	map: map,
					            	position: results[0].geometry.location,
					            	title: entry.description
					        	});
					      	} else {
					      		//console.log(entry.location + ": Failed to find");
					       	 	alert("Geocode was not successful for the following reason: " + status);
					      	}
					    });
					} else {
						var marker = new google.maps.Marker({
			            	map: map,
			            	position: entry.latlng,
			            	title: entry.description
			        	});
					}
				}
			});
		};

    };
}());