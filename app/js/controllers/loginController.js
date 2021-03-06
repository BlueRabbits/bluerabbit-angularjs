app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, GooglePlus, Facebook, ngToast, URL){
  'use strict';
  $scope.hideAddress = true;
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

  if ($cookieStore.get('loggedIn') === false) {
    $cookieStore.remove("token");
    $cookieStore.remove("userId");
    $cookieStore.remove("email");
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
      $scope.mobile_number = data.mobile_number;
      if ($scope.mobile_number) {
        $scope.isDataAvailable = true;
      }
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

      var BASE_URL = "http://34.206.42.77:9000";
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
                 if (data) {


                   Auth.socailLogin(socailParams).success(function(data) {
                     console.log('social Resp', data);
                     $cookieStore.put("token", data.token);
                     $cookieStore.put("userId", data._id);
                     $cookieStore.put("emailId", $scope.emailId);
                     $cookieStore.put('userName', data.name);
                      $cookieStore.put('loggedIn', true);

                     $('.modal').css("display", "none");
                     $('.modal-open').removeClass();
                     $scope.closeModal();
                     $scope.loginModal();
                     location.reload();
                   }).error(function(data) {
                     console.log('data', data);
                   });
                }
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
      // $('.modal').css("display", "none");
      // $('.modal-open').removeClass();
      // $scope.closeModal();

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
      if (!response.error) {


        Auth.socailLogin(socailParams).success(function(data) {
          console.log('social Resp', data);
          $cookieStore.put("token", data.token);
          $cookieStore.put("userId", data._id);
          $cookieStore.put('userName', data.name);
           $cookieStore.put('loggedIn', true);
          $('.modal').css("display", "none");
          $('.modal-open').removeClass();
          $scope.closeModal();
          $scope.loginModal();
          location.reload(true);
        }).error(function(data) {
          console.log('data', data);
        });
      }
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
  var result = confirm("Are you sure that you want to delete this Address?");
  if (result) {
    //Logic to delete the item
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
  // companyName: $scope.companyName,
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
        //load modal for crop
        // $('#imageCropModal').modal('show');
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
      //crop image
      $scope.cropImages = function(){
          $('#imageCropModal').modal('show');
      }
      $scope.myImage = '';
      $scope.myCroppedImage = '';

      var handleFileSelect = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
          $scope.$apply(function($scope) {
            $scope.myImage = evt.target.result;
          //  console.log("evt.target.result",evt.target.result);
          });
        };
          $scope.userProfileShow = false;
        $scope.fileToForm = file;
        reader.readAsDataURL(file);
        console.log("file)", $scope.fileToForm);

      };
      angular.element(document.querySelector('#file1')).on('change', handleFileSelect);
      //selct crop and preview
      // $scope.showCropImage = false;
      $scope.selectedCropImage = function(cropImg){
        $scope.showCropImage = true;
        $scope.croppedImage = cropImg;
        $scope.hideAvatar = false;
        $scope.userProfileShow = false;
        //console.log("$scope.croppedImage",$scope.croppedImage);
  $('#imageCropModal').modal('hide');
        var base64_string = cropImg;
        // $(function () {
        //     var $img = $("<img/>");
        //     $img.attr("src", "data:image/png;base64," + base64_string);
        //      $("#img_preview").append($img);
        //     console.log("$img",$img);
        // });
        // $scope.imagePreviewOfCrop = 'data:image/png;base64,' + cropImg;
        // console.log("  $scope.imagePreviewOfCrop ",  $scope.imagePreviewOfCrop );
        //api call
        // var formdata = new FormData();
        // formdata.append('file', formdata);
        // console.log("formdata new",formdata);
        // Auth.imageUpload(formdata)
        //   .success(function(data) {
        //     console.log('profile formdata', data);
        //     $scope.profileImage = data.url;
        //     $scope.isDataAvailable = true;
        //     $('#imageCropModal').modal('hide');
        //   }).error(function(data) {
        //     console.log(data);
        //   });
      }

  //image profile
      $scope.hideAvatar = true;
      $scope.ProfileUpdate = function() {
        $scope.hideAvatar = false;
        var profileDetails = {
          "name": $scope.userName,
          "image_url": $scope.profileImage,
          "mobile_number":$scope.mobile_number
        }
        Auth.profileImageUpload(profileDetails)
          .success(function(data) {
            $scope.getUserProfile();
            $scope.showAvatar = false;
            console.log('profile updated data', data);
            $scope.emailId = data.email;
            $scope.userName = data.name;
            $scope.editImage=false;
            $scope.showCropImage = true;
            $scope.userProfileShow = false;
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

            ngToast.create({
              className: 'success',
              content: "Feedback Sent Successfully",
              maxNumber:1,
               timeout:1000,
               dismissOnTimeout:	true
            });
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

          //cancel Order
          $scope.cancelOrderByUser = function(orderId) {
              var PwdauthToken = $cookieStore.get('token');
              $scope.userId = $cookieStore.get('userId');
            var orderDetails = {
              "orderId": orderId
            }

              var BASE_URL = "http://34.206.42.77:9000";
                var config = {
                    headers : {
                        'Authorization': 'Bearer '+PwdauthToken,
                        'Content-Type': 'application/json'
                    }
                }

                $http.put(BASE_URL +  '/api/orders/cancelOrdersByUser/'+$scope.userId, orderDetails, config)
                .success(function (data, status, headers, config) {
                    console.log('order Cancelled', data);
                    $scope.getOrdersByUserId();

                })
                .error(function (data, status, header, config) {
                    $scope.ResponseDetails = "Data: " + data +
                        "<hr />status: " + status +
                        "<hr />headers: " + header +
                        "<hr />config: " + config;
                });
              $scope.editPassword = false;

          }

          //onlcik cart icon
          $scope.ourMenu = function(){
            $location.path('/search-page').search({
              showMenuResult: true,
              category: "Recommended",
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
