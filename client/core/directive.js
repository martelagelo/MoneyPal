(function(){
	angular.module('moneyPal.core')
		.directive('a', function() {
    		return {
        		restrict: 'E',
        		link: function(scope, elem, attrs) {
            		if(attrs.ngDisabled){
                		elem.on('click', function(e){
                    		e.preventDefault();
                		});
            		}
        		}
   			};
		});



}());