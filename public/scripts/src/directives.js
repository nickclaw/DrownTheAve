var directives = angular.module('app.directives', []);

directives
    .directive('itemList', [
        '$http',
        'Item',
        function($http, Item) {

            return {
                restrict: 'E',
                templateUrl: '/static/partial/item-list.html',
                scope: {
                    template: "@",
                    options: "=",
                    type: "@"
                },
                link: function($scope) {
                    $scope.models = Item.search({
                        type: $scope.type,
                    });

                    $scope.loading = false;
                    $scope.loaded = false;

                    $scope.load = function() {
                        $scope.loading = true;
                        var loaded = Item.search({
                            type: $scope.type,
                            offset: $scope.models.length
                        }, function() {
                            $scope.loading = false;
                            $scope.models = $scope.models.concat(loaded);
                        }, function() {
                            $scope.loading = false;
                        });
                    }

                    _.defaults($scope, {
                        models: []
                    });
                }
            }
        }
    ])
