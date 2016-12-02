app.controller('productController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout){
  'use strict';

  $scope.product = function() {
    $scope.productslist = [];
    Auth.products().success(function(data) {
    console.log('data',data);
    $scope.allProducts = data;

     angular.forEach($scope.allProducts, function (value, key) {
       var obj = {
         "id" : value._id,
         "name" : value.name,
         "description" : value.description,
         "price" : value.salePrice,
         "imag_url" : value.mainImageUrl
       };
       $scope.productslist.push(obj);
     });
    }).error(function(data) {
      console.log('data', data);
        alert ("no Products")
    });
  }

  $scope.product();

  $scope.addToCart = function () {
    $scope.cartlist =[];
    Auth.addCart().success(function(data){
      //console.log('data', data);
      alert('Added to cart');
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

      angular.forEach(data, function (value, key) {
        var obj = {
          "user_id" : value.UserID,
          "quantity" : value.quantity,
        };
        $scope.cartlist.push(obj);
        console.log("cart",$scope.cartlist);
      });
    }).error(function(data){
      alert('Not Added to cart');
    });
  }

})
