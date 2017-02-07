(function () {
    'use strict';

    angular.module('centoku').controller('home', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;

        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }

})();