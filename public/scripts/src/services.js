var resources = angular.module('app.services', ['ngResource'])

resources.factory('Item', [
    '$resource',
    function($resource) {

        return $resource(
            '/admin/api/:type/:id',
            {
                id: '@id',
                type: '@type',
            },
            {
                get: {method: 'GET'},
                delete: {method: 'DELETE'},
                save: {method: 'PUT'},
                create: {method: 'POST', url:'/admin/api/:type\s'},
                search: {method: 'POST', url:'/admin/api/:type/search', isArray: true},
                next: {method: 'POST', url:'/admin/api/:type'}
            }
        )
    }
])
