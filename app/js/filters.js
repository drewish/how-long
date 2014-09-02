'use strict';

/* Filters */
angular.module('howLongFilters', [])
  .filter('rate', function() {
    var units = {
      'second': 1000,
      'minute': 1000 * 60,
      'hour':   1000 * 60 * 60,
      'day':    1000 * 60 * 60 * 24,
    };

    return function(input, unit, digits) {
      if (isNaN(parseFloat(input))) {
        return '';
      }
      digits = isNaN(parseInt(digits)) ? 3 : digits;
      unit = unit || 'minute';
      if (!units[unit]) {
        return '';
      }
      var number = (parseFloat(input) * units[unit]).toFixed(digits);
      return number + ' / ' + unit;
    };
  });
