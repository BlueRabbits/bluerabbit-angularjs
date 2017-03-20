/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute','ngResource','ngCookies','ngToast','ngAnimate','ui.bootstrap','googleplus','facebook', 'angular.filter']);

app.constant('URL', {
  //BASE_URL: "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000"
  BASE_URL: "http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com"
  //BASE_URL: "http://localhost:9000"
  //BASE_URL: "http://192.168.0.84:9000"
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/landing', {
          controller: 'mainController',
          templateUrl: './partials/_page-landing.html'
    })
    	.when('/product-description', {
            controller: '',
            templateUrl: './partials/_product-description.html'
    	})
    	.when('/checkout', {
            controller: 'checkoutCtrl',
            templateUrl: './partials/cart-page.html'
    	})
    	.when('/search-page', {
            controller: 'productController',
            templateUrl: './partials/_page-search.html'
    	})
    	.when('/myaccount', {
            controller: 'loginController',
            templateUrl: './partials/_myaccount.html'
    	})
    	// .when('/login', {
      //       controller: 'loginController',
      //       templateUrl: './partials/login.html'
    	// })
    	// .when('/signup', {
      //       controller: 'loginController',
      //       templateUrl: './partials/signup.html'
    	// })
    	.when('/products', {
            controller: '',
            templateUrl: './partials/_products-page.html'
    	})

    	.otherwise({ redirectTo: '/landing' });


}]);

//google plus config
app.config(['GooglePlusProvider','FacebookProvider', function(GooglePlusProvider,FacebookProvider) {
     GooglePlusProvider.init({
       clientId: '395593907364-cc9p9l4njfd08koqqoouqucgd2u4hbo6.apps.googleusercontent.com',
       apiKey: 'eMDg9klaLT6SqzxwEDDjXupk'
     });
     FacebookProvider.init({
         appId:'1272767759478704'
    });
}]);

app.run(function($rootScope, $location) {

 $rootScope.$on('$routeChangeSuccess', function (event, currentRoute, previousRoute) {
   window.scrollTo(0, 0);
 });
});

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
        $scope.city = 'Select city';
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

app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, GooglePlus, Facebook, ngToast, URL){
  'use strict';

  $scope.BASE_URL = URL.BASE_URL;
  $('.modal').on('hidden.bs.modal', function (e) {
    $(this).find("input").val('').end();
    $scope.errorMessage =  "";
  })

  if ($cookieStore.get('userId')) {
    $scope.show_myaccnt = true;
    $scope.not__logged = false;
    $scope.getEmailId = $cookieStore.get('emailId');
    $scope.userName = $cookieStore.get('userName');
  } else {
    $scope.show_myaccnt = false;
    $scope.not__logged = true;
  }


  $scope.regexEmail = new RegExp(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);
  $scope.Signupform = function(signupform) {
    var regexEmail = new RegExp(/^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/);
    $scope.errorMessage = "";
      var signupcredintials = {};
    if (!$scope.signupform.$valid) {
      $scope.erroralert = true;
      if (signupform.$error.required) {
        $scope.errorMessage = "All fields required";
      } else if (!regexEmail.test($scope.email)) {
          $scope.errorMessage = "Please enter a valid email id";
      } else if (signupform.$error.minlength) {
          $scope.errorMessage = 'Minimum password length 6 required';
      }
    } else {
        // if($scope.signupcredintials) {}
          signupcredintials = {
              name: $scope.name,
              email: $scope.email,
              mobile_number:$scope.mobile_number,
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
         $cookieStore.put("emailId", $scope.email);
         $cookieStore.put("userName", data.name);
         $scope.getEmailId = $cookieStore.get('email');
         $cookieStore.put('loggedIn', true);
         //$location.path('/landing');
        // $scope.getUserProfile();
         //location.reload(true);
        location.reload(true);
        // ngToast.create({
        //   className: 'success',
        //   content: 'Account created successfully'
        // });
      }).error(function(data) {
        console.log('data', data);
        $scope.erroralert = true;
        $scope.errorMessage = data.errors.email.message;
      });
    };
    $timeout(function () {
      $scope.errorMessage = "";
    }, 3000);
  }

  $scope.loginform = function () {
    $scope.erroralert = false;
    $scope.errorMessage = "";
    if (!$scope.krazyloginform.$valid) {
      $scope.errorMessage = "All fields required";
      $scope.erroralert = true;
    } else {
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
         $cookieStore.put("emailId", $scope.email);
         $cookieStore.put("userName", data.name);
         $cookieStore.put('loggedIn', true);
         $scope.getEmailId = $cookieStore.get('email');
         $scope.userId = $cookieStore.get('userId');
         console.log("user id ",$scope.userId);
         $('.modal').css("display", "none");
         $('.modal-open').removeClass();
          //$location.path('/landing');
          location.reload(true);
          // $('#loginmodal').modal('hide');
      }).error(function(data) {
        console.log('data', data);
          $scope.erroralert = true;
          $scope.errorMessage = data.message;
      });
    }
    $timeout(function () {
      $scope.errorMessage = "";
    }, 3000);
  }
  // Define user empty data :/
$scope.user = {};

// Defining user logged status
$scope.logged = false;
  $scope.logout = function () {

    //remove from cart
    $scope.cookieUserId = $cookieStore.get('userId');
    $scope.userToken = $cookieStore.get('token');
    $scope.sessionId = $cookieStore.get('sessionId');

    Auth.emptyCart({UserID:$scope.cookieUserId,sessionID : $scope.sessionId,isDeleted: true})
    .success(function(data){
      console.log('empty cart', data);
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in deleting from Cart'
          // });
        });

    $rootScope.user = {};
    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("email");
    // localStorage.setItem('loggedIn', false);
    $cookieStore.remove("emailId");
    $cookieStore.remove("userId");
    $cookieStore.remove("userName");
    //facebook logout
     var _self = this;
     Facebook.logout(function(response) {
        // user is now logged out
        console.log("log out");
        $rootScope.$apply(function() {
        $rootScope.user = _self.user = {};
      });
      //G+ logout
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
   });
    //cookieStore
    $cookieStore.remove("token");
    $cookieStore.remove("userId");
    $cookieStore.remove("email");
    $cookieStore.put('loggedIn', false);
    // $scope.emptyCart();
    $location.path('/landing');
    //10 seconds delay
    $timeout(function () {
      location.reload();
    }, 3000);
  }
  $scope.hideCartValue = false;
  if ($cookieStore.get('loggedIn') == false) {
    $scope.hideCartValue = true;
  }

  $scope.forgotPassword = function () {
    Auth.forgotpassword({
      email: $scope.forgot.email
    }).success(function (data) {
      $scope.forgotalert = true;
      $scope.forgotError = "Email is sent to registered ID";
    }).error(function (data) {
      $scope.forgotalert = true;
      $scope.forgotError = data.error;
    });
  }

  $scope.product = function() {
      Auth.products().success(function(data) {
      console.log('data',data);
    }).error(function(data) {
      console.log('data', data);
    });
  }
  //   $scope.product();


