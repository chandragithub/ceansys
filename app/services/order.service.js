(function () {
    'use strict';

    angular
        .module('centoku')
        .factory('OrderService', Service);

    function Service($http, $q) {
        var service = {};

        service.CreateOrder = CreateOrder;
        service.GetOrder = GetOrder;
        return service;

        function CreateOrder(data) {
            return $http.post('/api/order/'+ JSON.stringify(data)).then(handleSuccess, handleError);
        }
        
        function GetOrder(data) {
            return $http.get('/api/order/get/'+ data).then(handleSuccess, handleError);
        }
        
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
