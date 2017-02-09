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
