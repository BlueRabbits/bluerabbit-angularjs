app.controller('loginController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout, $cookies, $cookieStore, GooglePlus, Facebook){
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
         $cookieStore.put('loggedIn', true);
         $location.path('/landing');
         location.reload(true);
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
    $scope.getUserId = $cookieStore.get('userId');
      Auth.userProfile({_id:$scope.getUserId }).success(function(data) {
      console.log('user profile',data.name);
      $scope.userName = data.name;
      $scope.userEmail = data.email;
    }).error(function(data) {
      console.log('data', data);
    });
  }

  //reset or change password
  $scope.showChangePassword = function(){
    $scope.userChangePassword =  true;
  }
  var authToken = 'Bearer '+$cookieStore.get('token');
  // var token ={
  //   "token" : authToken
  // }
  $scope.changePassword = function() {
    var passwordToChange = {
      "oldPassword": $scope.oldPassword,
      "newPassword": $scope.newPassword
    }
    Auth.changePassword(passwordToChange,authToken).success(function(data) {
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
$scope.logout = function() {
  Facebook.logout(function() {
    $scope.$apply(function() {
      $scope.user   = {};
      $scope.logged = false;
    });
  });
}

})
