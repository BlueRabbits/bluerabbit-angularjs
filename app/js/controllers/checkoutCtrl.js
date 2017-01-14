"use strict";

app.controller('checkoutCtrl', function($scope, $location, $rootScope, $http, $timeout, Auth,  $cookies, $cookieStore) {


  // Activate Next Step

  $(document).ready(function() {

      var navListItems = $('ul.setup-panel li a'),
          allWells = $('.setup-content');

      allWells.hide();

      navListItems.click(function(e)
      {
        e.preventDefault();
        var $target = $($(this).attr('href')),
            $item = $(this).closest('li');

        if (!$item.hasClass('disabled')) {
            navListItems.closest('li').removeClass('active');
            $item.addClass('active');
            allWells.hide();
            $target.show();
        }
      });

      $('ul.setup-panel li.active a').trigger('click');

      // DEMO ONLY //
      $('#activate-step-2').on('click', function(e) {
          $('ul.setup-panel li:eq(1)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-2"]').trigger('click');
          //$(this).remove();
      })
      $('#step-back-1').on('click', function(e) {
          //$('ul.setup-panel li:eq(1)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-1"]').trigger('click');
          //$(this).remove();
      })

      $('#activate-step-3').on('click', function(e) {
          $('ul.setup-panel li:eq(2)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-3"]').trigger('click');
          //$(this).remove();
      })

      $('#activate-step-4').on('click', function(e) {
          $('ul.setup-panel li:eq(3)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-4"]').trigger('click');
          //$(this).remove();
      })

  });


//get cart details
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

      //continue shipping
      $scope.continueShipping = function(){
          $location.path('/search-page')
      }

    //get address by userId
    $scope.getAddressByUserId = function(){
      $scope.getUserId = $cookieStore.get('userId');
      Auth.getAddressByUserId($scope.getUserId)
      .success(function(data){
        console.log('address by UserID resp', data);
          $scope.getAddressByUserId = data;
          $scope.addressId = data[0]._id;
          console.log("$scope.addressId",$scope.addressId);
          }).error(function(data){
            alert('Not deleted from cart');
          });
    }
    $scope.getAddressByUserId ();


  //post address
  $scope.addressType = [];
  $scope.addAddress = function () {
  console.log("addressTypeHome",$scope.addressType);
    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');

    var addressDetails = {
      userID:$scope.getUserId,
      name:$scope.name,
      addressType:$scope.addressType,
      authToken: $scope.userToken,
      street1:$scope.street1,
      street2:$scope.street2,
      street3: $scope.street3,
      street4: $scope.street3,
      companyName:$scope.companyName,
      officeNumber:$scope.officeNumber,
      mobileNumber:$scope.mobileNumber,
      landLineNumber:$scope.landlineNumber,
      pinCode: $scope.pincode,
      city:$scope.city,
      state: $scope.state,
      country:$scope.country
    }
    Auth.addAddress(addressDetails)
    .success(function(data){
      console.log('addressDetails', data);
      alert('address added');
      $scope.getAddressByUserId ();
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);
        }).error(function(data){
          alert('Not Added to cart');
        });
      };
});
