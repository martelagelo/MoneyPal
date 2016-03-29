(function(){
	angular.module('moneyPal.moneyData')
	.controller('moneyGraphsController', moneyGraphsController);

	function moneyGraphsController($scope, loginDataService, authToken, $location, moneyChartsService) {

		var plot;
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

			var sin = [], cos = [];
			for (var i = 0; i < 14; i += 0.1) {
				sin.push([i, Math.sin(i)]);
				cos.push([i, Math.cos(i)]);
			}
			plot = $.plot($("#crosshair"), [{
				data: events,
				label: "New York = 0.00 °C"
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
					tickColor: "#ffffff",
					borderColor: "#ffffff",
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

			$("#crosshair").bind("plothover", function (event, pos, item) {
				latestPosition = pos;
				if (!updateLegendTimeout) updateLegendTimeout = setTimeout(updateLegend, 50);
			});

		}).error(function(err) {
			
		});

		function gd(year, month, day) {
			return new Date(year, month, day).getTime();
		};

		function updateLegend() {
			updateLegendTimeout = null;
			var pos = latestPosition;
			var axes = plot.getAxes();
			if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max || pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) return;
			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {
				var series = dataset[i];
				// find the nearest points, x-wise
				for (j = 0; j < series.data.length; ++j)
				if (series.data[j][0] > pos.x) break;
				// now interpolate
				var y, p1 = series.data[j - 1],
						p2 = series.data[j];
				if (p1 == null) y = p2[1];
				else if (p2 == null) y = p1[1];
				else y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
				legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2) + " °C"));
			}
		};

		function calcNetCost(entries) {
			var cost = 0;
			entries.forEach(function(entry) {
				if (entry.isCost) cost = cost - entry.cost;
				else cost = cost + entry.cost;
			});
			return cost;
		}

		function calcAvgNetCost(entries) {
			var cost = calcNetCost(entries);
			var numDays = calculateDailyCosts(entries).length;
			return cost/numDays;
		}

		function calcMaxNetCost(entries) {
			var maxCost = 0;
			var dict = calculateDailyCosts(entries);
			dict.forEach(function(entry) {
				if (entry.cost > maxCost){
					maxCost = entry.cost;
				}
			});
			return maxCost;
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

		function makeDataPoints(entries) {
			var arr = [];
			entries.forEach(function(entry) {
				arr.push([gd(entry.year, entry.month, entry.day), entry.cost])
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

	};
}());