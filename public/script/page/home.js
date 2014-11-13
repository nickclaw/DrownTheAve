angular.module('page.home', ['utils'])
    .config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/', {
                templateUrl: '/static/template/home.html',
                controller: 'HomeController'
            })
        }
    ])
    .controller('HomeController', [
        '$scope',
        'ajax',
        function($scope, ajax) {
            $scope.bars = ajax({
                method: 'post',
                url: '/api/bars',
                isArray: true
            });

            console.log($scope.bars);
        }
    ])
