angular.module('micupon', ['ngAnimate', 'mgcrea.ngStrap', 'angular-table', 'angular-perfect-scrollbar-2'])
    .constant("socialProvider", ["facebook", "google"])
    .factory('AccountService', ["$q", function($q) {
        return {
            currentUser: function() {
                var def = $q.defer();
                Stamplay.User.currentUser()
                    .then(function(response) {
                        if (response.user === undefined) {
                            def.resolve(false);
                        } else {
                            def.resolve(response.user);
                        }
                    }, function(error) {
                        def.reject();
                    });
                return def.promise;
            }
        };
    }])
    .config(['$httpProvider', function($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        if (!$httpProvider.defaults.headers.post) {
            $httpProvider.defaults.headers.post = {};
        }
        $httpProvider.defaults.headers.post['If-Modified-Since'] = $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
        $httpProvider.defaults.headers.post['Cache-Control'] = $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.post['Pragma'] = $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }]);