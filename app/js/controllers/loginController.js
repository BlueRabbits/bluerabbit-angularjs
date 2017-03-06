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
         $cookieStore.put("emailId", $scope.email);
         $cookieStore.put("userName", data.name);
         $cookieStore.put('loggedIn', true);
         $scope.getEmailId = $cookieStore.get('email');
         $scope.userId = $cookieStore.get('userId');
         console.log("user id ",$scope.userId);
         $('.modal').css("display", "none");
         $('.modal-open').removeClass();
          //$location.path('/landing');
          // location.reload(true);
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
      $scope.userDetails = data;
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
      // var authToken = 'Bearer '+$cookieStore.get('token');
      // console.log("authToken chang pwd",authToken);
    var passwordToChange = {
      "oldPassword": $scope.oldPassword,
      "newPassword": $scope.newPassword
    }
    Auth.changePassword(passwordToChange).success(function(data) {
      console.log('user profile', data.name);
      $scope.userName = data.name;
      $scope.userEmail = data.email;
      ngToast.create({
        className: 'success',
        content: 'Passowrd changed successfully'
      });
      $scope.editPassword = false;
    }).error(function(data) {
      console.log('data', data);
    });
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


             });

         }, function (err) {
             console.log(err);
         });
         var socailParams = {
           "email": $scope.emailId,
           "name": $scope.userName
         }
         Auth.socailLogin(socailParams).success(function(data) {
           console.log('social Resp', data);
           $cookieStore.put("token", data.token);
           $cookieStore.put("userId", data._id);
           $cookieStore.put("emailId", $scope.emailId);
           $cookieStore.put('userName', $scope.userName);

           $('.modal').css("display", "none");
           $('.modal-open').removeClass();
           $scope.closeModal();
           //location.reload();
         }).error(function(data) {
           console.log('data', data);
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
      console.log("Facebook", response);
      $scope.getLoginStatus();
    });
  };
  $scope.login();
  $scope.getLoginStatus = function() {
    Facebook.getLoginStatus(function(response) {
      console.log(response);

      if (response.status === 'connected') {
        $scope.me();
        $scope.loggedIn = true;
      } else {
        $scope.loggedIn = false;
      }
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
  location.reload();
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
    $scope.orderHistory = data;
    for (var i = 0; i < $scope.orderHistory.length; i++) {
      console.log($scope.orderHistory[i].itmes);
      $scope.orderDetailsProduct = $scope.orderHistory[i].itmes;
      $scope.ordersProductName = $scope.orderHistory[i].itmes[i];
      console.log("name",$scope.ordersProductName);
    }


    console.log('user orders', $scope.orderHistory);
  }).error(function(data) {
    console.log('data', data);
  });
};

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
    ngToast.create({
      className: 'success',
      content: data.message
    });
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
    ngToast.create({
      className: 'success',
      content: "Successfully Updated the address"
    });
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


      $scope.ProfileUpdate = function() {
        var profileDetails = {
          "name": $scope.userName,
          "image_url": $scope.profileImage
        }
        Auth.profileImageUpload(profileDetails)
          .success(function(data) {

            console.log('profile updated data', data);
            $scope.emailId = data.email;
            $scope.userName = data.name;
            ngToast.create({
              className: 'success',
              content: "Successfully Updated the address"
            });
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

            console.log('profile updated data', data);

            ngToast.create({
              className: 'success',
              content: "Feedback sent Successfully"
            });
          }).error(function(data) {
            console.log(data);
            ngToast.create({
              className: 'warning',
              content: data.message
            });
          });

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
