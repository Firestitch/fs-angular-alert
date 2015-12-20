(function () {
    'use strict';
    
	angular.module('fs-angular-alert',[]);


})();

(function () {
    'use strict';

    angular.module('fs-angular-alert')
    .directive('alert', function (fsAlert) {
        return {
            template: '<div class="alerts"><div ng-repeat="alert in alerts" type="{{alert.type}}" class="alert alert-{{alert.type}}">{{ alert.msg }}</div></div>',
            restrict: 'E',
            replace: true,
            link: function ($scope, attrs) {

                $scope.alerts = [];
                $scope.$watch(fsAlert.get,function (alerts) {
                     $scope.alerts = alerts;
                });
            }
        };
    });
})();

(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-alert.services:fsAlert
    */

    angular.module('fs-angular-alert')
    .factory('fsAlert', function ($timeout) {
        var service = {
            add: add,
            clear: clear,
            get: get,
            success: success,
            error: error,
            info: info,
            warning: warning
        },
        alerts = [],
        timeout = 10,
        timer;

        return service;

        /**
         * @ngdoc method
         * @name add
         * @methodOf fs-angular-alert.services:fsAlert
         * @param {string} type Specifies the type of message (success, error, info, warning)
         * @param {string} msg Alert message
         * @param {object} options Optional options
         * @param {string} [options.clear=true] Clears any previous alerts before displaying the new alert
         * @param {string} [options.timeout=10] The amount of seconds after displaying an alert to hide the alert
         * @description Adds an alert message
         */
        function add(type, msg, options) {
           
            var options = options || {};
            options.clear = options===undefined ? true : options.clear;
            options.timeout = options===undefined ? 10 : options.timeout;

            if(options.clear)
                clear();

            var body = angular.element(document.querySelector('body'));

            alerts
            .push({
                type: type,
                msg: msg,
                close: clear
            });

            /*
            body.animate({scrollTop: angular.element(document.querySelector('div.alert')).scrollTop()}, 500, 'swing', function () {
                $timeout.cancel(timer);
                timer = $timeout(function(){
                    clear();
                }, timeout);
            });
            */

            if(options.timeout) {
                timer = $timeout(function(){
                    clear();
                }, options.timeout * 1000);            
            }
        }


        /**
         * @ngdoc method
         * @name success
         * @methodOf fs-angular-alert.services:fsAlert
         * @param {string} message Message
         * @description Displays a success alert
         */
        function success(message,options) {
            add('success',message,options);
        }

        /**
         * @ngdoc method
         * @name info
         * @methodOf fs-angular-alert.services:fsAlert
         * @param {string} message Message
         * @description Displays a info alert
         */
        function info(message,options) {
            add('info',message,options);
        }

        /**
         * @ngdoc method
         * @name warning
         * @methodOf fs-angular-alert.services:fsAlert
         * @param {string} message Message
         * @description Displays a warning alert
         */
        function warning(message,options) {
            add('warning',message,options);
        }

        /**
         * @ngdoc method
         * @name error
         * @methodOf fs-angular-alert.services:fsAlert
         * @param {string} message Message
         * @description Displays a error alert
         */
        function error(message,options) {
            add('danger',message,options);
        }

        /**
         * @ngdoc method
         * @name clear
         * @methodOf fs-angular-alert.services:fsAlert
         * @param {string} message Message
         * @description Clears any alert messages
         */
        function clear() {
            alerts = [];
        }

        function get() {
            return alerts;
        }
    });
})();

angular.module('fs-angular-alert').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/directive.html',
    ""
  );

}]);
