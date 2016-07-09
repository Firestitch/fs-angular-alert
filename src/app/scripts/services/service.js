(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name app.services:fsAlert
    */

    angular.module('fs-angular-alert')
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
                            title: 'Attention',
                            content: message,
                            ok: 'Ok',
                            preserveScope: true,
                            skipHide: true 
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
             * @methodOf app.services:fsAlert
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
             * @methodOf app.services:fsAlert
             * @param {string} message Message
             * @description Displays a success alert
             */
            function success(message, options) {
                return show('success', message, options);
            }

            /**
             * @ngdoc method
             * @name info
             * @methodOf app.services:fsAlert
             * @param {string} message Message
             * @description Displays a info alert
             */
            function info(message, options) {
                return show('info', message, options);
            }

            /**
             * @ngdoc method
             * @name warning
             * @methodOf app.services:fsAlert
             * @param {string} message Message
             * @description Displays a warning alert
             */
            function warning(message, options) {
                return show('warning', message, options);
            }

            /**
             * @ngdoc method
             * @name error
             * @methodOf app.services:fsAlert
             * @param {string} message Message
             * @description Displays a error alert
             */
            function error(message, options) {
                return show('error', message, options);
            }

            /**
             * @ngdoc method
             * @name clear
             * @methodOf app.services:fsAlert
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
