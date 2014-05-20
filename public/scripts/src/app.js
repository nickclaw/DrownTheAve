var app = angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.directives',
    'app.resources'
]);

app.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');

        $routeProvider
            .when('/:type/create', {
                templateUrl: function(attr) {
                    return '/static/partial/' + attr.type + '.html';
                },
                controller: 'CreateItemController'
            })
            .when('/:type/:id', {
                templateUrl: function(attr) {
                    return '/static/partial/' + attr.type + '.html';
                },
                controller: 'EditItemController'
            })
            .when('/:type/:id/delete', {
                controller: 'DeleteItemController',
                templateUrl: '/static/partial/collection.html'
            })
            .when('/:type', {
                templateUrl: '/static/partial/collection.html',
                controller: 'CollectionController'
            });
    }
])
