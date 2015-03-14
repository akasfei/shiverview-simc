(function (angular) {
angular.module('shiverview')
.controller('simcCtrl', ['$scope', '$http', '$rootScope', '$location', function ($scope, $http, $rootScope, $location) {
  $scope.payload = {region: 'CN'};
  $scope.submit = function (e) {
    $scope.simulating = true;
    $http({
      url: '/simc/',
      data: $scope.payload,
      method: 'put'
    })
    .success(function (data) {
      $scope.simulating = false;
      $location.url('/simc/results');
    })
    .error(function (err, status) {
      $scope.simulating = false;
      if (status == 429) $rootScope.$broadcast('warningMessage', 'You recently requested a simulation. Please try again later.');
      else $rootScope.$broadcast('warningMessage', 'An error ocurred in the simulation process. Please check your names and try again.');
    });
  };
}])
.controller('simcResCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
  $scope.results = [];
  $scope.get = function () {
    $http({
      url: '/simc/',
      method: 'get'
    })
    .success(function (data) {
      $scope.results = data;
    })
    .error(function (err) {
      $rootScope.$broadcast('warningMessage', 'An error ocurred. Please try again later.');
    });
  };
  $scope.get();
}]);
})(window.angular);