//closing pop-up on redirect to another pop-up
  $scope.closeModal = function() {
    $('.modal').click();
  }

  $scope.tabsMyaccount = function(){
    var navItems = $('.admin-menu li > a');
  var navListItems = $('.admin-menu li');
  var allWells = $('.admin-content');
  var allWellsExceptFirst = $('.admin-content:not(:first)');

  allWellsExceptFirst.hide();
  navItems.click(function(e)
  {
      e.preventDefault();
      navListItems.removeClass('active');
      $(this).closest('li').addClass('active');

      allWells.hide();
      var target = $(this).attr('data-target-id');
      $('#' + target).show();
  });
  }

  //get Profile of users
  $scope.getUserProfile = function() {
       $scope.showTab = 'profile';
    $scope.userProfileShow =  true;
    Auth.userProfile().success(function(data) {
      $scope.userDetails = data;
      if (data.image_url) {
        $scope.hideAvatar = false;
      } else {
        $scope.hideAvatar = true;
      }
      console.log('user profile',data.name);
      $cookieStore.put('userName', data.name);
      $cookieStore.put('emailId', data.email);
      $scope.userId = $cookieStore.get('userId');
      $scope.userName = $cookieStore.get('userName');
      $scope.userEmail = $cookieStore.get('emailId');
    }).error(function(data) {
      console.log('data', data);
    });
  }

  //reset or change password
  $scope.showChangePassword = function(){
    $scope.userChangePassword =  true;
  }

  // var token ={
  //   "token" : authToken
  // }
  $scope.changePassword = function() {
      var PwdauthToken = $cookieStore.get('token');
      $scope.userId = $cookieStore.get('userId');
    var passwordToChange = {
      "oldPassword": $scope.oldPassword,
      "newPassword": $scope.newPassword
    }

      var BASE_URL = "http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com:9000";
        var config = {
            headers : {
                'Authorization': 'Bearer '+PwdauthToken,
                'Content-Type': 'application/json'
            }
        }

        $http.post(BASE_URL +  '/api/users/'+$scope.userId+'/password', passwordToChange, config)
        .success(function (data, status, headers, config) {
            console.log('user profile', data.name);
            $scope.userName = data.name;
            $scope.userEmail = data.email;

        })
        .error(function (data, status, header, config) {
            $scope.ResponseDetails = "Data: " + data +
                "<hr />status: " + status +
                "<hr />headers: " + header +
                "<hr />config: " + config;
        });
      $scope.editPassword = false;

  }

  //NOTE : GooglePlus login
  $scope.googlePlusLogin = function () {
         GooglePlus.login().then(function (authResult) {
             console.log("authResult",authResult);

             GooglePlus.getUser().then(function (data) {
                 console.log("user",data);
                 $scope.userName = data.name;
                 $scope.emailId = data.email;
                 $scope.imageUrls = data.picture;
                 console.log("$scope.imageUrls",$scope.imageUrls);
                 $cookieStore.put("emailId", $scope.emailId);
                 $cookieStore.put('userName', $scope.userName);
                 $cookieStore.put('imageUrls', data.picture);
                 localStorage.setItem('imageUrls', data.picture);
                 $scope.imageUrls = localStorage.getItem('imageUrls');
                 console.log("$scope.imageUrls",$scope.imageUrls);
                 var socailParams = {
                   "email": $scope.emailId,
                   "name": $scope.userName
                 }
                 Auth.socailLogin(socailParams).success(function(data) {
                   console.log('social Resp', data);
                   $cookieStore.put("token", data.token);
                   $cookieStore.put("userId", data._id);
                   $cookieStore.put("emailId", $scope.emailId);
                   $cookieStore.put('userName', data.name);

                   $('.modal').css("display", "none");
                   $('.modal-open').removeClass();
                   $scope.closeModal();
                   location.reload();
                 }).error(function(data) {
                   console.log('data', data);
                 });

             });

         }, function (err) {
             console.log(err);
         });

        // $window.location.href = 'http://localhost:9000/auth/google';
        // // $scope.userId = $cookieStore.get('userId');
        //location.reload();
       };

  //NOTE:FB login

$scope.fbLoginAuth = function() {
  $scope.login = function() {
    // From now on you can use the Facebook service just as Facebook api says
    Facebook.login(function(response) {
      // Do something with response.
        $scope.me();
      console.log("Facebook", response);
      $scope.getLoginStatus();
    });
  };
  $scope.login();
  $scope.getLoginStatus = function() {
    Facebook.getLoginStatus(function(response) {
      console.log(response);
      $scope.me();
      $('.modal').css("display", "none");
      $('.modal-open').removeClass();
      $scope.closeModal();

      // if (response.status === 'connected') {
      //   $scope.me();
      //   $scope.loggedIn = true;
      // } else {
      //   $scope.loggedIn = false;
      // }
    });
  };
  $scope.getLoginStatus();
  //Facbook-me
  $scope.me = function() {
    Facebook.api('/me', { locale: 'en_US', fields: 'name, email' }, function(response) {
      /**
       * Using $scope.$apply since this happens outside angular framework.
       */
      $scope.$apply(function() {
        $scope.user = response;
        $scope.userName = response.name;
        $scope.emailId = response.email
        $cookieStore.put("emailId", $scope.emailId);
        $cookieStore.put('userName', $scope.userName);
        console.log("$scope.user",$scope.user);


      });
      var socailParams = {
        "email": $scope.emailId,
        "name": $scope.userName
      }
      Auth.socailLogin(socailParams).success(function(data) {
        console.log('social Resp', data);
        $cookieStore.put("token", data.token);
        $cookieStore.put("userId", data._id);
        $cookieStore.put('userName', data.name);
        $('.modal').css("display", "none");
        $('.modal-open').removeClass();
        $scope.closeModal();
        location.reload(true);
      }).error(function(data) {
        console.log('data', data);
      });

    });
  };
};

//home
$scope.redirectLanding = function() {
  // location.reload();
  $location.path('/landing');
}

//load modal windows on click
$scope.signupModal = function(){
  $('#loginmodal').modal('show');
  $('#signupmodal').modal('hide');
}
$scope.loginModal = function(){
  $('#loginmodal').modal('hide');
  $('#signupmodal').modal('show');
}

//order getOrderBuYUserId
$scope.getOrdersByUserId = function() {

  Auth.getOrdersByUserId().success(function(data) {
    $scope.orderHistoryLive = data;
    $scope.orderHistory = data;
    for (var i = 0; i < $scope.orderHistory.length; i++) {
      console.log($scope.orderHistory[i].itmes);
      $scope.orderDetailsProduct = $scope.orderHistory[i].itmes;
      $scope.ordersProductName = $scope.orderHistory[i].itmes[i];
      console.log("name",$scope.ordersProductName);
    }

    console.log('user orders', $scope.orderHistory);
    console.log('user orders', $scope.orderHistoryLive);
  }).error(function(data) {
    console.log('data', data);
  });
};

$scope.showLiveOrders = true;
$scope.liveOrders = function(){
  $scope.showLiveOrders = true;
  $scope.showPastOrders = false;
}
$scope.pastOrders = function(){
  $scope.showPastOrders = true;
  $scope.showLiveOrders = false;
}

