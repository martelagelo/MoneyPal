(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('monthChartsController', monthChartsController);

	function monthChartsController($scope, loginDataService, moneyChartsService, authToken, $location) {

		moneyChartsService.getCalendarCosts().success(function(data){
			var events = createChartEntries(calculateDailyCosts(data.entries));
			//console.log(events);

			$('#calendar').fullCalendar({
			    header: {
			      left: 'prev,next today',
			      center: 'title',
			      right: 'month,basicWeek,basicDay'
			    },
			    height: 750,
			    editable: false,
			    droppable: false, // this allows things to be dropped onto the calendar !!!
			    events: events,
			});

		}).error(function(err) {
			
		});

		function calculateDailyCosts(entries) {
			var dict = [];
			var index = [];
			var tempDate = "";
			entries.forEach(function(entry) {
				tempDate = entry.year+"-"+entry.month+"-"+entry.day;
				if(index.indexOf(tempDate) == -1) {
					index.push(tempDate);
					dict[index.indexOf(tempDate)] = {
						cost : 0,
						day : entry.day,
						month : entry.month,
						year : entry.year
					}
				};
				if(entry.isCost) dict[index.indexOf(tempDate)].cost = dict[index.indexOf(tempDate)].cost - entry.cost;
				else dict[index.indexOf(tempDate)].cost = dict[index.indexOf(tempDate)].cost + entry.cost;
			});
			return dict;
		};

		function createChartEntries(arr) {
			events = [];
			arr.forEach(function(entry) {
				events.push(
					{
						title: "Cost: $ " + money_round(entry.cost),
						start: new Date(entry.year, entry.month, entry.day),
						className : 'cool-one-bg',
						url: '#/dayCharts/?param='+entry.year+'-'+entry.month+'-'+entry.day,
					}
				);
			});
			return events;
		};

		function money_round(num) {
			return Math.ceil(num * 100)/100;
		};
	};

}());