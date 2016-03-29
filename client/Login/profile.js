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