//get Address
$scope.getAddressMyAccount = function(){
  Auth.getAddressByUserId().success(function(data){
    $scope.getAddressByUserId = data;
  }).error(function(data){
    console.log(data);
  });
}

//delete Address by Address ID
$scope.deleteAddress = function(addressId){
  console.log(addressId);
  Auth.deleteAddress(addressId)
  .success(function(data){
    $scope.getAddressMyAccount();
    console.log('address deleted', data);
    // ngToast.create({
    //   className: 'success',
    //   content: data.message
    // });
      }).error(function(data){
        console.log(data);
      });
}
//edit Address by Address ID
$scope.showEditAddressFields = false;
$scope.getAddressIdToEdit = function(addressId){
  $scope.showEditAddressFields = true;
  console.log(addressId);
  $scope.getAddressId = addressId;
  for (var i = 0; i < $scope.getAddressByUserId.length; i++) {
    if ($scope.getAddressByUserId[i]._id === addressId) {
        $scope.name = $scope.getAddressByUserId[i].name;
        $scope.addressType = $scope.getAddressByUserId[i].addressType;
        $scope.houseNo = $scope.getAddressByUserId[i].houseNo;
        $scope.streetName = $scope.getAddressByUserId[i].streetName;
        $scope.landmark = $scope.getAddressByUserId[i].landmark;
        $scope.companyName = $scope.getAddressByUserId[i].companyName;
        $scope.officeNumber = $scope.getAddressByUserId[i].officeNumber;
        $scope.mobileNumber = $scope.getAddressByUserId[i].mobileNumber;
        $scope.landLineNumber = $scope.getAddressByUserId[i].landLineNumber;
        $scope.pinCode = $scope.getAddressByUserId[i].pinCode;
        $scope.city = $scope.getAddressByUserId[i].city;
        $scope.state = $scope.getAddressByUserId[i].state;
        $scope.country = $scope.getAddressByUserId[i].country;
    }
  }
}
$scope.editAddress = function(){

  var addressDetails = {
  name: $scope.name,
  userID: $scope.userId ,
  addressType: $scope.addressType,
  // "authToken": "",
  houseNo: $scope.houseNo,
  streetName: $scope.streetName,
  landmark: $scope.landmark,
  // street4: Near to hotel,
  companyName: $scope.companyName,
  // officeNumber: 1234567890,
  mobileNumber: $scope.mobileNumber,
  landLineNumber: $scope.landLineNumber,
  pinCode: $scope.pinCode,
  city: $scope.city,
  state: $scope.state,
  country: $scope.country
  // isDefault: True
};
  Auth.editAddress($scope.getAddressId,addressDetails)
  .success(function(data){
    $scope.getAddressMyAccount();
    $scope.showEditAddressFields = false;
    console.log('address deleted', data);
    // ngToast.create({
    //   className: 'success',
    //   content: "Successfully Updated the address"
    // });
      }).error(function(data){
        console.log(data);
      });
}

//upload formdata imageUrls
      var formdata = new FormData();
      $scope.isDataAvailable = false;
      $scope.getTheFiles = function($files) {
        angular.forEach($files, function(value, key) {
          formdata.append(key, value);
          console.log(formdata);
        });
        console.log($('#file1').val());
        console.log(formdata);
        formdata.append('file', formdata);
        Auth.imageUpload(formdata)
          .success(function(data) {
            console.log('profile formdata', data);
            $scope.profileImage = data.url;
            $scope.isDataAvailable = true;

          }).error(function(data) {
            console.log(data);
          });
      };

      $scope.hideAvatar = true;
      $scope.ProfileUpdate = function() {
        $scope.hideAvatar = false;
        var profileDetails = {
          "name": $scope.userName,
          "image_url": $scope.profileImage
        }
        Auth.profileImageUpload(profileDetails)
          .success(function(data) {
            $scope.getUserProfile();
            $scope.showAvatar = false;
            console.log('profile updated data', data);
            $scope.emailId = data.email;
            $scope.userName = data.name;
            // ngToast.create({
            //   className: 'success',
            //   content: "Successfully Updated the address"
            // });
          }).error(function(data) {
            console.log(data);
          });

      };

      //post feedBack
      $scope.feedBack = function(){
        $scope.userId = $cookieStore.get('userId');
        var feedBackDetails = {
          "userID": $scope.userId,
          "feedBackComments" : $scope.feedBackComments
        }
        Auth.feedBack(feedBackDetails)
          .success(function(data) {
            $scope.feedBackComments = "";
            console.log('profile updated data', data);

            // ngToast.create({
            //   className: 'success',
            //   content: "Feedback sent Successfully"
            // });
          }).error(function(data) {
            console.log(data);
            // ngToast.create({
            //   className: 'warning',
            //   content: data.message
            // });
          });

      }

      //empty cart
      $scope.emptyCart = function () {
        $scope.cookieUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');

        Auth.emptyCart({UserID:$scope.cookieUserId,sessionID : $scope.sessionId,isDeleted: true})
        .success(function(data){
          console.log('empty cart', data);
            }).error(function(data){
              // ngToast.create({
              //   className: 'warning',
              //   content: 'Problem in deleting from Cart'
              // });
            });
          };

          $scope.showContactUs = function(){
            $location.path('/myaccount').search({
              show_contactUs: "contactNsupport"
            });
          }


          if($routeParams.show_contactUs){
            $scope.showTab = 'contactNsupport';
            $scope.ContactSupport = true;
            $scope.OldContactSupport = false;
          }


}).directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ]);

app.controller('mainController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, ngToast ){
  'use strict';
  $scope.showTab = "Recommended";
  $(document).ready(function() {
    $('.products-tab').hide();
    $('.products-tab').first().show();
    $('#tabs-menu a').first().addClass('active');

    $('#tabs-menu a').click(function(e) {
      $('.products-tab').hide();
      $('#tabs-menu a').removeClass('active');

      $(this).addClass('active');
      e.preventDefault();
      var thisTab = $(this).attr('href');
      $(thisTab).show();
    });
  });

  $('.header-menu__list').find('a').click(function(){
    var $href = $(this).attr('href');
    var $anchor = $($href).offset();
    window.scrollTo($anchor.left,$anchor.top  - 147);
    return false;
  });

  $(document).ready(function(){
  	$('.search-icon').click(function() {
  		$('.search-box').show();
      $('.close-icon').show();
  	});
  	$('.close-icon').click(function() {
  		$('.search-box').hide();
      $('.close-icon').hide();
  	});
  });



  //section slider
  $scope.myInterval = 8000;
  $scope.noWrapSlides = false;

//   var slideIndex = 0;
// $scope.showSlides = function() {
//     var i;
//     var slides = document.getElementsByClassName("mySlides");
//     var dots = document.getElementsByClassName("dot");
//     for (i = 0; i < slides.length; i++) {
//        slides[i].style.display = "none";
//     }
//     slideIndex++;
//     if (slideIndex> slides.length) {slideIndex = 1}
//     // for (i = 0; i < dots.length; i++) {
//     //   //  dots[i].className = dots[i].className.replace(" active", "");
//     // }
//     slides[slideIndex-1].style.display = "block";
//     //$(slides[slideIndex-1]).css("display","block");
//     //dots[slideIndex-1].className += " active";
//     setTimeout($scope.showSlides, 6000); // Change image every 2 seconds
// }

  //create session id

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

  //slider

$('#prv-testimonial').on('click', function(){
    var $last = $('#testimonial-list .slide-list:last');
    $last.remove().css({ 'margin-left': '-248px' });
    $('#testimonial-list .slide-list:first').before($last);
    $last.animate({ 'margin-left': '0px' }, 1000);
});

$('#nxt-testimonial').on('click', function(){
    var $first = $('#testimonial-list .slide-list:first');
    $first.animate({ 'margin-left': '-248px' }, 1000, function() {
        $first.remove().css({ 'margin-left': '0px' });
        $('#testimonial-list .slide-list:last').after($first);
    });
});

  //redirection
  $(".search-box").keypress(function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      if (code.toString() == 13) {
         nextpage(); // call the function to redirect to another page
          return false;
      }
    });

  // Function that redirect the user to another page
  function nextpage() {
    window.location = "#/search-page";
  }


  //scrooling page,showing header fixed

