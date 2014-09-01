'use strict';

/* Controllers */

var howLongControllers = angular.module('howLongControllers', []);

howLongControllers.controller('SampleListCtrl', function ($scope, $filter) {
  $scope.samples = [
    // {time: dateFromTime('13:34'), value: 456},
  ];
  $scope.target = 0;
  $scope.rate = 0;
  $scope.remaining = null;
  $scope.estimate = null;

  $scope.$watch('target', recalc);
  $scope.$watchCollection('samples', recalc);

  $scope.add = function() {
    $scope.samples.push({
      time: $scope.newsample.time ? dateFromTime($scope.newsample.time) : new Date(),
      value: parseFloat($scope.newsample.value),
    });
    $scope.newsample = { time: null, value: null};
  };

  $scope.remove = function(sample) {
    var index = $scope.samples.indexOf(sample)
    $scope.samples.splice(index, 1);
  };

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function dateFromTime(time) {
    var parts = time.split(':');
    var date = new Date();
    date.setHours(isNumber(parts[0]) ? parts[0] : 0);
    date.setMinutes(isNumber(parts[1]) ? parts[1] : 0);
    date.setSeconds(isNumber(parts[2]) ? parts[2] : 0);
    return date;
  }

  function recalc() {
    if ($scope.samples.length < 2) {
      $scope.rate = 0;
      $scope.remaining = null;
      $scope.estimate = null;
      return;
    }

    var samplesByTime = $filter('orderBy')($scope.samples, '"time"');
    var first = samplesByTime[0];
    var last = samplesByTime[samplesByTime.length - 1];

    var intervalInMs = last.time - first.time;
    var completed = last.value - first.value; // assumes descending?
    var ratePerMs = completed / intervalInMs;

    $scope.rate = ratePerMs * 1000 * 60;
    $scope.remaining = $scope.target - last.value;
    $scope.estimate = new Date(last.time.getTime() + ($scope.remaining / ratePerMs));
  }
});
