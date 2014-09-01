'use strict';

/* App Module */

var howLongApp = angular.module('howLongApp', [
  'howLongControllers',
  // 'howLongFilters',
  // 'howLongServices'
]);

// Work around Jekyll's liquid tags.
howLongApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);
