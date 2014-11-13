angular.module('app', [
        'ngMaterial',
        'ngRoute',
        'utils',
        'page.home'
    ])
    .config([
        '$locationProvider',
        '$routeProvider',
        function($locationProvider, $routeProvider) {
            $locationProvider
                .html5Mode(false)
                .hashPrefix('!');
        }
    ])
