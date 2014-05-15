var directives = angular.module('app.directives', []);

directives
    .directive('itemList', [
        '$http',
        function($http) {

            return {
                restrict: 'E',
                templateUrl: '/static/partial/item-list.html'
            }
        }
    ])
