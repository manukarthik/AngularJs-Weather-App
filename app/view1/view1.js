'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
    .factory('WeatherApi',['$http','$sce',function($http,$sce){
        let obj = {};

        obj.getLoc = function() {
            return $http.jsonp("https://ipinfo.io/json?callback=JSON_CALLBACK");
        };
        obj.getCurrentWeather = function (loc) {
            let location = loc.split(",");
            let lat = "lat="+location[0];
            let long ="&lon="+location[1];
            let cb = "&callback=JSON_CALLBACK";
            return $http.jsonp("https://fcc-weather-api.glitch.me/api/current?"+lat+long+cb);
        };
        return obj;
    }])
.controller('View1Ctrl', ['$scope','WeatherApi',function($scope, WeatherApi) {
$scope.name ='manu';
WeatherApi.getLoc().success(function(response){
 $scope.city = response.city +","+ response.country;
  let loc = response.loc;
 WeatherApi.getCurrentWeather(loc).success(function(response){
     $scope.weather = response;
     console.log($scope.weather);
   currentWeather(response);
    });

  let currentWeather = function(response){
 $scope.weatherStatus = response.weather[0];
 };

  $scope.changeMetric = function (temp) {
      if($scope.tempFlag ){
          var fTemp = temp;
          $scope.weather.main.temp = Math.round((fTemp - 32) * 5 / 9).toFixed(2);
          $scope.weather.unit = "C";
          $scope.tempFlag = false;
      }
      else {
          var cTemp = temp;
          $scope.weather.main.temp = cTemp * 9 / 5 + 32;
          $scope.weather.unit = "F";
          $scope.tempFlag = true;
      }
  };
});
}]);