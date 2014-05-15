var app = angular.module('app', [
    'ngRoute',
    'app.controllers'
]);

app.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider
            .when('/admin/:type/:id', {
                templateUrl: function(attr) {
                    return '/static/partial/' + attr.type + '.html';
                },
                controller: 'ItemController'
            })
            .when('/admin/:type', {
                templateUrl: function(attr) {
                    return '/static/partial/' + attr.type + 's.html';
                },
                controller: 'CollectionController'
            });
    }
])
