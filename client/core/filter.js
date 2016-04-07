(function(){
	angular.module('moneyPal.core')
		.filter('offset', function() {
  			return function(input, start) {
    			start = parseInt(start, 10);
    			return input.slice(start);
  			};
		})
  	.filter('orderInnerObjectBy', function() {
    
    		resolve = function(path, obj, safe) {
          	return path.split('.').reduce(function(prev, curr) {
          		return !safe ? prev[curr] : (prev ? prev[curr] : undefined)
            }, obj || self)
    		}

    		return function(items,field,reverse){
      		var filtered = [];
      		angular.forEach(items, function(item){
        			filtered.push(item);
      		});
        	filtered.sort(function(a,b){
          	 return (resolve(field,a) > resolve(field,b) ?1 :-1);
        	});
        		if(reverse){filtered.reverse();}
        		return filtered;
    		};
  	});
}());