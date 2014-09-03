'use strict';

/* Controllers */

var howLongControllers = angular.module('howLongControllers', []);

howLongControllers.controller('SampleListCtrl', function ($scope, $filter) {
  var date1 = new Date();
  var date2 = new Date();
  date1.setMinutes(date1.getMinutes() - 30);
  date2.setMinutes(date2.getMinutes() - 20);
  $scope.samples = [
    {time: date1, value: 1000},
    {time: date2, value: 540},
    {time: new Date(), value: 200},
  ];
  $scope.target = 0;
  $scope.rate = null;
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

  function computeRate(earlierSample, laterSample) {
    var completed = laterSample.value - earlierSample.value;
    var intervalInMs = laterSample.time - earlierSample.time;
    return completed / intervalInMs;
  }

  function recalc() {
    if ($scope.samples.length < 2) {
      $scope.rate = null;
      $scope.remaining = null;
      $scope.estimate = null;
      return;
    }

    $scope.samples = $filter('orderBy')($scope.samples, '"time"');
    var first = $scope.samples[0];
    var last = $scope.samples[$scope.samples.length - 1];

    $scope.rate = computeRate(first, last);
    $scope.remaining = $scope.target - last.value;
    $scope.estimate = new Date(last.time.getTime() + ($scope.remaining / $scope.rate));

    var i, length;
    for (i = 1, length = $scope.samples.length; i < length; i++) {
      $scope.samples[i].rate = computeRate($scope.samples[i - 1], $scope.samples[i]);
    }

    // Figure out percentages
    var minTime = first.time.getTime();
    var maxTime = $scope.estimate.getTime();
    var minValue = Math.min(first.value, $scope.target);
    var maxValue = Math.max(first.value, $scope.target);
    var points = [];
    var valueRange = (maxValue - minValue);
    var timeRange = (maxTime - minTime);
    $scope.samples.forEach(function(sample) {
      var scaledTime = 100 * (sample.time - minTime) / timeRange;
      var scaledValue = 100 * (sample.value - minValue) / valueRange;
      points.push([
        [scaledValue, scaledTime],
        [0, scaledTime]
      ]);
    });
    // Finish point
    points.push([[100 * ($scope.target - minValue) / valueRange, 100]]);

    $scope.polygons = [];
    for (i = 1, length = points.length; i < length; i++) {
      points[i-1].reverse();
      $scope.polygons.push(
        [].concat(points[i-1],points[i]).join(' ')
      );
    }
  }
});