// $(window).scroll(function(){
//   var elementPosition = $('#scroll-menu-fixed').offset().top;
//   if($(window).scrollTop() > elementPosition){
//     $('#scroll-menu-fixed').css('position','fixed').css({"top":"0","right":"0","left":"0"});
//   } else {
//     $('#scroll-menu-fixed').css('position','static');
//   }
// });

  //get all products in landing page
  $scope.product = function() {
    $scope.productslist = [];
    $scope.loading = true;
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
       console.log("product id", $scope.productslist);
     });
       $scope.getCategoriesList ();
    }).error(function(data) {
      console.log('data', data);
        console.log("no Products",data);
    });
  }
  $scope.product();

  //get list of categories
  $scope.getCategoriesList = function(){
    $scope.loading = true;
    Auth.getCategories().success (function (data) {
      console.log('get cat data', data);
      $scope.getCategoryList = data;
    }).error(function(data){
      console.log('data', data);
         console.log("no categories");
    });
  }
  $scope.activeTab = 0;
  $scope.categoryNames = "Recommended";
  $scope.setActiveTab = function(tabToSet, categoryName){
    $scope.activeTab = tabToSet;
    $scope.categoryNames = categoryName;
  }

  $scope.initSetTab = function(dir) {
    var parent = angular.element('.menu-tabs__list');
    var $activeateElm = null;
    for(var i=0; i<parent.children().length; i++) {
      if($(parent.children()[i]).children().hasClass('active')) {
        if(dir === 'next') {
          $activeateElm = $(parent.children()[i]).next();
        } else {
          $activeateElm = $(parent.children()[i]).prev();
        }
      }
    }
    $timeout(function() {
      angular.element($activeateElm.find('a')).trigger('click');
    }, 0);
  }

  //POST create add to cart
  $scope.userToken = $cookieStore.get('token');
  var count = 0;
  $scope.addToCart = function(productId) {
    $scope.loading = true;
    if ($cookieStore.get('token')) {

        count++;
        //cookieStore
        $scope.getUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');
        //check for no dupes on cart
        $scope.gettingCartIds = [];
        angular.forEach($scope.allCartItems, function(value, key) {
          var obj = {
            "cartIds": value._id,
            "cartQty": value.quantity,
            "productIds": value.product._id
          };
          $scope.gettingCartIds.push(obj);
        });

        //loop to check if prodct id exist in cart then increment qty
        $scope.incrementQty = false;
        $scope.addCart = false;
        for (var i = 0; i < $scope.gettingCartIds.length; i++) {
          console.log($scope.gettingCartIds[i].productIds);
          if ($scope.gettingCartIds[i].productIds === productId) {
            console.log("that cart id of prod", $scope.gettingCartIds[i].cartQty);
            console.log("call increment function");
            $scope.cartQuantity = $scope.gettingCartIds[i].cartQty;
            $scope.cartIds = $scope.gettingCartIds[i].cartIds;
            $scope.incrementQty = true;
          } else {
            console.log("i am here");
            $scope.addCart = true;
          }
        }

        if ($scope.incrementQty === true) {
          console.log('add to quantity');
          $scope.updateCartByIncrement($scope.cartQuantity, $scope.cartIds);
        } else if($scope.incrementQty === false && $scope.addCart === true || $scope.allCartItems.length === 0) {
          // do add to cart if not matching
          console.log('add new item');
          var addQuantity = 1;
          $scope.cartlist = [];
          var productInfo = {
            product: productId,
            quantity: addQuantity,
            UserID: $scope.getUserId,
            sessionID: $scope.sessionId,
            authToken: $scope.userToken,
            isDeleted: false
          }
          Auth.addCart(productInfo)
            .success(function(data) {
              //console.log('data', data);
              $scope.getcartItems();
              // ngToast.create({
              //   className: 'success',
              //   content: 'Item Added to Cart',
              //   timeout:1000
              // });

              angular.forEach(data, function(value, key) {
                var obj = {
                  "user_id": value.UserID,
                  "productId": value.product,
                  "quantity": value.quantity,
                };
                $scope.cartlist.push(obj);
                console.log("cart", $scope.cartlist);
              });
            }).error(function(data) {
              // ngToast.create({
              //   className: 'warning',
              //   content: 'Problem in Adding to Cart',
              //   timeout:1000
              // });
            });
        }
      }  else {
        $('#loginmodal').modal('toggle');
      }
  };

  //getCart items
  $scope.getcartItems = function () {
    $scope.loading = true;
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
      $scope.getCategoriesList();
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "qty":value.quantity,
          "cartPrice" : value.product.salePrice,
          "productIds" : value.product._id
        };
        $scope.gettingCartData.push(obj);

      });
      console.log("gettingCartData",$scope.gettingCartData);
      $scope.totalCost = 0;
      for (var i = 0; i < $scope.gettingCartData.length; i++) {
          $scope.totalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
            console.log("prce", $scope.totalCost);
      }


    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in Get Cart API',
      //   timeout:1000
      // });
    });
  };
  $scope.getcartItems();

  //updateCart increment
  //$scope.countQuantity = 0;
  $scope.updateCartByIncrement = function(quantity,productId) {
    $scope.loading = true;
    $scope.countQuantity =quantity + 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
    .success(function(data){
      console.log('updated resp', data);
      // ngToast.create({
      //   className: 'success',
      //   content: 'Quantity Increased in cart',
      //   timeout:1000
      // });
      $scope.getcartItems();
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in incrementing cart',
          //   timeout:1000
          // });
        });
  }


      //slider
      // $('#myCarousel').carousel({
      //   interval: 1000000
      // })

      $('.carousel .item').each(function(){
        var next = $(this).next();
        if (!next.length) {
          next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length>0) {
          next.next().children(':first-child').clone().appendTo($(this));
        }
        else {
        	$(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
      });


      //google maps
      //get deliver location
      $scope.getLocationDeliver = function(){
      //  var locations = [];
            Auth.getLocationDeliver().success (function (data) {
              console.log('getLocationDeliver', data);
              $scope.locationDeliver = data;
              //google maps
              var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: new google.maps.LatLng(25.27, 55.29),
                mapTypeId: google.maps.MapTypeId.ROADMAP
              });

              var infowindow = new google.maps.InfoWindow();

              var marker, i;
              //loops data from api
              for (var i = 0; i < data.length; i++) {
                $scope.lat = data[i].lat;
                $scope.lng = data[i].lng;
                $scope.locName = data[i].name;
                $scope.locations = [data[i].name,data[i].lat,data[i].lng];
                console.log("locations",$scope.locations);
                //google maps
                        marker = new google.maps.Marker({
                          position: new google.maps.LatLng(data[i].lat,data[i].lng),
                          map: map
                        });

                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                          return function() {
                            infowindow.setContent(data[i].name);
                            infowindow.open(map, marker);
                          }
                        })(marker, i));
              }

            }).error(function(data){
              console.log('data', data);

            });

      };
      $scope.getLocationDeliver();

  //Note :redirect to show wish list
