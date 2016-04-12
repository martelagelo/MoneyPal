(function() {
	angular.module('moneyPal.login')
	.controller('changePasswordController', changePasswordController);

	function changePasswordController($scope, $location, loginDataService) {
		$scope.submitEditPassword = function(){
			if($scope.old_password) {
				loginDataService.comparePasswords($scope.old_password).success(function(resp) {
					if (resp.status == false) {
						swal("Error", "You have provided an invalid password. To make changes to your account information, please enter your current password", "error");
					} else {
						if($scope.new_password && $scope.new_password_repeat) {
							if($scope.new_password == $scope.new_password_repeat) {
								loginDataService.changePassword({password: $scope.new_password}).success(function(resp) {
									swal("Success!", "Your password has been successfully changed!", "success");
			 						$location.path('/dayCharts');
			 					}).error(function(err) {
			 						swal("Error", "Your password could not be changed...", "error");
			 						$location.path('/login');
							 	});
							} else swal("Error", "The password confirmation provided does not match your password", "error");
						} else swal("Error", "You need to confirm your new password", "error");
					}
				}).error(function(resp) {
					$location.path('/login');
				});
			} else {
				swal("Error", "You have to provide your old password", "error");
			}
		};
	};
}());