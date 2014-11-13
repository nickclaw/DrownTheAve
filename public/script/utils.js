angular.module('utils', [])
    .service('ajax', [
        '$http',
        function($http) {
            return function ajax(options) {
                var obj = options.isArray ? [] : {};
                obj.$promise = new Promise(function(resolve, reject) {
                    $http[options.method](
                        options.url,
                        options.data
                    ).success(function(data) {
                        if (options.isArray) {
                            var val;
                            while(val = data.shift()) {
                                obj.push(val);
                            }
                        } else {
                            _.extend(obj, data);
                        }
                        resolve(data);
                    }).error(reject);
                });

                return obj;
            }
        }
    ])
