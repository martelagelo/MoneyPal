(function(){
	angular.module('moneyPal.moneyCharts')
	.controller('monthChartsController', monthChartsController);

	function monthChartsController($scope, loginDataService, moneyChartsService, authToken, $location) {
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();

		moneyChartsService.getCostMonth(y,m).success(function(data){
			var arr = calculateDailyCosts(data.listOfCosts);
			var events = createChartEntries(arr, m, y);
			console.log(events);

			$('#calendar').fullCalendar({
			    header: {
			      left: 'prev,next today',
			      center: 'title',
			      right: 'month,basicWeek,basicDay'
			    },
			    height: 750,
			    editable: false,
			    droppable: false, // this allows things to be dropped onto the calendar !!!
			    drop: function(date, allDay) { // this function is called when something is dropped

			      // retrieve the dropped element's stored Event Object
			      var originalEventObject = $(this).data('eventObject');

			      // we need to copy it, so that multiple events don't have a reference to the same object
			      var copiedEventObject = $.extend({}, originalEventObject);

			      // assign it the date that was reported
			      copiedEventObject.start = date;
			      copiedEventObject.allDay = allDay;

			      // render the event on the calendar
			      // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			      $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

			      // is the "remove after drop" checkbox checked?
			      if ($('#drop-remove').is(':checked')) {
			          // if so, remove the element from the "Draggable Events" list
			        $(this).remove();
			      }

			    },
			    events: events,
			});

		}).error(function(err) {

		});

		function calculateDailyCosts(entries) {
			var arr = [];
			entries.forEach(function(entry) {
				if (isNaN(arr[entry.day])) arr[entry.day] = {index: entry.day, cost: 0};
				arr[entry.day].cost = arr[entry.day].cost + entry.cost;
			});
			return arr;
		};

		function createChartEntries(arr, m, y) {
			events = [];
			arr.forEach(function(entry) {
				console.log(entry);
				events.push(
					{
						title: "Cost: " + entry.cost,
						start: new Date(y, m, entry.index),
						className : 'cool-one-bg',
					}
				)
			});
			return events;
		}

		// $('#external-events div.ext-event').each(function() {

		//     // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
		//     // it doesn't need to have a start or end
		//     var eventObject = {
		//       title: $.trim($(this).text()) // use the element's text as the event title
		//     };

		//     // store the Event Object in the DOM element so we can get to it later
		//     $(this).data('eventObject', eventObject);

		//     // make the event draggable using jQuery UI
		//     $(this).draggable({
		//       zIndex: 999,
		//       revert: true,      // will cause the event to go back to its
		//       revertDuration: 0  //  original position after the drag
		//     });

		// });


	};

}());