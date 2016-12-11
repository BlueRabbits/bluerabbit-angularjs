app.controller('mainController', function($scope, $location, $rootScope, $window, $http, Auth, $routeParams, $timeout){
  'use strict';
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

  var elementPosition = $('#scroll-menu-fixed').offset();

  $(window).scroll(function(){
    if($(window).scrollTop() > elementPosition.top){
          $('#scroll-menu-fixed').css('position','fixed').css({"top":"0","right":"0","left":"0"});
    } else {
        $('#scroll-menu-fixed').css('position','static');
    }
  });
  var elementPosition = $('#scroll-menu-fixed1').offset();

  $(window).scroll(function(){
    if($(window).scrollTop() > elementPosition.top){
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
    }).error(function(data) {
      console.log('data', data);
        alert ("no Products")
    });
  }
  $scope.product();

  //POST create add to cart
  //POST create add to cart
  var count = 0;
  $scope.addToCart = function (productId) {
    count++;
    console.log("quantity count",count);
    $scope.getUserId = localStorage.getItem('userId');
    $scope.userToken = localStorage.getItem('token');
    $scope.sessionId = "aa565asdasdy87sadasd987";
    $scope.cartlist =[];
    var productInfo = {
      product:productId,
      quantity: count,
      UserID:$scope.getUserId,
      sessionID:$scope.sessionId,
      authToken: $scope.userToken,
      isDeleted: false
    }
    Auth.addCart(productInfo)
    .success(function(data){
      //console.log('data', data);
      alert('Added to cart');
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
          alert('Not Added to cart');
        });
      };
})
