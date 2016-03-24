(function(){
	angular.module('moneyPal.moneyData')
	.controller('moneyMapController', moneyMapController);

	function moneyMapController($scope, loginDataService, authToken, $location, moneyDataService) {

		var user = loginDataService.getUserInfo();

		moneyDataService.getMoneyLocations().success(function(resp) {
			console.log(resp.listOfLocations);
			initAutocomplete(resp.listOfLocations);
		}).error(function(err, status) {
			$location.path('/login'); 
		});

		//iniMap();
		//locationManager.init();

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
				} else {
				    geocoder.geocode({'address': entry.location}, function(results, status) {
				    	console.log(entry.location);
				      	if (status == google.maps.GeocoderStatus.OK) {
				        	//map.setCenter(results[0].geometry.location);
				        	var marker = new google.maps.Marker({
				            	map: map,
				            	position: results[0].geometry.location,
				            	title: entry.description
				        	});
				      	} else {
				      		console.log("I hit here");
				       	 	alert("Geocode was not successful for the following reason: " + status);
				      	}
				    });
				}
			});

		};

		function delay(ms) {
	        var cur_d = new Date();
	        var cur_ticks = cur_d.getTime();
	        var ms_passed = 0;
	        while(ms_passed < ms) {
	            var d = new Date();  // Possible memory leak?
	            var ticks = d.getTime();
	            ms_passed = ticks - cur_ticks;
	            // d = null;  // Prevent memory leak?
	        }
	    };
    };
}());