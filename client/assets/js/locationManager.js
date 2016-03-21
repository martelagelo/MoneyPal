var locationManager =  (function(){
	
	var locationManager = {
		map: null,

		init: function(){
			map = new google.maps.Map(document.getElementById('googleMap'), {
      			center: {lat: -34.397, lng: 150.644},
      			zoom: 8
    		});
    		console.log("I hit here");
		},
	};

	self = locationManager;

	return locationManager;
})();
