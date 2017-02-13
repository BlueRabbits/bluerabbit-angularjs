/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute','ngResource','ngCookies','ngToast','ngAnimate','ui.bootstrap','googleplus','facebook']);

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
           apiKey: '9eXPEtNFE2zqIvXB8p5-LJ_2'
         });
         FacebookProvider.init({
             appId:'1272767759478704'
        });
    }]);

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
      ngToast.create({
        className: 'warning',
        content: 'Problem in get cart api'
      });
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
      ngToast.create({
        className: 'success',
        content: 'Item Deleted from Cart'
      });
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          ngToast.create({
            className: 'warning',
            content: 'Problem in deleting from Cart'
          });
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
          //$scope.addressId = data[0]._id;
          console.log("$scope.addressId",$scope.addressId);
          }).error(function(data){
            console.log(data);
          });
    }


    //selectedAddress
    $scope.selectedAddress = function(id,addresstype){
      $scope.showAddressType = false;
      $scope.addNewAddressRadio = false;
      $scope.addrestTypeRadio = true;
      $scope.addressIdSelected = id;
      console.log("id",id);
      console.log("addresstype",addresstype);
      $scope.addressTypeChosen = addresstype;
      for (var i = 0; i < $scope.getAddressByUserId.length; i++) {
        if(id == $scope.getAddressByUserId[i]._id){
          console.log("$scope.getAddressByUserId[i]._id",$scope.getAddressByUserId[i]._id);
          $scope.name = $scope.getAddressByUserId[i].name;
          $scope.landlineNumber = $scope.getAddressByUserId[i].landLineNumber;
          $scope.mobileNumber = $scope.getAddressByUserId[i].mobileNumber;
          $scope.companyName = $scope.getAddressByUserId[i].companyName;
          $scope.street1 = $scope.getAddressByUserId[i].street1;
          $scope.city = $scope.getAddressByUserId[i].city;
          $scope.pincode = $scope.getAddressByUserId[i].pinCode;
          $scope.state = $scope.getAddressByUserId[i].state;
          $scope.country = $scope.getAddressByUserId[i].state;
        }

      }
    }

  //post address
  $scope.addressType = [];
  $scope.addAddress = function () {
    // $scope.myAddressType = [];

  console.log("addressTypeHome array",$scope.addressType);
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
      //$scope.getAddressByUserId ();
      ngToast.create({
        className: 'success',
        content: 'New Address Added'
      });
      //$scope.getAddressByUserId ();
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);
        }).error(function(data){
          ngToast.create({
            className: 'warning',
            content: 'Problem in adding address'
          });
        });
      };

      $scope.addrestTypeRadio = false;
      $scope.addNewAddressRadio = false;
      //clearAddress to add new address
      $scope.clearAddress = function(){
        $scope.showAddressType = true;
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

      $scope.init();
});

app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, GooglePlus, Facebook, ngToast){
  'use strict';

  $('.modal').on('hidden.bs.modal', function (e) {
    $(this).find("input").val('').end();
    $scope.errorMessage =  "";
  })

  if ($cookieStore.get('userId')) {
    $scope.show_myaccnt = true;
    $scope.not__logged = false;
    $scope.getEmailId = $cookieStore.get('email');
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
         $scope.getEmailId = $cookieStore.get('email');
         $cookieStore.put('loggedIn', true);
         $location.path('/landing');
        // $scope.getUserProfile();
         //location.reload(true);
        //location.reload(true);
        ngToast.create({
          className: 'success',
          content: 'Account created successfully'
        });
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
         localStorage.setItem("authToken", data.token);
         $cookieStore.put("userId", data._id);
         $cookieStore.put("email", $scope.email);
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

    location.reload();
    $location.path('/landing');
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
    $scope.userProfileShow =  true;
      Auth.userProfile().success(function(data) {
      console.log('user profile',data.name);
      $cookieStore.put('userName', data.name);
      $cookieStore.put('userEmailId', data.email);
      $scope.userId = $cookieStore.get('userId');
      $scope.userName = $cookieStore.get('userName');
      $scope.userEmail = $cookieStore.get('userEmailId');
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
      var authToken = 'Bearer '+$cookieStore.get('token');
    var passwordToChange = {
      "oldPassword": $scope.oldPassword,
      "newPassword": $scope.newPassword
    }
    Auth.changePassword(authToken,passwordToChange).success(function(data) {
      console.log('user profile', data.name);
      $scope.userName = data.name;
      $scope.userEmail = data.email;
    }).error(function(data) {
      console.log('data', data);
    });
  }

  //NOTE : GooglePlus login
  $scope.googlePlusLogin = function () {
         GooglePlus.login().then(function (authResult) {
             console.log("authResult",authResult);

             GooglePlus.getUser().then(function (user) {
                 console.log("user",user);
             });
         }, function (err) {
             console.log(err);
         });
       };

  //NOTE : Facebook login
    /**
 * Login
 */
 // $scope.IntentLogin = function() {
 //    if(!userIsConnected) {
 //      $scope.login();
 //    }
 //  };

 $scope.loginFB = function() {
   Facebook.login(function(response) {
    if (response.status == 'connected') {
      $scope.logged = true;
      $scope.me();
    }

  });
 };

 /**
  * me
  */
  $scope.me = function() {
    Facebook.api('/me', function(response) {
      /**
       * Using $scope.$apply since this happens outside angular framework.
       */
      $scope.$apply(function() {
        $scope.user = response;
        console.log("$scope.user",$scope.user);
      });

    });
  };

/**
 * Logout
 */
$scope.FBlogout = function() {
  Facebook.logout(function() {
    $scope.$apply(function() {
      $scope.user   = {};
      $scope.logged = false;
    });
  });
}

})

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
    window.scrollTo($anchor.left,$anchor.top);
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
    $last.remove().css({ 'margin-left': '-400px' });
    $('#testimonial-list .slide-list:first').before($last);
    $last.animate({ 'margin-left': '0px' }, 1000);
});

