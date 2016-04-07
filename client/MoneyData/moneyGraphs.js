(function(){
	angular.module('moneyPal.moneyData')
	.controller('moneyGraphsController', moneyGraphsController);

	function moneyGraphsController($scope, loginDataService, authToken, $location, moneyChartsService, moneyDataService) {

		var plot;
		var plot2;
		var plot3;
		var updateLegendTimeout = null;
		var latestPosition = null;
		var legends = $("#crosshair .legendLabel");

		var $green = "#8ecf67";
		var $blue = "#12A4F4";
		var $border_color = "#f9f9f9";
		var $grid_color = "#eeeeee";
		var $default_black = "#999999";
		var $default_white = "#ffffff";
		var $sky_blue = "#edf5fa";

		moneyChartsService.getCalendarCosts().success(function(data){
			$scope.totTransactions = data.entries.length;
			$scope.net = calcNetCost(data.entries);
			$scope.avgNet = calcAvgNetCost(data.entries);
			$scope.maxDay = calcMaxDayCost(data.entries);

			var events = makeLineDataPoints(mergeSort(calculateDailyCosts(data.entries)));
			var eventsMonthly = makeMonthlyDataPoints(mergeSort(calculateMonthlyCosts(data.entries)));

			makeLineGraph(events);
			makeMonthlyBarGraph(eventsMonthly);

		}).error(function(err) {
			
		});	

		moneyDataService.getTopics().success(function(result) {
			makeTopicPieGraph(result.data);
		}).error(function(err) {
			console.log("Failed to get topics");
		});

		function makeLineGraph(events) {
			plot = $.plot($("#crosshair"), [{
				data: events,
				label: "Daily Net Exchange = $0.00"
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
					mode: "x"
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

			$("#crosshair").bind("plothover", function (event, pos, item) {
				latestPosition = pos;
				if (!updateLegendTimeout) updateLegendTimeout = setTimeout(updateLegend, 50);
			});
		};

		function makeMonthlyBarGraph(eventsMonthly) {
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
		};

		function makeTopicPieGraph(topics) {
			var sum = 0;
			topics[0].topicCosts.forEach(function(cost) {
				sum = sum + cost;
			});
			var data = [];
			for(var i = 0; i < topics[0].topics.length; i++) {
				data.push({label: topics[0].topics[i], data: money_round(topics[0].topicCosts[i]/sum)});
			}
			// var data = [
			//     { label: "IE",  data: 19.5},
			//     { label: "Safari",  data: 4.5},
			//     { label: "Firefox",  data: 36.6},
			//     { label: "Opera",  data: 2.3},
			//     { label: "Chrome",  data: 36.3},
			//     { label: "Other",  data: 0.8}
			// ];
		
		    plot3 = $.plot($("#simplePieChart"), data, {
		    	series: {
					pie: {show: true},
				},
				legend:{  
					show: true,
					position: 'ne',
					labelBoxBorderColor: "none"	
				},
				grid: {
		      		hoverable: true,
		  		},
				colors: [$green, $blue, $default_black],
		    });
		    $("#simplePieChart").bind("plothover", pieHover);

		};

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

		function calcMaxDayCost(entries) {
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

		function makeLineDataPoints(entries) {
			var arr = [];
			entries.forEach(function(entry) {
				arr.push([gd(entry.year, entry.month, entry.day), entry.cost])
			});
			return arr;
		};

		function makeMonthlyDataPoints(entries) {
			var arr = [];
			entries.forEach(function(entry) {
				arr.push([gd(entry.year, entry.month, 1), money_round(entry.cost)])
			});
			return arr;
		};

		function updateLegend() {
			updateLegendTimeout = null;
			var pos = latestPosition;
			var axes = plot.getAxes();
			if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max || pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) return;
			var i, j, dataset = plot.getData();
			for (i = 0; i < dataset.length; ++i) {
				var series = dataset[i];
				// console.log(series);
				// find the nearest points, x-wise
				for (j = 0; j < series.data.length; ++j)
				if (series.data[j][0] > pos.x) break;
				// now interpolate
				var y, p1 = series.data[j - 1],
						p2 = series.data[j];
				if (p1 == null) y = p2[1];
				else if (p2 == null) y = p1[1];
				else y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
				$('.legendLabel:first').text(series.label.replace(/=.*/, "= $" + y.toFixed(2)));
				// legends.eq(i).text(series.label.replace(/=.*/, "= $" + y.toFixed(2)));
				// console.log("Daily Net Exchange = $" + y.toFixed(2));
			}
		}

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
		};
		 
		function pieHover(event, pos, obj) {
		    if (!obj)
		        return;
		 
		    percent = parseFloat(obj.series.percent).toFixed(2);
		    $("#pieHover").html('<span style="font-weight: bold; color: '+obj.series.color+'">'+obj.series.label+' ('+percent+'%)</span>');
		}

	};
}());