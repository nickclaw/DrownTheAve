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

                    b = $scope.models;

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
                    var canvas = elem.children().attr({ // get canvas and set size
                            width: $scope.width,
                            height: $scope.height
                        })[0],
                        ctx = canvas.getContext('2d');  // get canvas context

                    var lastPos = null,             // [x,y] array
                        img = null,                 // Image
                        xOff = 0, yOff = 0;         // left/top offsets in pixels

                    $scope.scale = 1;               // unused so far

                    // listen for intial picture load
                    $scope.$watch('model.profile.picture', function(value) {
                        value && loadDataUrl(value);
                    });


                    // add event listeners
                    elem
                        // for drag/drop border
                        .bind('dragenter', function(){elem.addClass('dragging')})
                        .bind('dragleave drop', function(){elem.removeClass('dragging')})

                        // keep page from just loading image on drop
                        .bind('dragover', function(evt) {evt.preventDefault();})

                        // when file is dropped, read file and load result
                        .bind('drop', function(evt) {
                            evt.preventDefault();
                            var file = evt.dataTransfer.files[0],
                                reader = new FileReader();

                            if (!file || file.type.indexOf('image') < 0) return false;

                            reader.addEventListener('load', function() {
                                loadDataUrl(reader.result);
                            });

                            reader.readAsDataURL(file);
                        })

                        // for grabbing image
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
                                y = evt.pageY,
                                minX = $scope.width - img.naturalWidth,
                                minY = $scope.height - img.naturalHeight;

                            if (lastPos) {
                                var dx = x - lastPos[0],
                                    dy = y - lastPos[1];

                                xOff = Math.max(Math.min(xOff + dx, 0), minX);
                                yOff = Math.max(Math.min(yOff + dy, 0), minY);

                                console.log(dx, xOff)

                                render();

                                lastPos = [x, y];
                            }
                        });

                    /* HELPER FUNCTIONS */
                    // have to be in this scope to keep references
                    // to various variables

                    /**
                     * Loads a base64 url into an image, resets render options,
                     * then renders the image
                     */
                    function loadDataUrl(url) {
                        img = new Image();
                        img.addEventListener('load', function() {
                            xOff = yOff = 0;
                            render(img);
                        });
                        img.src = url;
                    }

                    /**
                     * Actually renders the image ontot he canvas, then
                     * updates ng-model value
                     */
                    function render() {
                        img && ctx.drawImage(img, xOff, yOff, img.naturalWidth, img.naturalHeight);
                        $scope.model.profile.picture = canvas.toDataURL();
                    }
                }
            }
        }
    ])