$('#nxt-testimonial').on('click', function(){
    var $first = $('#testimonial-list .slide-list:first');
    $first.animate({ 'margin-left': '-400px' }, 1000, function() {
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

  var elementPosition = $('#scroll-menu-fixed').offset().top;

  $(window).scroll(function(){
    if($(window).scrollTop() > elementPosition){
          $('#scroll-menu-fixed').css('position','fixed').css({"top":"0","right":"0","left":"0"});
    } else {
        $('#scroll-menu-fixed').css('position','static');
    }
  });
  var elementPosition = $('#scroll-menu-fixed1').offset().top;

  $(window).scroll(function(){
    if($(window).scrollTop() > elementPosition){
          $('#scroll-menu-fixed1').css('position','fixed').css({"top":"97px","right":"0","left":"0"});
    } else {
        $('#scroll-menu-fixed1').css('position','static');
    }
  });

  //get all products in landing page
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

    Auth.getCategories().success (function (data) {
      console.log('get cat data', data);
      $scope.getCategoryList = data;
    }).error(function(data){
      console.log('data', data);
         console.log("no categories");
    });
  }
  $scope.activeTab = 0;
  $scope.categoryNames = "Add-ons";
  $scope.setActiveTab = function(tabToSet, categoryName){
      $scope.activeTab = tabToSet;
      $scope.categoryNames = categoryName;
      console.log("clicked",tabToSet);
  }

  //POST create add to cart
  var count = 0;
  $scope.addToCart = function(productId) {
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
          ngToast.create({
            className: 'success',
            content: 'Item Added to Cart'
          });

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
          ngToast.create({
            className: 'warning',
            content: 'Problem in Adding to Cart'
          });
        });
    }
  };

  //getCart items
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
      ngToast.create({
        className: 'warning',
        content: 'Problem in Get Cart API'
      });
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
      ngToast.create({
        className: 'success',
        content: 'Quantity Increased in cart'
      });
      $scope.getcartItems();
        }).error(function(data){
          ngToast.create({
            className: 'warning',
            content: 'Problem in incrementing cart'
          });
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





})

