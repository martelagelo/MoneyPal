(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('automaticController', automaticController);

	function automaticController($scope, loginDataService, moneyChartsService, authToken, $location, $state) {
		var user = loginDataService.getUserInfo();

		$scope.isCreate = false;
		$scope.weekDisabled = false;
		$scope.dayMonthDisabled = false;

		var week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
		var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		var monthIndex = [1,2,3,4,5,6,7,8,9,10,11,12];

		$scope.$on('searchStart', function(event,args) {
			$scope.search = args.search;
		});

		moneyChartsService.getAutomaticEntries().success(function(result) {
			$scope.entries = result.data;
		}).error(function(err) {
			console.log("Error in fetching automatic entries");
		});

		$scope.createEntry = function() {
			if($scope.newCost && $scope.newDescription && $scope.newSelect) {
				if(!isNaN($scope.newCost)) {

					if ($scope.newSelect == "expenditure") var costType = true;
					else var costType = false;

					if($scope.newDayOfWeek || $scope.newMonth) {		//This case if for either weekly on a certain day or yearly on a certain month and day

						if ($scope.newDay) var newDay = $scope.newDay;
						else if($scope.newMonth) var newDay = 1;
						else var newDay = null;

						if ($scope.newDayOfWeek) var newDayOfWeek = week.indexOf($scope.newDayOfWeek.toLowerCase());
						else var newDayOfWeek = null;

						if ($scope.newMonth && isNaN($scope.newMonth)) var newMonth = months.indexOf($scope.newMonth.toLowerCase());
						else if ($scope.newMonth && !isNaN($scope.newMonth)) var newMonth = monthIndex.indexOf(Number($scope.newMonth));
						else var newMonth = null;

						if (newDayOfWeek != -1 && newMonth != -1) {
							var entry = {
								entry: {
									userId		: user._id,
									description : $scope.newDescription,
									cost 		: $scope.newCost,
									dayOfWeek 	: newDayOfWeek,
									month 		: newMonth,
									day 		: newDay,
									isCost		: costType
								}
							}; 
							submitEntry(entry);

						} else swal("Error", "Your day of week or month entry is invalid. Please check and try again.", "error");
					}
					else if (!$scope.newDayOfWeek && !$scope.newMonth && !$scope.newDay) {				//The case is for every day
						var entry = {
							entry: {
								userId		: user._id,
								description : $scope.newDescription,
								cost 		: $scope.newCost,
								isCost		: costType
							}
						}; 
						submitEntry(entry);
					} 
					else {					//This case is for monthly on a certain day
						var entry = {
							entry: {
								userId		: user._id,
								description : $scope.newDescription,
								cost 		: $scope.newCost,
								isCost		: costType,
								day 		: $scope.newDay,
							}
						}; 
						submitEntry(entry);
					}
				} else swal("Error", "Your cost must be a valid number.", "error");
			} else swal("Error", "You must include a description, cost, and cost type.", "error");

		};

		$scope.deleteAutomaticEntry = function(entry) {
			moneyChartsService.deleteAutomaticEntry(entry).success(function(results) {
				var index = $scope.entries.indexOf(entry);
  				$scope.entries.splice(index, 1); 
  				swal("Success!", "Entry deleted!", "success");
			}).error(function(err) {
				console.log("Failed to delete automatic entry");
			});
		}

		$scope.getHelpModal = function() {
			swal({
				title: "<h2> How Automatic Entries Work</h2>",
				text: '<p style="color:#337ab7">Automatic Entries allow you to create transactions that enter themselves automatically based on a certain date.</p>'+
					'<br><p><b>The four formats of an automatic entry are:</b></p><br>'+
					'<ol align="left" style="font-size:14px">'+
						'<li>An entry that occurs every day</li>'+
						'<li>An entry that occurs every week on a given day</li>'+
						'<li>An entry that occurs every month on a given day</li>'+
						'<li>An entry that occurs every year on a given month and day</li>'+
					'</ol>'+
					'<br>'+
					'<p><b>Information about creating a new Automatic Entry</b></p><br>'+
					'<ul align="left" style="font-size:14px">'+
						'<li>For an <b>every day</b> entry: leave <span class="label label-default">day of week</span>, <span class="label label-primary">month</span>, and <span class="label label-success">day of month</span> blank.</li>'+
						'<li>For an <b>every week on a given day</b> entry: only fill in <span class="label label-default">day of week</span>.</li>'+
						'<li>For an <b>every month on a given day</b> entry: only fill in <span class="label label-primary">day of month</span>.</li>'+
						'<li>For an <b>every year on a given month and day</b> entry: fill in <span class="label label-primary">month</span> and <span class="label label-success">day of month</span>.</li>'+
					'</ul>',
				html: true
			});
		};

		$scope.getDayOfWeek = function(entry) {
			if (entry.day == null && entry.month == null && entry.dayOfWeek == null) return "--";
			if (entry.dayOfWeek) return "Every " + week[entry.dayOfWeek].charAt(0).toUpperCase() + week[entry.dayOfWeek].substr(1);
			//else if (entry.day && entry.month == null && entry.dayOfWeek == null) return "Not Applicable";
			else return "--"
		}

		$scope.getMonth = function(entry) {
			if (entry.day == null && entry.month == null && entry.dayOfWeek == null) return "--";
			else if (entry.dayOfWeek) return "--";
			else if (entry.day && entry.month == null && entry.dayOfWeek == null) return "Monthly";
			else return "Yearly, during " + months[entry.month].charAt(0).toUpperCase() + months[entry.month].substr(1);
		}

		$scope.getDay = function(entry) {
			if (entry.day == null && entry.month == null && entry.dayOfWeek == null) return "Every Day";
			else if (entry.dayOfWeek) return "--";
			//else if (entry.day && entry.month == null && entry.dayOfWeek == null) return "On the " + entry.day;
			//else if (entry.day && entry.month) return "On the " + entry.day;
			else return "On the " + entry.day;
		}

		$scope.disableDayMonth = function() {
			if ($scope.newDayOfWeek) $scope.dayMonthDisabled = true;
			else $scope.dayMonthDisabled = false;
		}

		$scope.disableWeek = function() {
			if ($scope.newMonth || $scope.newDay) $scope.weekDisabled = true;
			else $scope.weekDisabled = false;
		}

		$scope.toggleCreate = function() {
			$scope.isCreate = !$scope.isCreate;
		}

		function submitEntry(entry) {
			moneyChartsService.createAutomaticEntry(entry).success(function(result) {
				$scope.entries.push(result.data);
				$scope.toggleCreate();

				$scope.newMonth = "";
				$scope.newDayOfWeek = "";
				$scope.newSelect = "";
				$scope.newDay = "";
				$scope.newCost = "";
				$scope.newDescription = "";
				$scope.weekDisabled = false;
				$scope.dayMonthDisabled = false;

			}).error(function(err) {
				console.log("I hit an error while creating a new automatic entry");
			});
		};

	};
}());