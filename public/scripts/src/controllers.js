var controllers = angular.module('app.controllers', []);

controllers
    .controller('CollectionController', [
        '$scope',
        '$routeParams',
        function($scope, params) {
            $scope.itemUrl = "/static/partial/item/" + params.type + "-item.html";
            $scope.listOptions = {};
            $scope.type = params.type;
        }
    ])
    .controller('EditItemController', [
        '$scope',
        '$routeParams',
        'Item',
        function($scope, params, Item) {
            $scope.model = Item.get({
                id: params.id,
                type: params.type
            });

            $scope.submit = $scope.model.$save.bind(
                $scope.model,
                {type: params.type}
            );
        }
    ])
    .controller('CreateItemController', [
        '$scope',
        '$location',
        '$routeParams',
        'Item',
        function($scope, $location, params, Item) {
            $scope.model = Item.default({
                type: params.type
            });

            $scope.submit = $scope.model.$create.bind(
                $scope.model,
                {type: params.type},
                function() {
                    $location.path('/' + params.type + '/' + $scope.model.id);
                }
            );
        }
    ])
    .controller('DeleteItemController', [
        '$location',
        '$routeParams',
        'Item',
        function($location, params, Item) {
            Item.delete({
                id: params.id,
                type: params.type
            }, function() {
                $location.path('/' + params.type);
            }, function() {
                $location.path('/' + params.type);
            });
        }
    ])
;
