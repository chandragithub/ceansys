(function () {
    'use strict';

    angular
        .module('centoku')
        .factory('OrderService', Service);

    function Service($http, $q) {
        var service = {};

        service.CreateOrder = CreateOrder;
        service.GetOrder = GetOrder;
        service.DeleteOrder = DeleteOrder;
        service.UpdateOrder = UpdateOrder;
        return service;

        function CreateOrder(data) {
            return $http.post('/api/order/'+ JSON.stringify(data)).then(handleSuccess, handleError);
        }
        
        function GetOrder(data) {
            return $http.get('/api/order/get/'+ data).then(handleSuccess, handleError);
        }

        function DeleteOrder(data) {
            return $http.delete('/api/order/delete/'+ JSON.stringify(data)).then(handleSuccess, handleError);
        }

        function UpdateOrder(data) {
            return $http.put('/api/order/update/'+ JSON.stringify(data)).then(handleSuccess, handleError);
        }
        
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
