(function () {
    'use strict';

    angular
        .module('centoku')
        .factory('InventoryService', Service);

    function Service($http, $q) {
        var service = {};

        service.CreateInventory = CreateInventory;
        service.GetInventory = GetInventory;
        return service;

        function CreateInventory(data) {
            return $http.post('/api/inventory/'+ JSON.stringify(data)).then(handleSuccess, handleError);
        }
        
        function GetInventory(data) {
            return $http.get('/api/inventory/get/'+ data).then(handleSuccess, handleError);
        }
        
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