$scope.showWishList = function(){
  $location.path('/search-page').search({
    show_wishlist: true,
  });
}

//NOTE: redirect to search on click product
  $scope.showProductSearchPage = function(productName, catname, productIds){
    $location.path('/search-page').search({
      show_productDetails: productName,
      category: catname,
      product_id:productIds
    });
  }
  $scope.ourMenu = function(catname){
    $location.path('/search-page').search({
      showMenuResult: true,
      category: catname,
    });
  }

  //NOTE : todays deal api
  $scope.getTodaysDeal = function(){
        Auth.todaysDeal().success (function (data) {
          console.log('get todaysDeal', data);
          $scope.getTodaysDealProduct = data;
        }).error(function(data){
          console.log('data', data);
             console.log("no categories");
        });
  };
  // $scope.getTodaysDeal();

  $scope.getWishList = function () {
    $scope.loading = true;
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
      $scope.getListOfFav = data;
      $scope.getWishListProductId = [];
      angular.forEach($scope.getWishlistData, function (value, key) {
        var obj = {
          "productIds":value.product._id,
        };
        $scope.getWishListProductId.push(obj.productIds);

      });
      console.log("list of product ids",$scope.getProductIdList);
      console.log("$scope.getWishListProductId",$scope.getWishListProductId);
      // //objects heart to bind in UI
      // $scope.heartList = {};
      // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
      //   $scope.heartList[i] = $scope.getWishListProductId[i];
      //
      // }
      // console.log("$scope.heartList;",$scope.heartList);
      // //objects product to bind in UI
      // $scope.productList = {};
      // for (var i = 0; i < $scope.getProductIdList.length; i++) {
      //   $scope.productList[i] = $scope.getProductIdList[i];
      //
      // }
      // console.log("$scope.productList;",$scope.productList);
      //
      // //two level loops
      // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
      //   for (var i = 0; i < $scope.getProductIdList.length; i++) {
      //       if ($scope.getWishListProductId[i] = $scope.getProductIdList[i]) {
      //         $scope.showHeart = $scope.getWishListProductId;
      //       }
      //
      //   }
      //
      // }

      // //heart list
      // if ($scope.heartList = $scope.productList) {
      //   $scope.showHeart = true;
      // } else {
      //   $scope.showHeart = false;
      // }
    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in getting data from wish list'
      // });
    });
  };

$scope.getWishList();
        //check the heart
        $scope.hideWishlist= true;
        $scope.isInWishlist = function(productId){
          for (var i = 0; i < $scope.getListOfFav.length; i++) {

              if ($scope.getListOfFav[i].product._id == productId) {
                $scope.hideWishlist= true;
                $scope.showFilledHeart = true;
                return true;
              } else {
                $scope.hideWishlist= true;
                  $scope.showFilledHeart = false;

                // return false;
              }

          }
        }
  //POST create wish list
  // var count = 0;
  $scope.addWishList = function (productId) {
    $scope.loading = true;
    //$scope.productIdWishList = productId;
    if ($cookieStore.get('userId')) {
        for (var i = 0; i < $scope.getWishListProductId.length; i++) {

          if ($scope.getWishListProductId[i] == productId) {
            $scope.isProdSishList = true;
          } else {
            $scope.isProdSishList = false;

          }
        }


        if ($scope.isProdSishList == false || $scope.getWishlistData.length === '') {
          console.log("added to cart");

          var count = 1;
          console.log("quantity count",count);

          //cookieStore
          $scope.getUserId = $cookieStore.get('userId');
          $scope.userToken = $cookieStore.get('token');
          $scope.sessionId = $cookieStore.get('sessionId');
          //check if already added to wish list


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
                                      $scope.getWishList();


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
                                          // ngToast.create({
                                          //   className: 'warning',
                                          //   content: 'Problem in server'
                                          // });
                                        });

                    }
        } else {
            $('#loginmodal').modal('toggle');
        }
  };

  //delete wish list
  $scope.deleteWishList =  function(productId){
    console.log("delete view id ",productId);
    for (var i = 0; i < $scope.getWishlistData.length; i++) {
      if ($scope.getWishlistData[i].product._id == productId) {
        $scope.wishListId = $scope.getWishlistData[i]._id;
      }
    }
    console.log("$scope.wishListId",$scope.wishListId);
    $scope.getUserId = $cookieStore.get('userId');
    console.log($scope.getUserId );
    Auth.deleteWishList($scope.wishListId,{UserID:$scope.getUserId,product:productId, isDeleted: "true"}).success(function(data) {
      $scope.deltedWishList = data;
      $scope.getWishList();
      console.log("done delted");
      $scope.hideWishlist= true;
      $scope.showFilledHeart = false
      // $scope.getCategoriesList();
      $scope.showMenuResult  = true;
    }).error(function(data) {
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Check Product list API '
      // });
    });
  }

      //show searchPage
      $scope.showSearchPage = function(catname){
        $location.path('/search-page').search({
          showMenuResult: true,
          category: catname,
        });
      }

      //new Banner API
      //NOTE : todays deal api
      $scope.getAllBanner = function(){
            Auth.getBanners().success (function (data) {
              console.log('getBanners', data);
              $scope.getBanners = data;
            }).error(function(data){
              console.log('data', data);
            });
      };
      $scope.getAllBanner();

})

