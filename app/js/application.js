/*================================================================
App bluerabbit
==================================================================*/
'use strict';

var app = angular.module('bluerabbit', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    	.when('', {
            controller: '',
            templateUrl: ''
    	})

    	.otherwise({ redirectTo: '/' });
}]);