app.controller('productController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, ngToast){
  'use strict';

  $('#next').on('click',function(e){
    e.preventDefault();
    $('.search-page__tab-list').animate({'margin-left':'-190px'},2000,function(){
        $('#next').addClass('hidden');
        $('#prev').removeClass('hidden');
    });
});
$('#prev').on('click',function(e){
    e.preventDefault();
    $('.search-page__tab-list').animate({'margin-left':'0px'},1500,function(){
        $('#prev').addClass('hidden');
        $('#next').removeClass('hidden');
    });
});

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

  // var elementPosition = $('#sub-menu').offset().top;
  //
  // $(window).scroll(function(){
  //   if($(window).scrollTop() > elementPosition){
  //         $('#sub-menu').css('position','fixed').css({"top":"0","right":"30%","left":"0"});
  //   } else {
  //       $('#sub-menu').css('position','static');
  //   }
  // });
  // var elementPosition1 = $('#scroll-menu-fixed1').offset();
  //
  // $(window).scroll(function(){
  //   if($(window).scrollTop() > elementPosition1){
  //         $('#scroll-menu-fixed1').css('position','fixed').css({"top":"97px","right":"0","left":"0"});
  //   } else {
  //       $('#scroll-menu-fixed1').css('position','static');
  //   }
  // });
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
      ngToast.create({
        className: 'warning',
        content: 'Problem in Get Cart API'
      });
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
          ngToast.create({
            className: 'warning',
            content: 'Problem in incrementing cart'
          });
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
          ngToast.create({
            className: 'warning',
            content: 'Problem in decrement cart'
          });
        });
  }

  //search -autoComplete
  $scope.autocompleteSearch = function (searchNames) {
    Auth.autocompleteSearchItem (searchNames).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.show_wishlist  = false;
      $scope.showMenuResult  = false;
      $scope.hideAutocomplete = true;
      console.log('autcomplete data', data);
      $scope.searchAutocompleteId = data;
    }).error(function(data){
      console.log("autocomplete search",data);
    });
  };

  //search
  $scope.searchList = function (searchName) {
    Auth.searchItem (searchName).success ( function (data) {
      $scope.searchPagelist = true;
      $scope.show_wishlist  = false;
      $scope.showMenuResult  = false;
      $scope.hideAutocomplete = false;
      console.log('search data', data);
      $scope.search_result = data;

    }).error(function(data){
      console.log("problem in search term API",data);
    });
  };

  //POST create add to cart
  var count = 0;
  $scope.addToCart = function(productId) {
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
          ngToast.create({
            className: 'success',
            content: 'Item Added to Cart'
          });

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
          ngToast.create({
            className: 'warning',
            content: 'Problem in Adding to Cart'
          });
        });
    }
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
      ngToast.create({
        className: 'success',
        content: 'Item Deleted from Cart'
      });
      // $scope.quantity = data.quantity;
      // $scope.user_id = data.UserID;
      // console.log('id',$scope.user_id);

        }).error(function(data){
          ngToast.create({
            className: 'warning',
            content: 'Problem in deleting from Cart'
          });
        });
      };

      $scope.wishListShow = function () {
        $scope.searchPagelist = false;
        $scope.show_wishlist  = true;
        $scope.showMenuResult  = false;
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
          ngToast.create({
            className: 'success',
            content: 'Item Added to WishList'
          });
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
              ngToast.create({
                className: 'warning',
                content: 'Problem in deleting from wishList'
              });
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
              ngToast.create({
                className: 'warning',
                content: 'Problem in getting data from wish list'
              });
            });
          };

          //checkout
          $scope.checkout = function() {
            if($cookieStore.get('userId')){
              if ($scope.allCartItems.length == 0) {
                ngToast.create({
                  className: 'warning',
                  content: 'Please add item to cart to checkout'
                });
              } else {
                window.location = "#/checkout";
              }
            } else {
              console.log("Please Login");
              // window.location = "#/landing";
              $('#loginmodal').modal('toggle');
            }
          }

          //get list of categories
          $scope.getCategoriesList = function(){

            Auth.getCategories().success (function (data) {
              console.log('get cat data', data);
              $scope.getCategoryList = data;
            }).error(function(data){
              console.log('data', data);
              ngToast.create({
                className: 'warning',
                content: 'check category api'
              });
            });
          }

          $scope.setActiveTab = function(tabToSet, categoryName){
              $scope.activeTab = tabToSet;
              $scope.categoryNames = categoryName;
              console.log("clicked",tabToSet);
              $scope.searchPagelist = false;
              $scope.show_wishlist  = false;
              $scope.showMenuResult  = true;
              $scope.product();
          }

          //get all products in landing page
          $scope.product = function() {
            $scope.productslist = [];
            Auth.products().success(function(data) {
            console.log('data',data);
            $scope.allProducts = data;

               $scope.getCategoriesList ();
            }).error(function(data) {
              console.log('data', data);
              ngToast.create({
                className: 'warning',
                content: 'Check Product list API '
              });
            });
          }



})

'use strict';
app.factory('Auth', function($http, $window, $cookieStore) {
//  var BASE_URL = "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000";
  var BASE_URL = "http://ec2-54-187-15-116.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://localhost:9000";
  //var BASE_URL = "http://192.168.0.84:9000";
    var authToken = 'Bearer '+$cookieStore.get('token');
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
          'Authorization': authToken,
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

    changePassword : function (inputs) {
      return $http.post(BASE_URL + '/api/users/password', inputs,{
        header: {
          'sender': 'web',
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
        'Content-Type': 'application/json'
        }
      });
    },
    getAddressByUserId : function(id,inputs) {
      return $http.get(BASE_URL + '/api/address/getaddressByUserId/'+id, inputs, {
      headers: {
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


  };
});
