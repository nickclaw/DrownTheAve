var directives = angular.module('app.directives', []);

directives
    .directive('itemList', [
        'Item',
        function(Item) {

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

    .directive('imageDrop', [
        function() {
            return {
                restrict: 'E',
                template: '<canvas />',
                scope: {
                    model: "=ngModel",
                    width: "@cWidth",
                    height: "@cHeight"
                },
                link: function($scope, elem, attrs) {
                    var canvas = elem.children().attr({width: $scope.width, height: $scope.height})[0],
                        ctx = canvas.getContext('2d'),
                        lastPos = null,
                        img = null,
                        xOff = 0, yOff = 0;

                    $scope.$watch('model.profile.picture', function(value) {
                        value && loadDataUrl(value);
                    });

                    elem
                        .bind('dragenter', function(){elem.addClass('dragging')})
                        .bind('dragleave drop', function(){elem.removeClass('dragging')})
                        .bind('dragover', function(evt) {
                            evt.preventDefault();
                        })
                        .bind('drop', function(evt) {
                            evt.preventDefault();
                            var file = evt.dataTransfer.files[0],
                                reader = new FileReader();

                            if (!file || file.type.indexOf('image') < 0) return false;

                            reader.addEventListener('load', function() {
                                xOff = yOff = 0;
                                loadDataUrl(reader.result);
                            });

                            reader.readAsDataURL(file);
                        })
                        .bind('mousedown', function(evt) {
                            lastPos = [evt.pageX, evt.pageY];
                            elem.addClass('grabbing');
                        })
                        .bind('mouseup mouseout', function(evt) {
                            lastPos = null;
                            elem.removeClass('grabbing');
                        })
                        .bind('mousemove', function(evt) {
                            var x = evt.pageX,
                                y = evt.pageY;

                            if (lastPos) {
                                var dx = x - lastPos[0],
                                    dy = y - lastPos[1];

                                xOff = xOff + dx;
                                yOff = yOff + dy;

                                render();

                                lastPos = [x, y];
                            }
                        });

                    function loadDataUrl(url) {
                        img = new Image();
                        img.addEventListener('load', function() {
                            render(img);
                        });
                        img.src = url;
                    }

                    function render() {
                        img && ctx.drawImage(img, xOff, yOff, img.naturalWidth, img.naturalHeight);
                        $scope.model.profile.picture = canvas.toDataURL();
                    }
                }
            }
        }
    ])
