var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$routeParams',
        function($scope, $routeParams) {
            $scope.itemUrl = "/static/partial/item/" + $routeParams.type + "-item.html";
            $scope.listOptions = {};
            $scope.type = $routeParams.type;
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
