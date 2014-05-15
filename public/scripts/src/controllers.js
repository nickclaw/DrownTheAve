var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$http',
        '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.models = [];
            $scope.loading = true;

            $scope.loadMore = function() {
                $scope.loading = true;
                $http.post('/admin/api/' + $routeParams.type + 's', {sort:'name', offset: $scope.models.length})
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.models = $scope.models.concat(data);
                    });
            }

            $scope.loadMore();
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
