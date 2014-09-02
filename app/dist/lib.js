'use strict';

/* App Module */

var howLongApp = angular.module('howLongApp', [
  'howLongControllers',
  'howLongFilters',
  // 'howLongServices'
  'angularMoment',
]);

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

  function computeRate(earlierSample, laterSample) {
    var completed = laterSample.value - earlierSample.value;
    var intervalInMs = laterSample.time - earlierSample.time;
    return completed / intervalInMs;
  }

  function recalc() {
    if ($scope.samples.length < 2) {
      $scope.rate = 0;
      $scope.remaining = null;
      $scope.estimate = null;
      return;
    }

    $scope.samples = $filter('orderBy')($scope.samples, '"time"');
    var first = $scope.samples[0];
    var last = $scope.samples[$scope.samples.length - 1];

    var i, length;
    for (i = 1, length = $scope.samples.length; i < length; i++) {
      $scope.samples[i].rate = computeRate($scope.samples[i - 1], $scope.samples[i]);
    }

    $scope.rate = computeRate(first, last);
    $scope.remaining = $scope.target - last.value;
    $scope.estimate = new Date(last.time.getTime() + ($scope.remaining / $scope.rate));
  }
});

'use strict';

/* Directives */

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

'use strict';

/* Services */
