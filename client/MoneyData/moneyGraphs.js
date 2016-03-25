(function(){
	angular.module('moneyPal.moneyData')
	.controller('moneyGraphsController', moneyGraphsController);

	function moneyGraphsController($scope, loginDataService, authToken, $location, moneyDataService) {

		var $green = "#8ecf67";
		var $blue = "#12A4F4";

	    var data2 = [
			[gd(2012, 0, 1), 8],
			[gd(2012, 1, 1), 13],
			[gd(2012, 2, 1), 4],
			[gd(2012, 3, 4), 8],
			[gd(2012, 4, 1), 16],
			[gd(2012, 5, 1), 20],
			[gd(2012, 6, 1), 29],
			[gd(2012, 7, 1), 23],
			[gd(2012, 8, 1), 28],
			[gd(2012, 9, 1), 16],
			[gd(2012, 10, 1), 8],
			[gd(2012, 11, 2), 4]
		];

		function gd(year, month, day) {
			return new Date(year, month, day).getTime();
		}
	 
	    var sin = [], cos = [];
		for (var i = 0; i < 14; i += 0.1) {
			sin.push([i, Math.sin(i)]);
			cos.push([i, Math.cos(i)]);
		}
		var plot = $.plot($("#crosshair"), [{
			data: data2,
			label: "New York = 0.00 °C"
		}], {
			series: {
				lines: {
					show: true,
					lineWidth: 1
				},
				points: {
					show: true,
					radius: 4,
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
		var legends = $("#crosshair .legendLabel");

		var updateLegendTimeout = null;
		var latestPosition = null;

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
		}
		$("#crosshair").bind("plothover", function (event, pos, item) {
			latestPosition = pos;
			if (!updateLegendTimeout) updateLegendTimeout = setTimeout(updateLegend, 50);
		});
	};
}());