app.controller('productController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, ngToast){
  'use strict';

$('#next').on('click',function(e){
  e.preventDefault();
  $('.search-page__tab-list').animate({'margin-left':'0px'}, 1000, function(){
    // $('#next').addClass('hidden');
    // $('#prev').removeClass('hidden');
  });
});
$('#prev').on('click',function(e){
  e.preventDefault();
  $('.search-page__tab-list').animate({'margin-left':'-190px'}, 1000, function(){
    // $('#prev').addClass('hidden');
    // $('#next').removeClass('hidden');
  });
});

$(document).ready(function(){
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
  moveScroller();
});

$(window).on('scroll', function() {
  $('.target').each(function() {
    if($(window).scrollTop() >= ($(this).offset().top - 104)) {
      var id = $scope.clearSpaces($(this).attr('id'));
      var $elm = '#'+id+'-a';
      $('#tabs-menu a').removeClass('active');
      $($elm).addClass('active');
    }
  });
});

function moveScroller() {
  var $anchor = $("#scroller-anchor");
  var $scroller = $('#scroller');

  var move = function() {
    var st = $(window).scrollTop();
    var ot = $anchor.offset().top;
    if(st > ot) {
      $scroller.css({
        position: "fixed",
        top: "0px",
        width: "70%"
      });
      $anchor.css({
        height: "104px"
      });
    } else {
      if(st <= ot) {
        $scroller.css({
          position: "relative",
          top: "",
          width: "100%"
        });
        $anchor.css({
          height: "0px"
        });
      }
    }
  };
  $(window).scroll(move);
  move();
}

$scope.init = function() {
  $scope.product();
  $scope.getWishList();
}

//invoke wishList on routeParams
if($routeParams.showMenuResult){
  $scope.showMenuResult = true;
  $scope.categoryNames = $routeParams.category;
}

//show menu
if($routeParams.show_wishlist){
  $scope.show_wishlist = true;
}

$scope.initSetFirtsTab = function() {
  if($location.path() === '/search-page') {

  }
}
//window height for cart__search
console.log("$(window).height(); ",$(window).height());
  $scope.cartHeight = $(window).innerHeight()/2;


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

  //NOTE: get product name from  url
  $scope.showParticularProducts = function(id){
      if($routeParams.show_productDetails){

        Auth.products().success(function(data) {
          $scope.searchPagelist = false;
          $scope.particularProduct = true;
          $scope.show_wishlist  = false;
          $scope.showMenuResult  = true;
          $scope.hideAutocomplete = false;

          for (var i = 0; i < data.length; i++) {
            if (id == data[i]._id) {
              $scope.search_result_product = data[i];

            }
          }
              $scope.showParticularProductsDiv = true;

          console.log("$scope.search_result ",$scope.search_result_product );
          console.log("data[i]",$scope.search_result_product);
        }).error(function(data) {
        });
      }
  }

  $scope.$on('$routeChangeSuccess', function() {
   console.log("$routeParams",$routeParams);
   $scope.showParticularProducts ($routeParams.product_id);
});
  if($routeParams.show_productDetails){
    $scope.showParticularProducts($routeParams.product_id);
    $scope.showParticularProductsDiv = true;
    $scope.categoryNames = $routeParams.category;
  }

  //minimum order value to be calculated to add delivery
  $scope.getMinimumOrder = function() {

    Auth.getMinimumOrder().success(function(data) {
      for (var i = 0; i < data.length; i++) {
        $scope.minimumOrderAmount = data[i].minimumOrderAmount;
        $scope.deliveryOrderAmount = data[i].deliveryOrderAmount;
      }
    }).error(function(data) {
      console.log("getMinimumOrder api fails");
    });
  }

  $scope.getcartItems = function () {
    $scope.loading = true;
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
      $scope.getCategoriesList();
      $scope.getMinimumOrder();
      angular.forEach($scope.allCartItems, function (value, key) {
        var obj = {
          "qty":value.quantity,
          "cartPrice" : value.product.salePrice,
          "productIds" : value.product._id
        };
        $scope.gettingCartData.push(obj);

      });

      console.log("gettingCartData",$scope.gettingCartData);
      $scope.totalCost = 0;
      $scope.subTotalCost = 0;
    //  $scope.deliveryOrderAmount = 0;
      for (var i = 0; i < $scope.gettingCartData.length; i++) {
          $scope.subTotalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
          $scope.totalCost += $scope.gettingCartData[i].qty * $scope.gettingCartData[i].cartPrice ;
            console.log("prce", $scope.totalCost);
      }
      $scope.showDeliveryCost = true;

      //calculate delivery cost
      if ($scope.totalCost <= $scope.minimumOrderAmount) {
          //$scope.showDeliveryCost = true;
          $timeout(function() {
            $scope.totalCost += $scope.deliveryOrderAmount;
          }, 500);

      } else {
        $scope.showDeliveryCost = false;
      }

      //cart length zero total is zero
      if ($scope.gettingCartData.length === 0) {
        $scope.totalCost = 0;
      }

    }).error(function(data){
      // ngToast.create({
      //   className: 'warning',
      //   content: 'Problem in Get Cart API'
      // });
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
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in incrementing cart'
          // });
        });
  }

  //updateCart on decrement
  $scope.countQuantity = 0;
  $scope.updateCartByDecrementing = function(quantity,productId) {
    $scope.countQuantity =quantity - 1;
    console.log("countQuantity",$scope.countQuantity);
    $scope.getUserId = $cookieStore.get('userId');
    if ($scope.countQuantity > 0) {
      Auth.updateCart({UserID:$scope.getUserId, "quantity": $scope.countQuantity}, productId)
      .success(function(data){
        console.log('updated decrement', data);
        $scope.getcartItems();
          }).error(function(data){
            // ngToast.create({
            //   className: 'warning',
            //   content: 'Problem in decrement cart'
            // });
          });
        } else {
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Minimum quantity is 1'
          // });
        }
  }

  //search -autoComplete
  $scope.autocompleteSearch = function (searchNames) {
    $scope.loading = true;
    Auth.autocompleteSearchItem (searchNames).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.particularProduct = false;
      $scope.show_wishlist  = false;
      $scope.showMenuResult  = false;
      $scope.hideAutocomplete = true;
      //NOTE : uncomment if know more is creating a issue
      // $location.search('show_productDetails', null)
      console.log('autcomplete data', data);
      $scope.searchAutocompleteId = data;
    }).error(function(data){
      console.log("autocomplete search",data);
    });
  };

  //search
  $scope.searchList = function (searchName) {
    $scope.loading = true;
    Auth.searchItem (searchName).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.particularProduct = false;
      $scope.show_wishlist  = false;
      $scope.showMenuResult  = false;
      $scope.hideAutocomplete = false;
      $scope.categoryNames = $routeParams.category;
      console.log('search data', data);
      $scope.search_result = data;

    }).error(function(data){
      console.log("problem in search term API",data);
    });
  };

  //POST create add to cart
  var count = 0;
  $scope.addToCart = function(productId) {
    $scope.loading = true;
    if ($cookieStore.get('token')) {
        count++;
        //cookieStore
        $scope.getUserId = $cookieStore.get('userId');
        $scope.userToken = $cookieStore.get('token');
        $scope.sessionId = $cookieStore.get('sessionId');
        //check for no dupes on cart
        $scope.gettingCartIds = [];
        angular.forEach($scope.allCartItems, function(value, key) {
          var obj = {
            "cartIds": value._id,
            "cartQty": value.quantity,
            "productIds": value.product._id
          };
          $scope.gettingCartIds.push(obj);
        });

        //loop to check if prodct id exist in cart then increment qty
        $scope.incrementQty = false;
        $scope.addCart = false;
        for (var i = 0; i < $scope.gettingCartIds.length; i++) {
          console.log($scope.gettingCartIds[i].productIds);
          if ($scope.gettingCartIds[i].productIds === productId) {
            console.log("that cart id of prod", $scope.gettingCartIds[i].cartQty);
            console.log("call increment function");
            $scope.cartQuantity = $scope.gettingCartIds[i].cartQty;
            $scope.cartIds = $scope.gettingCartIds[i].cartIds;
            $scope.incrementQty = true;
          } else {
            console.log("i am here");
            $scope.addCart = true;
          }
        }

        if ($scope.incrementQty === true) {
          console.log('add to quantity');
          $scope.updateCartByIncrement($scope.cartQuantity, $scope.cartIds);
        } else if($scope.incrementQty === false && $scope.addCart === true || $scope.allCartItems.length === 0) {
          // do add to cart if not matching
          console.log('add new item');
          var addQuantity = 1;
          $scope.cartlist = [];
          var productInfo = {
            product: productId,
            quantity: addQuantity,
            UserID: $scope.getUserId,
            sessionID: $scope.sessionId,
            authToken: $scope.userToken,
            isDeleted: false
          }
          Auth.addCart(productInfo)
            .success(function(data) {
              //console.log('data', data);
              $scope.getcartItems();
              // ngToast.create({
              //   className: 'success',
              //   content: 'Item Added to Cart'
              // });

              angular.forEach(data, function(value, key) {
                var obj = {
                  "user_id": value.UserID,
                  "productId": value.product,
                  "quantity": value.quantity,
                };
                $scope.cartlist.push(obj);
                console.log("cart", $scope.cartlist);
              });
            }).error(function(data) {
              // ngToast.create({
              //   className: 'warning',
              //   content: 'Problem in Adding to Cart'
              // });
            });
        }
      }  else {
        $('#loginmodal').modal('toggle');
      }
  };

  //delte cart
  $scope.deleteCart = function (productId,quantity) {
    $scope.loading = true;
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

      $scope.wishListShow = function () {
        $scope.show_wishlist  = true;
        $scope.searchPagelist = false;
        $scope.particularProduct = false;

        $scope.showMenuResult  = false;
        $scope.getWishList();
      }

      //get all products in landing page
      $scope.product = function() {
        $scope.loading = true;
        $scope.productslist = [];
        Auth.products().success(function(data) {
          $scope.allProducts = data;
          console.log("data",data);
          $scope.getWishList();
          //loop to get product id
          $scope.getProductIdList = [];
          angular.forEach($scope.allProducts, function (value, key) {
            var obj = {
              "productIds":value._id,
            };
            $scope.getProductIdList.push(obj.productIds);

          });


          // for (var i = 0; i < $scope.getWishListProductId.length; i++) {
          //   // $scope.getWishListProductId[i]
          // }
        //  $scope.showMenuResult  = true;
        }).error(function(data) {
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Check Product list API ',
          //   timeout:1000
          // });
        });
      }

      //get wish list

      $scope.getWishList = function () {
        $scope.loading = true;
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
          $scope.getListOfFav = data;
          $scope.getWishListProductId = [];
          angular.forEach($scope.getWishlistData, function (value, key) {
            var obj = {
              "productIds":value.product._id,
            };
            $scope.getWishListProductId.push(obj.productIds);

          });
          console.log("list of product ids",$scope.getProductIdList);
          console.log("$scope.getWishListProductId",$scope.getWishListProductId);
          //objects heart to bind in UI
          $scope.heartList = {};
          for (var i = 0; i < $scope.getWishListProductId.length; i++) {
            $scope.heartList[i] = $scope.getWishListProductId[i];

          }
          console.log("$scope.heartList;",$scope.heartList);
          //objects product to bind in UI
          $scope.productList = {};
          for (var i = 0; i < $scope.getProductIdList.length; i++) {
            $scope.productList[i] = $scope.getProductIdList[i];

          }
          console.log("$scope.productList;",$scope.productList);

          //two level loops
          for (var i = 0; i < $scope.getWishListProductId.length; i++) {
            for (var i = 0; i < $scope.getProductIdList.length; i++) {
                if ($scope.getWishListProductId[i] = $scope.getProductIdList[i]) {
                  $scope.showHeart = $scope.getWishListProductId;
                }

            }

          }

          //heart list
          if ($scope.heartList = $scope.productList) {
            $scope.showHeart = true;
          } else {
            $scope.showHeart = false;
          }
        }).error(function(data){
          // ngToast.create({
          //   className: 'warning',
          //   content: 'Problem in getting data from wish list'
          // });
        });
      };

      //check the heart
      $scope.hideWishlist= true;
      $scope.isInWishlist = function(productId){
        for (var i = 0; i < $scope.getListOfFav.length; i++) {

            if ($scope.getListOfFav[i].product._id == productId) {
              $scope.hideWishlist= true;
              $scope.showFilledHeart = true;
              return true;
            } else {
              $scope.hideWishlist= true;
                $scope.showFilledHeart = false;

              // return false;
            }

        }
      }

      //POST create wish list
      // var count = 0;
      $scope.addWishList = function (productId) {
        $scope.loading = true;
        //$scope.productIdWishList = productId;
        if ($cookieStore.get('userId')) {
            for (var i = 0; i < $scope.getWishListProductId.length; i++) {

              if ($scope.getWishListProductId[i] == productId) {
                $scope.isProdSishList = true;
              } else {
                $scope.isProdSishList = false;

              }
            }


            if ($scope.isProdSishList == false || $scope.getWishlistData.length === 0) {
              console.log("added to cart");

              var count = 1;
              console.log("quantity count",count);

              //cookieStore
              $scope.getUserId = $cookieStore.get('userId');
              $scope.userToken = $cookieStore.get('token');
              $scope.sessionId = $cookieStore.get('sessionId');
              //check if already added to wish list


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
                                          // $scope.getcartItems();
                                          $scope.getWishList();


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
                                              // ngToast.create({
                                              //   className: 'warning',
                                              //   content: 'Problem in server'
                                              // });
                                            });

                        }
            } else {
                $('#loginmodal').modal('toggle');
            }
      };


          //checkout
          $scope.checkout = function() {
            if($cookieStore.get('userId')){
              if ($scope.allCartItems.length == 0) {
                // ngToast.create({
                //   className: 'warning',
                //   content: 'Please add item to cart to checkout',
                //   timeout:1000
                // });
              } else {
                window.location = "#/checkout";
              }
            } else {
              console.log("Please Login");
              // window.location = "#/landing";
              $('#loginmodal').modal('toggle');
            }
          }

          $scope.clearSpaces = function(string) {
            if(!angular.isString(string)) {
              return string;
            }
            return string.replace(/[\s]/g, '');
          }

          $scope.setActiveTab = function(categoryName){
              $scope.categoryNames = categoryName;
              var elm = '#'+$scope.clearSpaces(categoryName);
              var top = $(elm).offset().top - 104;
              console.log('top', top);
              $("html, body").animate({
                  scrollTop: top
              }, 600);
              $scope.searchPagelist = false;
              $scope.particularProduct = false;
              $scope.show_wishlist  = false;
              $scope.showMenuResult  = true;
              $scope.showdiv = false;
              // $scope.activeTab = tabToSet;
              // $scope.categoryNames = categoryName;
              // console.log("clicked",tabToSet);
          }

          //get list of categories
          $scope.getCategoriesList = function(){
            // angular.forEach($scope.allProducts, function(key, value) {
            //
            // });
            /*Auth.getCategories().success (function (data) {
              $scope.getCategoryList = data;
              // $scope.categoryNames = "Recommended";
              $scope.showMenuResult  = true;
            }).error(function(data){
              ngToast.create({
                className: 'warning',
                content: 'check category api'
              });
            });*/
          }




        //delete wish list
        $scope.deleteWishList =  function(productId){
          console.log("delete view id ",productId);
          for (var i = 0; i < $scope.getWishlistData.length; i++) {
            if ($scope.getWishlistData[i].product._id == productId) {
              $scope.wishListId = $scope.getWishlistData[i]._id;
            }
          }
          console.log("$scope.wishListId",$scope.wishListId);
          $scope.getUserId = $cookieStore.get('userId');
          console.log($scope.getUserId );
          Auth.deleteWishList($scope.wishListId,{UserID:$scope.getUserId,product:productId, isDeleted: "true"}).success(function(data) {
            $scope.deltedWishList = data;
            $scope.getWishList();
            console.log("done delted");
            $scope.hideWishlist= true;
            $scope.showFilledHeart = false
            // $scope.getCategoriesList();
            $scope.showMenuResult  = true;
          }).error(function(data) {
            // ngToast.create({
            //   className: 'warning',
            //   content: 'Check Product list API '
            // });
          });
        }
        //Fb sharer
        $scope.FbShare = function(name,id){

            FB.ui({
              method: 'share',
              display: 'popup',
              href: 'http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com/krazy-meals/#/search-page?show_productDetails='+name+'&product_id='+id,
            }, function(response){});

          }
        $scope.twitterShare = function(ids){
          var twitterHandle = 'Krazy Meals';
            //window.open("https://twitter.com/share?url="+encodeURIComponent(url));
            window.open('https://twitter.com/share?url='+escape('http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com/krazy-meals/#/search-page?show_productDetails='+ids)+'&text='+document.title + ' via @' + twitterHandle, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
          }

          //show mimage modal
          $scope.showImage = function(prodId){
            console.log("prodId",prodId);

            for (var i = 0; i < $scope.allProducts.length; i++) {
              if ($scope.allProducts[i]._id === prodId) {
                $scope.ImageGallery = $scope.allProducts[i];
              }
            }
            // $scope.imageGallery2 = image2;
            // $scope.imageGallery3 = image3;
			       $('#imagemodal').modal('show');
          }
          //image caroscel
          $("#nextImage").click(function(event){
              event.preventDefault();
          });
          $("#prevImage").click(function(event){
              event.preventDefault();
          });
    $scope.init();
});

