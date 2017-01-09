'use strict';
app.factory('Auth', function($http, $window) {
  var BASE_URL = "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://192.168.0.84:9000";

  return {
    register : function(inputs) {
      return $http.post(BASE_URL + '/api/users', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },

    login : function (inputs) {
      return $http.post(BASE_URL + '/auth/local', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    forgotpassword : function (inputs) {
      return $http.post(BASE_URL + '/api/users/forgotpassword', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    products : function(inputs) {
      return $http.get(BASE_URL + '/api/products', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addCart : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getCartList : function(inputs) {
      return $http.post(BASE_URL + '/api/shoppingCart/getCartItems', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    deleteCart : function(inputs,id) {
      return $http.post(BASE_URL + '/api/shoppingCart/updateCart/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    updateCart : function(inputs,id) {
      return $http.post(BASE_URL + '/api/shoppingCart/updateCart/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addWishList : function(inputs) {
      return $http.post(BASE_URL + '/api/wishLists', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getWishList : function(inputs) {
      return $http.post(BASE_URL + '/api/wishLists/getListItems', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    addAddress : function(inputs) {
      return $http.post(BASE_URL + '/api/address', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getAddressByUserId : function(id,inputs) {
      return $http.get(BASE_URL + '/api/address/getaddressByUserId/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    autocompleteSearchItem : function(id,inputs) {
      return $http.get(BASE_URL + '/api/autocompleteSearchs/autoComplete/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    searchItem : function(id,inputs) {
      return $http.get(BASE_URL + '/api/products/searchProducts/'+id, inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },


  };
});
