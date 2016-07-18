
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

    angular.module('fs-angular-alert',[])
    .provider('fsAlert', function() {
        var modals = 0;
        var _options = {    success: { mode: 'toast' },
                            warning: { mode: 'toast' },
                            info: { mode: 'toast' },
                            error: { mode: 'modal' } };

        this.options = function(value) {
            _options = angular.extend(_options,value);
        }

        this.$get = function($timeout, $mdToast, $mdDialog, $q) {

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
                options = options || {};

                if(options.icon) {
                    message = '<md-icon>' + options.icon + '</md-icon>' + message;
                }

                options.template = '<md-toast class="md-toast fs-toast ' + type +'"><div class="md-toast-content">' + message + '</div></md-toast>';
                options.position = options.position || 'bottom left';
                $mdToast.show(options);
            }

            function modal(type, message, options) {

                var defer = $q.defer();
                
                if(!modals) {
                   
                    modals++;
                    $mdDialog.show(
                        $mdDialog.alert({
                            template: ['<md-dialog md-theme="{{ dialog.theme }}" aria-label="{{ dialog.ariaLabel }}">',
                            '<md-dialog-content class="md-dialog-content" tabIndex="-1">',
                            '   <h2 class="md-title">{{ dialog.title }}</h2>',
                            message,
                            '</md-dialog-content>',
                            '<md-dialog-actions>',
                            '   <md-button ng-click="dialog.ok($event)" class="md-accent">Ok</md-button>',
                            '</md-dialog-actions>',
                            '</md-dialog>'
                            ].join(''),
                            title: 'Attention',
                            content: message,
                            clickOutsideToClose: true,
                            ok: 'Ok',
                            controllerAs: 'dialog',
                            preserveScope: true,
                            skipHide: true,
                            controller: function () {
                                this.ok = function() {
                                    $mdDialog.hide();
                                }
                            }
                          })
                    )
                    .then(function() {
                        modals--;
                        defer.resolve();
                    });
                }

                return defer.promise;
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
                    timer = $timeout(function() {
                        clear();
                    }, options.timeout * 1000);            
                }
            }

            function show(type, message, options) {
                
                var options = angular.merge({}, _options[type] || {},options || {});

                if(!options.icon) {
                    if(type=='success') {
                        options.icon = 'done';
                    } else if(type=='error') {
                        options.icon = 'report_problem';
                    } else if(type=='info') {
                        options.icon = 'info';
                    } else if(type=='warning') {
                        options.icon = 'report_problem';
                    }
                }

                if(options.mode=='toast') {                    
                    toast(type, message, options);
                
                } else if(options.mode=='modal') {
                    return modal(type, message, options);
                
                } else if(options.mode=='banner') {
                    banner(type, message, options);
                }

                var defer = $q.defer();
                defer.resolve();
                return defer.promise;
            }


            /**
             * @ngdoc method
             * @name success
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a success alert
             */
            function success(message, options) {
                return show('success', message, options);
            }

            /**
             * @ngdoc method
             * @name info
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a info alert
             */
            function info(message, options) {
                return show('info', message, options);
            }

            /**
             * @ngdoc method
             * @name warning
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a warning alert
             */
            function warning(message, options) {
                return show('warning', message, options);
            }

            /**
             * @ngdoc method
             * @name error
             * @methodOf fs-angular-alert.services:fsAlert
             * @param {string} message Message
             * @description Displays a error alert
             */
            function error(message, options) {
                return show('error', message, options);
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