app.filter('trimSpaces', [function() {
  return function(string) {
    if(!angular.isString(string)) {
      return string;
    }
    return string.replace(/[\s]/g, '');
  };
}]);

'use strict';
app.factory('Auth', function($http, $window, $cookieStore) {
  //var BASE_URL = "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://ec2-54-187-15-116.us-west-2.compute.amazonaws.com:9000";
  var BASE_URL = "http://ec2-35-164-239-44.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://localhost:9000";
  //var BASE_URL = "http://192.168.0.84:9000";
    var authToken = $cookieStore.get('token');
    console.log("authToken",authToken);
    var userId = $cookieStore.get('userId');
    console.log("serv",authToken);
    //var authToken = localStorage.getItem("authToken");
    //$http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

  return {
    register : function(inputs) {
      return $http.post(BASE_URL + '/api/users', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },

    login : function (inputs) {
      return $http.post(BASE_URL + '/auth/local', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    userProfile : function () {
      return $http.get(BASE_URL + '/api/users/me',{
        headers: {
          'Authorization': 'Bearer '+authToken,
          'Content-Type': 'application/json'

        }
      });
      // $http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    },

    forgotpassword : function (inputs) {
      return $http.post(BASE_URL + '/api/users/forgotpassword', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    changePassword : function (inputs,PwdauthToken) {
      return $http.post(BASE_URL + '/api/users/'+userId+'/password',inputs,{
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+PwdauthToken,
        }
      });
    },

    socailLogin : function (inputs) {
      return $http.post(BASE_URL + '/auth/local?from=app',inputs,{
        header: {
          'Content-Type': 'application/json'
        }
      });
    },

    products : function(inputs) {
      return $http.get(BASE_URL + '/api/products', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addCart : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getCartList : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart/getCartItems', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    deleteCart : function(inputs,id) {
      return $http.post(BASE_URL + '/api/shoppingCart/updateCart/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    updateCart : function(inputs,id) {
      return $http.post(BASE_URL + '/api/shoppingCart/updateCart/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addWishList : function(inputs) {
      return $http.post(BASE_URL + '/api/wishLists', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getWishList : function(inputs) {
      return $http.post(BASE_URL + '/api/wishLists/getListItems', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addAddress : function(inputs) {
      return $http.post(BASE_URL + '/api/address', inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getAddressByUserId : function() {
      return $http.get(BASE_URL + '/api/address/getaddressByUserId/'+userId, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    autocompleteSearchItem : function(id,inputs) {
      return $http.get(BASE_URL + '/api/autocompleteSearchs/autoComplete/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    searchItem : function(id,inputs) {
      return $http.get(BASE_URL + '/api/products/searchProducts/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getCategories : function(inputs) {
      return $http.get(BASE_URL + '/api/categories', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getOrdersByUserId : function(inputs) {
      return $http.get(BASE_URL + '/api/orders/getOrdersByUser/'+userId, inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    deleteAddress : function(addressId) {
      return $http.delete(BASE_URL + '/api/address/'+addressId , {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    editAddress : function(addressId, addressDetails) {
      return $http.put(BASE_URL + '/api/address/'+addressId ,addressDetails, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    makeCOD : function(inputs) {
      return $http.post(BASE_URL + '/api/checkout/makePayment' ,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    todaysDeal : function(inputs) {
      return $http.get(BASE_URL + '/api/todaysDeal' ,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    imageUpload : function(formdata) {
      return $http.post(BASE_URL + '/api/users/image/upload', formdata, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': undefined
        }
      });
    },
    profileImageUpload : function(inputs) {
      return $http.put(BASE_URL + '/api/users/'+userId,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    feedBack : function(inputs) {
      return $http.post(BASE_URL + '/api/order/feedback',inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getLocationDeliver : function(inputs) {
      return $http.get(BASE_URL + '/api/deliver/Location',inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getMinimumOrder : function() {
      return $http.get(BASE_URL + '/api/admin/config', {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    deleteWishList : function(wishListId,inputs) {
      return $http.post(BASE_URL + '/api/wishLists/updateList/'+wishListId, inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    emptyCart : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart/emptyCart', inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getBanners : function() {
      return $http.get(BASE_URL + '/api/banner', {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },


  };
});