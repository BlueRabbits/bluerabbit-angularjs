app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout){
  'use strict';

  $scope.Signupform = function() {
    var signupcredintials = {};
    // if($scope.signupcredintials) {}
      signupcredintials = {
          name: $scope.name,
          email: $scope.email,
          password: $scope.password,
        }


    Auth.register(signupcredintials).success(function(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data._id);
    localStorage.setItem("name", data.email);
    //localStorage.setItem("loggedIn", true);
    $location.path('/cart-description');
    //location.reload(true);
    alert ("Account Created successfully")
    $scope.dirty = false;
  }).error(function(data) {
    console.log('data', data);
      alert ("Account Created unsuccess")
  });

  }

  $scope.loginform = function () {
    Auth.login ({
      email: $scope.email,
      password: $scope.password,
    }).success(function (data) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data._id);
      localStorage.setItem("email", data.email);
      localStorage.setItem('loggedIn', true);
      
      $location.path('/cart-description');
    }).error(function(data) {
      console.log('data', data);
        alert ("login failed")
    });
  }

  $scope.logout = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.setItem('loggedIn', false);
    $location.path('/login');
  }
  $scope.product = function() {
    Auth.products().success(function(data) {
    console.log('data',data);
  }).error(function(data) {
    console.log('data', data);
      alert ("Account Created unsuccess")
  });

  }
  //   $scope.product();

})
