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
      $scope.showSearchPage = function(){
        $location.path('/search-page');
        window.location.reload = true;
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
