var app = angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.directives'
]);

app.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider
            .when('/:type/:id', {
                templateUrl: function(attr) {
                    return '/static/partial/' + attr.type + '.html';
                },
                controller: 'ItemController'
            })
            .when('/:type', {
                templateUrl: '/static/partial/collection.html',
                controller: 'CollectionController'
            });
    }
])
