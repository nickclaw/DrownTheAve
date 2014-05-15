var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$http',
        '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.loading = true;

            $scope.sortOptions = typeMap[$routeParams.type].sortOptions;
            $scope.sort = "id";
            $scope.order = "asc";
            $scope.search = "";

            $scope.models = [];
            $scope.itemUrl = "/static/partial/item/" + $routeParams.type + "-item.html";

            $scope.loadMore = function() {
                console.log($scope);

                $scope.loading = true;

                $http.post('/admin/api/' + $routeParams.type + 's', {
                        sort: $scope.sort,
                        order: $scope.order,
                        offset: $scope.models.length
                    })
                    .success(function(data) {
                        $scope.loading = false;
                        $scope.models = $scope.models.concat(data);
                    });
            }

            $scope.load = function() {
                $scope.models = [];
                $scope.loadMore();
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
    bar: {
        sortOptions: ['name', 'website', 'id']
    },
    special: {
        sortOptions: ['barName', 'id', 'deal']
    },
    user: {
        sortOptions: ['profile.firstName', 'profile.lastName', 'id', 'local.username']
    }
}
