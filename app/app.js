(function () {
    'use strict';

    angular.module('centoku', [ 'ui.router', 
                                'ngTouch',
                                'ui.grid', 
                                'ui.grid.pagination', 
                                'ui.grid.exporter',
                                'ui.grid.importer',
                                'ui.grid.selection'
                               ]).config(config).run(run);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'application/components/home/templates/view.htm',
                controller: 'home',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('setting', {
                url: '/setting',
                templateUrl: 'application/components/setting/templates/view.htm',
                controller: 'setting',
                controllerAs: 'vm',
                data: { activeTab: 'setting' }
            })
            .state('ordering', {
                url: '/ordering',
                templateUrl: 'application/components/ordering/templates/view.htm',
                controller: 'ordering',
                controllerAs: 'vm',
                data: { activeTab: 'ordering' }
            })
            .state('board', {
                url: '/board',
                templateUrl: 'application/components/board/templates/view.htm',
                controller: 'board',
                controllerAs: 'vm',
                data: { activeTab: 'board' }
            })
            .state('inventory', {
                url: '/inventory',
                templateUrl: 'application/components/inventory/templates/view.htm',
                controller: 'inventory',
                controllerAs: 'vm',
                data: { activeTab: 'inventory' }
            });

            $locationProvider.html5Mode(true);
            $locationProvider.hashPrefix('!');
    }

    function run($http, $rootScope, $window, UserService) {
        
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
        
        initController();

        function initController() {
            UserService.GetCurrent().then(function (user) {
                $rootScope.user = user;
                $rootScope.companyname = "CEANSys";

                UserService.GetProfilePic(user.username).then(function(profilePic) {
                    console.log('profile pic pageth i s', profilePic);
                    $rootScope.profilePicURL = "/uploads/" +  user.username + "/" +profilePic;
                    console.log($rootScope.profilePicURL);
                })
            });
        }
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['centoku']);
        });
    });
})();