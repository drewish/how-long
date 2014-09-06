'use strict';

/* Filters */
angular.module('howLongFilters', [])
  .filter('rate', function() {
    var units = {
      'sec':  1000,
      'min':  1000 * 60,
      'hour': 1000 * 60 * 60,
      'day':  1000 * 60 * 60 * 24,
    };

    return function(input, unit, digits) {
      var float = parseFloat(input);
      var int = parseInt(input);
      if (isNaN(float)) {
        return '';
      }
      digits = isNaN(parseInt(digits)) ? 3 : digits;
      unit = unit || 'min';
      if (!units[unit]) {
        return '';
      }
      var number = (input * units[unit])
      if (number % 1 !== 0) {
        number = number.toFixed(digits);
      }
      return number + ' / ' + unit;
    };
  });
