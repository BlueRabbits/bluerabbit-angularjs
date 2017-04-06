/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute','ngResource','ngCookies','ngToast','ngAnimate','ui.bootstrap','googleplus','facebook', 'angular.filter', 'slickCarousel', 'ngImgCrop']);

app.constant('URL', {
  //BASE_URL: "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000"
  BASE_URL: "http://34.206.42.77:9000"
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
