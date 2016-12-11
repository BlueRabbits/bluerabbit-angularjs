/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute']);

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
    	.when('/cart-description', {
            controller: 'checkoutCtrl',
            templateUrl: './partials/cart-page.html'
    	})
    	.when('/search-page', {
            controller: 'productController',
            templateUrl: './partials/_page-search.html'
    	})
    	.when('/login', {
            controller: 'loginController',
            templateUrl: './partials/login.html'
    	})
    	.when('/signup', {
            controller: 'loginController',
            templateUrl: './partials/signup.html'
    	})
    	.when('/products', {
            controller: '',
            templateUrl: './partials/_products-page.html'
    	})

    	.otherwise({ redirectTo: '/landing' });


}]);
