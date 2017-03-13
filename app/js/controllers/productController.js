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
        $scope.searchPagelist = false;
        $scope.show_wishlist  = true;
        $scope.showMenuResult  = false;
        $scope.getWishList();
      }

      //get all products in landing page
      $scope.product = function() {
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
          $scope.showMenuResult  = true;
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
        //$scope.productIdWishList = productId;
        if ($cookieStore.get('userId')) {
            for (var i = 0; i < $scope.getWishListProductId.length; i++) {

              if ($scope.getWishListProductId[i] == productId) {
                $scope.isProdSishList = true;
              } else {
                $scope.isProdSishList = false;

              }
            }


            if ($scope.isProdSishList == false || $scope.getWishlistData.lenght === 0) {
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


        //invoke wishList on routeParams
        if($routeParams.show_wishlist === true){
          $scope.wishListShow();
        }

        //NOTE: get product name from  url
        if($routeParams.show_productDetails){
          $scope.searchList($routeParams.show_productDetails);
          $scope.showdiv = true;
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
        $scope.FbShare = function(){
          FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
              object:'https://developers.facebook.com/docs/',
            })
            }, function(response){});
          }
        $scope.twitterShare = function(){
          var twitterHandle = 'Krazy Meals';
            //window.open("https://twitter.com/share?url="+encodeURIComponent(url));
            window.open('https://twitter.com/share?url='+escape(window.location.href)+'&text='+document.title + ' via @' + twitterHandle, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
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
