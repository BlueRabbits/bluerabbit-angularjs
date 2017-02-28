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
    moveScroller();
  });


  //scrooling page,showing header fixed

  // var $fixedElm = $('#sub-menu'),
  //     fixedElmTop = $fixedElm.offset().top
  //
  // $(window).scroll(function(){
  //   // console.log('working');
  //   if($(window).scrollTop() > fixedElmTop){
  //     $fixedElm.css('position','absolute');
  //   } else {
  //     $fixedElm.css('position','static');
  //   }
  // });

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
        //invoke wishList on routeParams
        if($routeParams.show_wishlist === true){
          $scope.wishListShow();
        }

        //NOTE: get product name from  url
        if($routeParams.show_productDetails){
          $scope.searchList($routeParams.show_productDetails);
          $scope.showdiv = true;
        }


})
