var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$http',
        '$routeParams',
        function($scope, $http, $routeParams) {
            console.log($routeParams);
            $http.post('/admin/api/' + $routeParams.type + 's', {sort:'name'})
                .success(function(data) {
                    $scope.models = data;
                });
        }
    ])
    .controller('ItemController', [
        '$scope',
        '$http',
        '$routeParams',
        function($scope, $http, $routeParams) {
            $http.get('/admin/api/' + $routeParams.type + '/' + $routeParams.id)
                .success(function(data) {
                    console.log(data);
                    $scope.model = data;
                });
        }
    ]);

var typeMap = {
    bar: {},
    special: {},
    user: {}
}
