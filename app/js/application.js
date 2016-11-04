/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    	.when('/product-description', {
            controller: '',
            templateUrl: './partials/_product-description.html'
    	})

    	.otherwise({ redirectTo: '/product-description' });
}]);
