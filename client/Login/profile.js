(function() {
	angular.module('moneyPal.login')
	.controller('profileController', profileController);

	function profileController($scope, $location, loginDataService) {
		var user = loginDataService.getUserInfo();
		//console.log(user);
		
		$scope.firstName = user.firstName;
		$scope.lastName = user.lastName;
		$scope.email = user.email;
		$scope.salary = user.salary;

		//$.getJSON("http://finance.yahoo.com/webservice/v1/symbols/^IXIC/quote?format=json", function( data ) {
		//	console.log(data);
		//});

		// $.ajax({
  //   		type: "GET",
  //   		dataType: 'JSON',
  //   		url: "http://finance.yahoo.com/webservice/v1/symbols/^IXIC/quote?format=json",
  //   		crossDomain : true,
  //   	}).done(function(data) {
  //   		console.log(data);
  //   	});

    	function createCORSRequest(method, url) {
		  	var xhr = new XMLHttpRequest();
		  	if ("withCredentials" in xhr) {
				// Check if the XMLHttpRequest object has a "withCredentials" property.
		    	// "withCredentials" only exists on XMLHTTPRequest2 objects.
		    	xhr.open(method, url, true);
		  	} else if (typeof XDomainRequest != "undefined") {
		    	// Otherwise, check if XDomainRequest.
		    	// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		    	xhr = new XDomainRequest();
		   	 	xhr.open(method, url);
		  	} else {
		    	// Otherwise, CORS is not supported by the browser.
		    	xhr = null;
		  	}
		  	return xhr;
		}

		//var xhr = createCORSRequest('GET', "http://finance.yahoo.com/webservice/v1/symbols/^IXIC/quote?format=json");
		//console.log(xhr);
		// if (!xhr) {
		//   throw new Error('CORS not supported');
		// }

		var url = "http://finance.yahoo.com/webservice/v1/symbols/^IXIC/quote?format=json";
		var xhr = createCORSRequest('GET', url);
		xhr.send();

		// var request = new XMLHttpRequest();
		// request.open("GET", "http://finance.yahoo.com/webservice/v1/symbols/^IXIC/quote?format=json", true);
		// request.onreadystatechange = function() {//Call a function when the state changes.
		//     if (request.readyState == 4) {
		//         if (request.status == 200 || request.status == 0) {
		//             console.log(request.responseText);
		//         }
		//     }
		// }
		// request.send();

		$scope.submitChange = function() {
			if($scope.firstName && $scope.lastName && $scope.email && $scope.salary) {
				if(!isNaN($scope.salary)) {
					var profile = {
						firstName : $scope.firstName,
						lastName  : $scope.lastName,
						email 	  : $scope.email,
						salary	  : $scope.salary
					};
					loginDataService.changeProfile(profile).success(function(user) {
						loginDataService.setUserInfo(user.user);
						swal("Success!", "Entry Created!", "success");
						$scope.$broadcast('changeProf');
					}).error(function(err) {
						console.log("There was an error with changing the profile");
						swal("Error", "An error occured when changing your profile", "error");
					});	
				} else swal("Error", "Cost must be a valid number", "error");
			} else swal("Error", "One of the spaces is not filled.", "error");
		}
	};
}());