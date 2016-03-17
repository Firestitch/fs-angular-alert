(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name fs-angular-alert.services:fsAlert
    */

    angular.module('fs-angular-alert',[])
    .provider('fsAlert', function() {

        var _options = {    success: { mode: 'toast' },
                            warning: { mode: 'toast' },
                            info: { mode: 'info' },
                            error: { mode: 'modal' } };

        this.options = function(value) {
            _options = angular.extend(_options,value);
        }

        this.$get = function($timeout, $mdToast, $mdDialog) {

            var service = {
                success: success,
                error: error,
                info: info,
                warning: warning,
                toast: toast,
                clear: clear,
                get: get                
            },
            alerts = [],
            timeout = 10,
            timer;

            return service;

            function toast(type, message, options) {                
                $mdToast.showSimple(message);
            }

            function modal(type, message, options) {

                $mdDialog.show(
                    $mdDialog.alert({
                        title: 'Attention',
                        content: message,
                        ok: 'Ok'
                      })
                );

            }

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
            function banner(type, msg, options) {
      
                var options = options || {};
                options.clear = options.clear===undefined ? true : options.clear;
                options.timeout = options.timeout===undefined ? 15 : options.timeout;

                if(options.clear)
                    clear();

                var body = angular.element(document.querySelector('body'));

                alerts
                .push({
                    type: type,
                    msg: msg,
                    close: clear
                });

                if(options.timeout) {
                    timer = $timeout(function(){
                        debugger;
                        clear();
                    }, options.timeout * 1000);            
                }
            }

            function show(type, message, options) {
                
                var options = angular.merge(_options[type] || {},options || {});

                if(options.mode=='toast') {
                    toast(type, message, options);
                
                } else if(options.mode=='modal') {
                    modal(type, message, options);
                
                } else if(options.mode=='banner') {
                    banner(type, message, options);
                }
            }


            /**
             * @ngdoc method
             * @name success
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a success alert
             */
            function success(message, options) {
                show('success', message, options);
            }

            /**
             * @ngdoc method
             * @name info
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a info alert
             */
            function info(message, options) {
                show('info', message, options);
            }

            /**
             * @ngdoc method
             * @name warning
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a warning alert
             */
            function warning(message, options) {
                show('warning', message, options);
            }

            /**
             * @ngdoc method
             * @name error
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a error alert
             */
            function error(message, options) {
                show('error', message, options);
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
        };
    });
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

angular.module('fs-angular-alert').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('views/directives/directive.html',
    ""
  );

}]);
