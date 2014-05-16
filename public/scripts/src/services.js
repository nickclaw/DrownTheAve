var resources = angular.module('app.services', ['ngResource'])

resources.factory('Item', [
    '$resource',
    function($resource) {

        return $resource(
            '/admin/api/:type/:id',
            {
                id: '@id',
                type: '@type',
                s: 's' // so we can turn /api/type to /api/types
            },
            {
                get: {method: 'GET'},
                delete: {method: 'DELETE'},
                save: {method: 'PUT'},
                create: {method: 'POST', url:'/admin/api/:type\s'},
                search: {method: 'POST', url:'/admin/api/:type:s', isArray: true, data: {
                    offset: 0,
                    limit: 10,
                    sort: 'name',
                    order: 'desc'
                }}
            }
        )
    }
])
