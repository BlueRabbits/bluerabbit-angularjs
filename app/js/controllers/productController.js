app.controller('productController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore){
  'use strict';


  $(document).ready(function(){
          //var counter = $('#TextBox').val();
    $('#AddButton').click( function() {
        var counter = $('#TextBox').val();
        counter++ ;
        $('#TextBox').val(counter);
        console.log('click');
    });
    $('#minusButton').click( function() {
      var counter = $('#TextBox').val();
      counter-- ;
      $('#TextBox').val(counter);
    });
  });


  //scrooling page,showing header fixed

  var elementPosition = $('#sub-menu').offset();

  $(window).scroll(function(){
    if($(window).scrollTop() > elementPosition.top){
          $('#sub-menu').css('position','fixed').css({"top":"0","right":"30%","left":"0"});
    } else {
        $('#sub-menu').css('position','static');
    }
  });
  var elementPosition = $('#scroll-menu-fixed1').offset();

  $(window).scroll(function(){
    if($(window).scrollTop() > elementPosition.top){
          $('#scroll-menu-fixed1').css('position','fixed').css({"top":"97px","right":"0","left":"0"});
    } else {
        $('#scroll-menu-fixed1').css('position','static');
    }
  });
  //
  // $scope.product = function() {
  //   $scope.productslist = [];
  //   Auth.products().success(function(data) {
  //   console.log('data',data);
  //   $scope.allProducts = data;
  //
  //    angular.forEach($scope.allProducts, function (value, key) {
  //      var obj = {
  //        "id" : value._id,
  //        "name" : value.name,
  //        "description" : value.description,
  //        "price" : value.salePrice,
  //        "imag_url" : value.mainImageUrl
  //      };
  //      $scope.productslist.push(obj);
  //      console.log("product id", $scope.productslist);
  //    });
  //   }).error(function(data) {
  //     console.log('data', data);
  //       alert ("no Products")
  //   });
  // }
  //
  // $scope.product();

  $scope.createUUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    console.log("uuid",uuid);
    //cookie store
    //cookieStore
     $cookieStore.put("sessionId", uuid);
    return uuid;
  }

  if ($cookieStore.get('sessionId')) {
    //$scope.createUUID();
    console.log("cookie will not store sessionId as there is  session id");
  } else {
    console.log("cookie will  store sessionId ");
    $scope.createUUID();
  }

  console.log("cookie",$cookieStore.get('sessionId'));

  $scope.getcartItems = function () {
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    //cookieStore
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    $scope.gettingCartData =[];
    console.log('cart page');
    Auth.getCartList({
      UserId : $scope.getUserId,
      sessionID: $scope.sessionId,
    })
    .success(function (data) {
      console.log(data.length);
      $rootScope.cartLength = data.length;
      $scope.allCartItems = data;
      console.log('get cart data',data);
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "qty":value.quantity,
          "cartPrice" : value.product.salePrice
        };
        $scope.gettingCartData.push(obj);

      });
      $scope.totalCost = 0;
      for (var i = 0; i < $scope.gettingCartData.length; i++) {
          $scope.totalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
            console.log("prce", $scope.totalCost);
      }


    }).error(function(data){
      alert('Not Added to cart');
    });
  };
  $scope.getcartItems();

  //updateCart increment
  //$scope.countQuantity = 0;
  $scope.updateCartByIncrement = function(quantity,productId) {
    $scope.countQuantity =quantity + 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated resp', data);
      $scope.getcartItems();
        }).error(function(data){
          alert('Not updated in cart');
        });
  }

  //updateCart on decrement
  //$scope.countQuantity = 0;
  $scope.updateCartByDecrementing = function(quantity,productId) {
    $scope.countQuantity =quantity - 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated decrement', data);
      $scope.getcartItems();
        }).error(function(data){
          alert('Not updated in cart');
        });
  }

  //search -autoComplete
  $scope.autocompleteSearch = function (searchNames) {
    Auth.autocompleteSearchItem (searchNames).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.show_wishlist  = false;
      $scope.hideAutocomplete = true;
      console.log('autcomplete data', data);
      $scope.searchAutocompleteId = data;
    }).error({

    });
  };

  //search
  $scope.searchList = function (searchName) {
    Auth.searchItem (searchName).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.show_wishlist  = false;
      $scope.hideAutocomplete = false;
      console.log('search data', data);
      $scope.search_result = data;

    }).error({

    });
  };

  //POST create add to cart
  var count = 0;
  $scope.addToCart = function (productId) {
    count++;
    console.log("quantity count",count);
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.userToken = localStorage.getItem('token');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    //cookieStore
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');


    $scope.cartlist =[];
    var productInfo = {
      product:productId,
      quantity: count,
      UserID:$scope.getUserId,
      sessionID:$scope.sessionId,
      authToken: $scope.userToken,
      isDeleted: false
    }
    Auth.addCart(productInfo)
    .success(function(data){
      //console.log('data', data);
      $scope.getcartItems();
      alert('Added to cart');
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

      angular.forEach(data, function (value, key) {
            var obj = {
              "user_id" : value.UserID,
              "productId" : value.product,
              "quantity" : value.quantity,
            };
            $scope.cartlist.push(obj);
            console.log("cart",$scope.cartlist);
          });
        }).error(function(data){
          alert('Not Added to cart');
        });
      };

  //delte cart
  $scope.deleteCart = function (productId,quantity) {
    // $scope.getUserId = localStorage.getItem('userId');
    // $scope.userToken = localStorage.getItem('token');
    // $scope.sessionId = "aa565asdasdy87sadasd987";
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    Auth.deleteCart({UserID:$scope.getUserId,sessionID : $scope.sessionId,isDeleted: true}, productId)
    .success(function(data){
      console.log('deleted resp', data);
      $scope.getcartItems();
      alert('deleted from cart');
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          alert('Not deleted from cart');
        });
      };

      $scope.wishListShow = function () {
        $scope.searchPagelist = false;
        $scope.show_wishlist  = true;
        $scope.getWishList();
      }

      //POST create wish list
      var count = 0;
      $scope.addWishList = function (productId) {
        count++;
        console.log("quantity count",count);
        // $scope.getUserId = localStorage.getItem('userId');
        // $scope.userToken = localStorage.getItem('token');
        // $scope.sessionId = "aa565asdasdy87sadasd987";
        //cookieStore
        $scope.getUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');


        $scope.cartlist =[];
        var wishListInfo = {
          product:productId,
          quantity: count,
          UserID:$scope.getUserId,
          sessionID:$scope.sessionId,
          authToken: $scope.userToken,
          isDeleted: false
        }
        Auth.addWishList(wishListInfo)
        .success(function(data){
          //console.log('data', data);
          $scope.getcartItems();
          alert('Added to wishLists');
          // $scope.quantity = data.quantity;
          // $scope.user_id = data.UserID;
          // console.log('id',$scope.user_id);

          angular.forEach(data, function (value, key) {
                var obj = {
                  "user_id" : value.UserID,
                  "productId" : value.product,
                  "quantity" : value.quantity,
                };
                $scope.cartlist.push(obj);
                console.log("cart",$scope.cartlist);
              });
            }).error(function(data){
              alert('Not Added to wish');
            });
          };

          //get wish list

          $scope.getWishList = function () {
            // $scope.getUserId = localStorage.getItem('userId');
            // $scope.sessionId = "aa565asdasdy87sadasd987";
            //cookieStore
            $scope.getUserId = $cookieStore.get('userId');
            $scope.userToken = $cookieStore.get('token');
            $scope.sessionId = $cookieStore.get('sessionId');

            $scope.gettingCartData =[];
            console.log('cart page');
            Auth.getWishList({
              UserId : $scope.getUserId,
              sessionID: $scope.sessionId
            })
            .success(function (data) {
              console.log(data.length);
              $scope.getWishlistData = data;
              console.log("$scope.getWishlistData",$scope.getWishlistData);
              // $rootScope.cartLength = data.length;
              // $scope.allCartItems = data;
              // console.log('get cart data',data);
              // angular.forEach($scope.allCartItems, function (value, key) {
              //   var obj = {
              //
              //     "cartPrice" : value.product.salePrice
              //   };
              //   $scope.gettingCartData.push(obj.cartPrice);
              //
              // });
              // $scope.totalCost = 0;
              // for (var i = 0; i < $scope.gettingCartData.length; i++) {
              //     $scope.totalCost += $scope.gettingCartData[i];
              //       console.log("prce", $scope.totalCost++);
              // }


            }).error(function(data){
              alert('Not Added to cart');
            });
          };

          //checkout
          $scope.checkout = function() {
            if($cookieStore.get('userId')){
              window.location = "#/checkout";
            } else {
              alert("Please Login")
              window.location = "#/landing";
            }
          }


})
