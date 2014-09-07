'use strict';

/* Controllers */

var howLongControllers = angular.module('howLongControllers', []);

howLongControllers.controller('SampleListCtrl',
    ['$scope', '$filter', function ($scope, $filter) {
  $scope.samples = [];
  $scope.target = 0;
  $scope.rate = null;
  $scope.remaining = null;
  $scope.estimate = null;

  var mock = 'down';
  if (mock) {
    var date1 = new Date();
    var date2 = new Date();
    date1.setMinutes(date1.getMinutes() - 30);
    date2.setMinutes(date2.getMinutes() - 20);
    if (mock == 'up') {
      $scope.samples = [
        {time: date1, value: 2},
        {time: date2, value: 434},
        {time: new Date(), value: 760},
      ];
      $scope.target = 1000;
    } else if (mock == 'down') {
      $scope.samples = [
        {time: date1, value: 1000},
        {time: date2, value: 540},
        {time: new Date(), value: 200},
      ];
      $scope.target = 0;
    }
  }

  $scope.$watch('target', recalc);
  $scope.$watchCollection('samples', function() {
    $scope.samples = $filter('orderBy')($scope.samples, '"time"');
    recalc();
  });

  $scope.add = function() {
    $scope.samples.push({
      time: $scope.newsample.time ? dateFromTime($scope.newsample.time) : new Date(),
      value: parseFloat($scope.newsample.value),
    });
    $scope.newsample = { time: null, value: null};
  };

  $scope.remove = function(sample) {
    var index = $scope.samples.indexOf(sample);
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
    return Math.abs(completed / intervalInMs);
  }

  function mapToRange(inputStart, inputEnd, outputMin, outputMax, input) {
    var slope = (outputMax - outputMin) / (inputEnd - inputStart);
    return outputMin + slope * (input - inputStart);
  }

  function recalc() {
    if ($scope.samples.length < 2) {
      $scope.rate = null;
      $scope.remaining = null;
      $scope.estimate = null;
      return;
    }

    var first = $scope.samples[0];
    var last = $scope.samples[$scope.samples.length - 1];
    $scope.rate = computeRate(first, last);
    $scope.remaining = Math.abs($scope.target - last.value);
    $scope.estimate = new Date(last.time.getTime() + ($scope.remaining / $scope.rate));

    updateSegments();
  }

  function updateSegments() {
    $scope.segments = [];

    var graph = document.getElementsByClassName('graph')[0];

    $scope.chart = {
      width: graph.offsetWidth,
      height: graph.offsetWidth * 1.5, // control the aspect ratio here...
    };

    // Add some margins
    var minY = 20;
    var maxY = $scope.chart.height - 10;
    var minX = 10;
    var maxX = $scope.chart.width - 10;

    var mapTime = mapToRange.bind(undefined,
      $scope.samples[0].time.getTime(), $scope.estimate.getTime(), minY, maxY);
    var mapValue = mapToRange.bind(undefined,
      $scope.samples[0].value, $scope.target, minX, maxX);

    var points = $scope.samples.concat({
        // Simulate a sample for the estimated completion
        time: $scope.estimate,
        value: $scope.target,
      }).map(function(sample) {
        return angular.extend(sample, {
          y: mapTime(sample.time),
          x: mapValue(sample.value),
        });
      });

    var i, length;
    for (i = 1, length = points.length; i < length; i++) {
      var prior = points[i - 1];
      var current = points[i];
      $scope.segments.push({
        points: [
          [maxX, prior.y], [prior.x, prior.y],
          [current.x, current.y], [maxX, current.y]
        ].join(' '),
        label: {
          text: computeRate(prior, current),
          x: maxX,
          y: current.y,
        }
      });
    }

    // Tick marks
    $scope.ticks = [
      { x: minX, y: minY, label: '0%' },
      { x: minX, y: (maxY + minY) / 2, label: '50%' },
      { x: minX, y: maxY, label: '100%' },
    ];
  }

}]);
