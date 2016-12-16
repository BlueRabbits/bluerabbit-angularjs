app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore){
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
    // localStorage.setItem("token", data.token);
    // localStorage.setItem("userId", data._id);
    // localStorage.setItem("name", data.email);
    //localStorage.setItem("loggedIn", true);
    //cookieStore
     $cookieStore.put("token", data.token);
     $cookieStore.put("userId", data._id);
     $cookieStore.put("email", data.email);
     $cookieStore.put('loggedIn', true);
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
      // localStorage.setItem("token", data.token);
      // localStorage.setItem("userId", data._id);
      // localStorage.setItem("email", data.email);
      // localStorage.setItem('loggedIn', true);

      //cookieStore
       $cookieStore.put("token", data.token);
       $cookieStore.put("userId", data._id);
       $cookieStore.put("email", data.email);
       $cookieStore.put('loggedIn', true);

       $scope.userId = $cookieStore.get('userId');
       console.log("user id ",$scope.userId);

      $location.path('/cart-description');
    }).error(function(data) {
      console.log('data', data);
        alert ("login failed")
    });
  }

  $scope.logout = function () {
    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("email");
    // localStorage.setItem('loggedIn', false);
    //cookieStore
    $cookieStore.remove("token");
    $cookieStore.remove("userId");
    $cookieStore.remove("email");
    $cookieStore.put('loggedIn', false);

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
