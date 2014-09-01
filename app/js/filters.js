'use strict';

/* Filters */
angular.module('howLongFilters', [])
  .filter('rate', function() {
    return function(input, digits) {
      if (isNaN(parseFloat(input))) {
        return '';
      }
      var seconds = parseFloat(input) * 1000;
      return (seconds * 60).toFixed(digits) + ' / minutes';
    };
  });
