var resources = angular.module('app.resources', ['ngResource'])

resources.factory('Item', [
    '$resource',
    function($resource) {

        return $resource(
            '/api/crud/:type',
            {
                type: '@type',
            },
            {
                get: {method: 'GET'},
                delete: {method: 'DELETE'},
                save: {method: 'PUT'},
                create: {method: 'POST'},
                search: {method: 'POST', url:'/api/crud/:type/search', isArray: true},
            }
        )
    }
])
