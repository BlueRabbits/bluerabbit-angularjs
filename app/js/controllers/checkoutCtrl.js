"use strict";

app.controller('checkoutCtrl', function($scope, $location, $rootScope, $http, $timeout, Auth,  $cookies, $cookieStore, ngToast) {
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
          $('ul.setup-panel li:eq(1)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-3"]').trigger('click');
          //$(this).remove();
      })

      $('#activate-step-4').on('click', function(e) {
          $('ul.setup-panel li:eq(2)').removeClass('disabled');
          $('ul.setup-panel li a[href="#step-4"]').trigger('click');
          //$(this).remove();
      })

  });

  $scope.init = function(){
    $scope.getcartItems();
    $scope.getAddressByUserId ();
    $scope.getMinimumOrderCost();
  }


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
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in get cart api'
      // });
    });
  };


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
          console.log('Not updated in cart increment ',data);
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
          console.log('Not updated in cart',data);
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
      // ngToast.create({
      //   className: 'success',
      //   content: 'Item Deleted from Cart'
      // });
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in deleting from Cart'
          // });
        });
      };

      //continue shipping
      $scope.continueShipping = function(){
          $location.path('/search-page')
      }

    //get address by userId
    $scope.getAddressByUserId = function(){
      $scope.getUserId = $cookieStore.get('userId');
      Auth.getAddressByUserId().success(function(data){
        $scope.getAddressByUserId = data;
        if($scope.getAddressByUserId.length) {
          $scope.showDiv = 'savedAddress';
          $scope.saveAddressColor = '#d92e4a';
        } else {
          $scope.showDiv = 'newAddress';
          $scope.saveAddressColor = '#d92e4a';
        }
      }).error(function(data){
        console.log(data);
      });
    }


    //selectedAddress
    $scope.addressIdSelected = null;
    $scope.selectedAddress = function(id, addresstype){
      $scope.addressIdSelected = id;
      console.log("$scope.addressIdSelected",$scope.addressIdSelected);
      $scope.showAddressType = false;
      $scope.addNewAddressRadio = false;
      $scope.addrestTypeRadio = false;
      $scope.addressIdSelected = id;
      $scope.addressTypeChosen = addresstype;
      // for (var i = 0; i < $scope.getAddressByUserId.length; i++) {
      //   if(id == $scope.getAddressByUserId[i]._id){
      //     console.log("$scope.getAddressByUserId[i]._id",$scope.getAddressByUserId[i]._id);
      //     $scope.name = $scope.getAddressByUserId[i].name;
      //     $scope.landlineNumber = $scope.getAddressByUserId[i].landLineNumber;
      //     $scope.mobileNumber = $scope.getAddressByUserId[i].mobileNumber;
      //     $scope.companyName = $scope.getAddressByUserId[i].companyName;
      //     $scope.street1 = $scope.getAddressByUserId[i].street1;
      //     $scope.city = $scope.getAddressByUserId[i].city;
      //     $scope.pincode = $scope.getAddressByUserId[i].pinCode;
      //     $scope.state = $scope.getAddressByUserId[i].state;
      //     $scope.country = $scope.getAddressByUserId[i].state;
      //   }
      //
      // }
      if($scope.isChecked) {
       $scope.isChecked = true;
       }else{
        $scope.isChecked = false;
       }

    }

    $scope.editAddress = function() {
      $scope.showDiv =  'newAddress';
    }

    //getLoactions
    $scope.getLocationDeliver = function(){
      Auth.getLocationDeliver()
      .success(function(data){
        console.log("locationdeliver",data);
        $scope.locationDeliverName = data;
        $scope.city = data[0].name;
          }).error(function(data){

          });
    }
    $scope.getLocationDeliver();
  //post address
  $scope.showDiv =  "display:none;";
  $scope.country = "UAE";
  $scope.addAddress = function () {

    $scope.getUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');

    //  $scope.addressObject = $scope.addressType.push($('#addressType').val());
    //  console.log("$scope.addressObject ",$scope.myaddressType[$('#addressType').val()]);
    // $scope.myAddressType = $scope.addressType;

    var addressDetails = {
      userID:$scope.getUserId,
      name:$scope.name,
      addressType:$scope.addressType,
      authToken: $scope.userToken,
      houseNo:$scope.houseNo,
      streetName:$scope.streetName,
      landmark: $scope.landmark,
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
      //$scope.getAddressByUserId ();
      // ngToast.create({
      //   className: 'success',
      //   content: 'New Address Added'
      // });

      location.reload(true);
      //$scope.getAddressByUserId ();
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in adding address'
          // });
        });
      };

      $scope.addrestTypeRadio = false;
      $scope.addNewAddressRadio = false;
      //clearAddress to add new address
      $scope.clearAddress = function(){
        $scope.showAddressType = false;
        $scope.addrestTypeRadio = false;
        $scope.addNewAddressRadio = true;
        //clear textbox
        // $scope.name = "";
        // $scope.landlineNumber = "";
        // $scope.mobileNumber = "";
        // $scope.companyName = "";
        // $scope.street1 = "";
        // $scope.city = "";
        // $scope.pincode = "";
        // $scope.state = "";
        // $scope.country = "";
      }

      //make COD
      $scope.isSelectedCOD = true;
      $scope.makePaymentBtn = false;
      $scope.isThankyou = true;
      $scope.isCod = function(value){
        console.log("isSelectedCOD",value);
        if ($scope.isSelectedCOD == value) {
          $scope.makePaymentBtn = false;
        }
      }
      $scope.isPaymentPanel = false;
      $scope.makeCodPayment = function(){
        $scope.isPaymentPanel = true;
        var codDetails = {
          "UserID":$scope.getUserId,
        	"paymentMethod":1,
        	"address":$scope.addressIdSelected,
        	"billingAddress":$scope.addressIdSelected,
          "deliveryOrderAmount":$scope.deliveryOrderAmount
        }
        Auth.makeCOD(codDetails)
        .success(function(data){
          console.log('codDetails', data);
          $scope.isThankyou = false;
          $scope.getcartItems();
          // ngToast.create({
          //   className: 'success',
          //   content: "Order is Placed"
          // });
          $scope.codOrderDetails =  data;
          $scope.receipt_details = data;
        }).error(function(data){
          console.log(data);
        });
      }

      //thankyou btn
      $scope.thankYou = function(){
        window.location = "#/landing";
      }

      //minimum order value to be calculated to add delivery
      $scope.getMinimumOrderCost = function() {

        Auth.getMinimumOrder().success(function(data) {
          for (var i = 0; i < data.length; i++) {
            $scope.minimumOrderAmount = data[i].minimumOrderAmount;
            $scope.deliveryOrderAmount = data[i].deliveryOrderAmount;
          }
        }).error(function(data) {
          console.log("getMinimumOrder api fails");
        });
      }

      $scope.init();
});
