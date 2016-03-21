angular.module("moneyPal.login")
	.factory("loginDataService", function($q, $window, $http, authToken) {
		var user = {};
		var userinfo = $window.localStorage;

		var getUserInfo = function() {
			var userDetails = JSON.parse(userinfo.getItem('userdetails'));
			return userDetails;
		};

		var setUserInfo = function(value) {
			var userdetails = angular.copy(value);
			userinfo.setItem('userdetails', JSON.stringify(userdetails));
		};

		/*************Login Details*************/
		var login = function(userinfos){
			if (userinfos!=null) return $http.post('/login', userinfos).then(loginSuccess,loginFailure); 
		};

		var loginSuccess = function(resp) {
			user = resp.data.user;
			authToken.setToken(resp.data.token);		
			return user;
		};

		var loginFailure = function(err){
			return $q.reject(err.data);
		};
		/************End Login Details**********/

		var logout = function(){
			return $http.post('/logout');
		};

		var removeUserInfo = function(){
			userinfo.removeItem('userdetails');
		};

		/**************Password*******************/
		var changePassword = function(password) {
			return $http.put('/login/change_password', {data:password});
		};

		var comparePasswords = function(password) {
			return $http.post('/login/compare_passwords', {data:password});
		};

		return {
			getUserInfo      : getUserInfo,
			setUserInfo      : setUserInfo,
			login            : login,
			logout           : logout,
			removeUserInfo   : removeUserInfo,
			changePassword   : changePassword,
			comparePasswords : comparePasswords
		};
	});