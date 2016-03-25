(function() {
	angular.module('moneyPal.login')
	.controller('loginController', loginController);

	function loginController($scope, $location, loginDataService) {
		var user = loginDataService.getUserInfo();

		if(user != null) $location.path('/dayCharts');
		else $location.path('/login');

		$scope.submitLoginInfo = function() {
			if(!$scope.userinfo.username || !$scope.userinfo.password) {
				swal("Incomplete", "Either your password or username is missing", "error");
				$('#user-password').val('');
			}
			else {
				loginDataService.login({
					'username': $scope.userinfo.username,
					'password': $scope.userinfo.password
				}).then(function(user) {
					loginDataService.setUserInfo(user);
					var d = new Date();
					var param = ''+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+'';
					$location.path('/dayCharts/').search({param: param});
				}, function(err){
					swal("Incorrect", "Wrong username or password", "error");
					$('#user-password').val('');
				});
			}
		}

		
	};
}());