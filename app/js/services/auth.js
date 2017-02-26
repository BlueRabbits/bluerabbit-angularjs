'use strict';
app.factory('Auth', function($http, $window, $cookieStore) {
  var BASE_URL = "http://ec2-35-164-152-22.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://ec2-54-187-15-116.us-west-2.compute.amazonaws.com:9000";
  //var BASE_URL = "http://localhost:9000";
  //var BASE_URL = "http://192.168.0.84:9000";
    var authToken = $cookieStore.get('token');
    var userId = $cookieStore.get('userId');
    console.log("serv",authToken);
    //var authToken = localStorage.getItem("authToken");
    //$http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;

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

    userProfile : function () {
      return $http.get(BASE_URL + '/api/users/me',{
        headers: {
          'Authorization': 'Bearer '+authToken,
          'Content-Type': 'application/json'

        }
      });
      // $http.defaults.headers.common['Authorization'] = 'Bearer ' + authToken;
    },

    forgotpassword : function (inputs) {
      return $http.post(BASE_URL + '/api/users/forgotpassword', inputs,{
        header: {
          'sender': 'web',
          'Content-Type': 'application/json'
        }
      });
    },

    changePassword : function (inputs) {
      return $http.post(BASE_URL + '/api/users/'+userId+'/password?access_token='+authToken,inputs,{
        header: {
          'Content-Type': 'application/json'
        }
      });
    },

    socailLogin : function (inputs) {
      return $http.post(BASE_URL + '/auth/local?from=app',inputs,{
        header: {
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
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    getAddressByUserId : function() {
      return $http.get(BASE_URL + '/api/address/getaddressByUserId/'+userId, {
      headers: {
        'Authorization': 'Bearer '+authToken,
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
    getCategories : function(inputs) {
      return $http.get(BASE_URL + '/api/categories', inputs, {
      headers: {
        'Content-Type': 'application/json'
        }
      });
    },
    getOrdersByUserId : function(inputs) {
      return $http.get(BASE_URL + '/api/orders/getOrdersByUser/'+userId, inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    deleteAddress : function(addressId) {
      return $http.delete(BASE_URL + '/api/address/'+addressId , {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    editAddress : function(addressId, addressDetails) {
      return $http.put(BASE_URL + '/api/address/'+addressId ,addressDetails, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },
    makeCOD : function(inputs) {
      return $http.post(BASE_URL + '/api/checkout/makePayment' ,inputs, {
      headers: {
        'Authorization': 'Bearer '+authToken,
        'Content-Type': 'application/json'
        }
      });
    },


  };
});
