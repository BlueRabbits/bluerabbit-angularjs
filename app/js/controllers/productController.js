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
      $scope.cartLength = data.length;
      $scope.allCartItems = data;
      console.log('get cart data',data);
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "imag_url" : value.mainImageUrl,
          "description" : value.description,
          "cartquantity":value.quantity,
          "cartPrice" : value.salePrice
        };
        $scope.gettingCartData.push(obj);

      });
      console.log("cartquantity", $scope.gettingCartData);

    }).error(function(data){
      alert('Not Added to cart');
    });
  };
  $scope.getcartItems();

  $scope.searchList = function () {
    Auth.searchItem ({
    'str': $scope.searchitem
    }).success ( function (data) {
      console.log('search data', data);
      $scope.search_result = data;

    }).error({

    });
  };

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
      alert('deleted from cart');
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          alert('Not deleted from cart');
        });
      };

})
