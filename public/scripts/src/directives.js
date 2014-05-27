var directives = angular.module('app.directives', []);

directives
    .directive('itemList', [
        'Item',
        function(Item) {

            return {
                restrict: 'E',
                templateUrl: '/static/partial/directive/item-list.html',
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


    .directive('hoursPicker', [
        function() {

            return {
                restrict: 'E',
                templateUrl: '/static/partial/directive/hours-picker.html',
                scope: {
                    data: '=ngModel'
                },
                link: function($scope, elem, attrs) {
                    var mouseDown = false,
                        picker = elem.children()[0];

                    $scope.viewer = '';

                    elem
                        .bind('mousedown', function(evt) {
                            mouseDown = true;
                        })
                        .bind('mouseup', function(evt) {
                            mouseDown = false;
                        })
                        .bind('mouseover mousedown', function(evt) {
                            if (mouseDown) {
                                evt.target.classList.toggle('selected');
                                calculateHours();
                            }
                        })
                        .bind('mousemove', function(evt) {
                            var day = (["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])[evt.target.getAttribute('data-day')],
                                start = parseInt(evt.target.getAttribute('data-hour')),
                                end = start + 1,
                                startString = start % 12 + (start < 12 ? "am" : "pm"),
                                endString = end % 12 + (end < 12 ? "am" : "pm");

                            $scope.viewer = day && startString ? day + " " + startString + ' - ' + endString : " ";
                            $scope.$digest();
                        });


                    function calculateHours() {
                         _.each(picker.children, function(day) {
                            var hours = [],
                                start = null,
                                end = null;

                            _.each(day.children, function(hour, index) {
                                if (hour.classList.contains('selected') && index < day.children.length - 1) {
                                    if (start === null) start = parseInt(hour.getAttribute('data-hour'));
                                    end = parseInt(hour.getAttribute('data-hour'));
                                } else if (start !== null) {
                                    hours.push({start: start * 3600000, end: (end + 1) * 3600000});
                                    start = end = null;
                                }
                            });

                            $scope.data[day.getAttribute('data-day')] = hours;
                        });
                    }

                    $scope.$watch('data', function(data) {
                        _.each(data, function(day, index) {
                            _.each(day, function(range) {
                                var start = ~~(range.start / 3600000),
                                    end = ~~(range.end / 3600000) - 1;

                                    for (var i = start; i <= end; i++) {
                                        picker.children[index].children[i].classList.add('selected');
                                    }
                            });
                        });
                    });
                }
            }
        }
    ])
;
