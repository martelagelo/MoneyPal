(function(){
	angular.module('moneyPal.moneyData')
	.controller('moneyGraphsController', moneyGraphsController);

	function moneyGraphsController($scope, loginDataService, authToken, $location, moneyChartsService) {

		var plot;
		var plot2;
		var updateLegendTimeout = null;
		var latestPosition = null;
		var legends = $("#crosshair .legendLabel");

		var $green = "#8ecf67";
		var $blue = "#12A4F4";

		moneyChartsService.getCalendarCosts().success(function(data){
			$scope.totTransactions = data.entries.length;
			$scope.net = calcNetCost(data.entries);
			$scope.avgNet = calcAvgNetCost(data.entries);
			$scope.maxNet = calcMaxNetCost(data.entries);

			var events = makeDataPoints(mergeSort(calculateDailyCosts(data.entries)));
			var eventsMonthly = makeMonthlyDataPoints(mergeSort(calculateMonthlyCosts(data.entries)));

			var sin = [], cos = [];
			for (var i = 0; i < 14; i += 0.1) {
				sin.push([i, Math.sin(i)]);
				cos.push([i, Math.cos(i)]);
			}

			plot = $.plot($("#crosshair"), [{
				data: events,
				label: "Daily Net Exchange"
			}], {
				series: {
					lines: {show: true , lineWidth: 1},
					points: {
						show: true,
						radius: 2,
						fill: true,
						fillColor: "#ffffff",
						lineWidth: 2
					},
					shadowSize: 0
				},
				crosshair: {
					mode: "xy"
				},
				grid: {
					hoverable: true,
					autoHighlight: false,
					borderWidth: 1,
	                tickColor: $border_color,
	                borderColor: $grid_color,
	                backgroundColor: { colors: ["#ffffff", "#ffffff"] },
				},
				legend:{     
	      			show: true,
		          	position: 'nw',
		          	noColumns: 0,
		      	},
				xaxis: {
					mode: "time",
					ticks:12, 
					tickDecimals: 0
				},

	      		yaxis: {ticks:6, tickDecimals: 0},

				colors: [$blue],
			});

			plot2 = $.plot($("#verticalBar"), [{
				data: eventsMonthly,
			}], {
		            series: {
		              shadowSize: 0,
		              bars: {
		                lineWidth: 1,
		                show: true,
		                barWidth: 1000*60*60*24*26,
		                }
		            },
		            grid: {
		                hoverable: true,
		                clickable: false,
		                borderWidth: 1,
		                tickColor: $border_color,
		                borderColor: $grid_color,
		                backgroundColor: { colors: ["#ffffff", "#ffffff"] },
		            },
		            legend:{   
		                show: true,
		                position: 'ne',
		                noColumns: 0,
		            },
		            tooltip: true,
		            tooltipOpts: {
		                content: '$ %y'
		            },
					xaxis: {
						mode: "time",
						ticks:12, 
						tickDecimals: 0
					},

		            colors: [$blue],
			});

		}).error(function(err) {
			
		});

		function gd(year, month, day) {
			return new Date(year, month, day).getTime();
		};

		function calcNetCost(entries) {
			var cost = 0;
			entries.forEach(function(entry) {
				if (entry.isCost) cost = cost - entry.cost;
				else cost = cost + entry.cost;
			});
			return money_round(cost);
		}

		function calcAvgNetCost(entries) {
			var cost = calcNetCost(entries);
			var numDays = calculateDailyCosts(entries).length;
			return money_round(cost/numDays);
		}

		function calcMaxNetCost(entries) {
			var maxCost = 0;
			var dict = calculateDailyCosts(entries);
			dict.forEach(function(entry) {
				if (entry.cost > maxCost) {
					maxCost = entry.cost;
				}
			});
			return money_round(maxCost);
		}

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
				if(entry.isCost) dict[index.indexOf(tempDate)].cost = dict[index.indexOf(tempDate)].cost + entry.cost;
				else dict[index.indexOf(tempDate)].cost = dict[index.indexOf(tempDate)].cost - entry.cost;
			});
			return dict;
		};

		function calculateMonthlyCosts(entries) {
			var dict = [];
			var index = [];
			var tempDate = "";
			entries.forEach(function(entry) {
				tempDate = entry.year+"-"+entry.month+"-"+1;
				if(index.indexOf(tempDate) == -1) {
					index.push(tempDate);
					dict[index.indexOf(tempDate)] = {
						cost : 0,
						day : 1,
						month : entry.month,
						year : entry.year
					}
				};
				if(entry.isCost) dict[index.indexOf(tempDate)].cost = dict[index.indexOf(tempDate)].cost + entry.cost;
				else dict[index.indexOf(tempDate)].cost = dict[index.indexOf(tempDate)].cost - entry.cost;
			});
			return dict;
		};

		function makeDataPoints(entries) {
			var arr = [];
			entries.forEach(function(entry) {
				arr.push([gd(entry.year, entry.month, entry.day), entry.cost])
			});
			return arr;
		};

		function makeMonthlyDataPoints(entries) {
			var arr = [];
			entries.forEach(function(entry) {
				arr.push([gd(entry.year, entry.month, 1), entry.cost])
			});
			return arr;
		};

		function mergeSort(arr) {
		    if (arr.length < 2)
		        return arr;
		 
		    var middle = parseInt(arr.length / 2);
		    var left   = arr.slice(0, middle);
		    var right  = arr.slice(middle, arr.length);
		 
		    return merge(mergeSort(left), mergeSort(right));
		};
		 
		function merge(left, right) {
		    var result = [];
		 
		    while (left.length && right.length) {
		    	if (left[0].year == right[0].year) {
		    		if (left[0].month == right[0].month) {
		    			if (left[0].day < right[0].day) {
		    				result.push(left.shift());
		    			} else {
		    				result.push(right.shift());
		    			}
		    		} else if (left[0].month < right[0].month) {
			    		result.push(left.shift());
			    	} else {
			    		result.push(right.shift());
			    	}
		    	} else if (left[0].year < right[0].year) {
		    		result.push(left.shift());
		    	} else {
		    		result.push(right.shift());
		    	}
		    }
		 
		    while (left.length)
		        result.push(left.shift());
		 
		    while (right.length)
		        result.push(right.shift());
		 
		    return result;
		};

		function money_round(num) {
    		return Math.ceil(num * 100) / 100;
		}
	};
}());