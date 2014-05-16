var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$routeParams',
        'Item',
        function($scope, $routeParams, Item) {
            $scope.loading = true;
            $scope.itemUrl = "/static/partial/item/" + $routeParams.type + "-item.html";
            $scope.models = Item.search({
                type: $routeParams.type,
            });
        }
    ])
    .controller('ItemController', [
        '$scope',
        '$routeParams',
        'Item',
        function($scope, $routeParams, Item) {
            $scope.model = Item.get({
                id: $routeParams.id,
                type: $routeParams.type
            });
        }
    ]);
