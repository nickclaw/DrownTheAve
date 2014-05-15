var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$http',
        '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.loading = true;

            $scope.models = [];
            $scope.itemUrl = "/static/partial/item/" + $routeParams.type + "-item.html";

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
                    $scope.model = data;
                });
        }
    ]);

var typeMap = {
    bar: {},
    special: {},
    user: {}
}
