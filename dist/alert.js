
(function () {
    'use strict';

    angular.module('fs-angular-alert',[])
    .directive('fsAlerts', function(fsAlert) {
        return {
            template: '<fs-alert ng-repeat="alert in alerts" fs-type="{{alert.type}}" fs-message="{{alert.msg}}"></div>',
            restrict: 'E',
            replace: true,
            link: function ($scope, attrs) {

                $scope.alerts = [];
                $scope.$watch(fsAlert.get,function (alerts) {
                    $scope.alerts = alerts;
                });
            }
        };
    })
    .directive('fsAlert', function ($interpolate) {
        return {
            template: '<div layout="row" layout-align="start center" type="{{type}}" class="fs-alert-banner fs-alert-{{type}}"><div><md-icon ng-show="icon">{{icon}}</md-icon></div><div>{{message}}</div></div>',
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                message: '@fsMessage',
                type: '@fsType'
            },
            compile: function(elem, attrs, $transclude) {

            	return function ($scope, attrs, element) {

	                if(!$scope.type) {
	                    $scope.type = 'info';
	                }

	                $transclude($scope, function(clone) {
	                	var html = angular.element(clone).html();
	                	if(html) {
	                		$scope.message = $interpolate(html)($scope.$parent);
	                	}
              		});

	                var icons = { success: 'done', error: 'report_problem', info: 'info', warning: 'report_problem' };
	                $scope.icon = icons[$scope.type];
	            }
	        }
        };
    });
})();

(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name fs.fsAlert
    */

    angular.module('fs-angular-alert')
    .provider('fsAlert', function() {
        var modals = 0;
        var _options = {    success: { 	mode: 'toast',
        								message: '',
        								toastHideDelay: 5,
        								bannerHideDelay: 10 },
                            warning: { 	mode: 'toast',
                            			message: '',
                            			toastHideDelay: 5,
                            			bannerHideDelay: 10 },
                            info: { 	mode: 'toast',
                            			message: '',
                            			toastHideDelay: 5,
                            			bannerHideDelay: 10 },
                            error: { 	mode: 'modal',
                            			message: '',
                            			toastHideDelay: 5,
                            			 bannerHideDelay: 10 } };

        this.options = function(value) {
            _options = angular.merge(_options,value);
        }

        this.$get = function($timeout, $mdToast, $mdDialog, $q) {

            var service = {
                success: success,
                error: error,
                info: info,
                warning: warning,
                toast: toast,
                clear: clear,
                get: get,
                show: show
            },
            alerts = [];

            return service;

            function toast(type, message, options) {

            	var el = document.querySelector('md-toast.fs-toast.' + type + ' .message');

            	if(el) {
            		if(angular.element(el).text()==message) {
            			return;
            		}
            	}

                options = options || {};
                var icon = options.icon ? '<md-icon>' + options.icon + '</md-icon>' : '';

                options.template = '<md-toast class="md-toast fs-alert-toast fs-alert-' + type +'"><div class="md-toast-content">' + icon + '<span class="message">' + message + '</span></div></md-toast>';
                options.position = options.position || 'bottom left';
                options.hideDelay = (options.hideDelay===undefined ? _options[type].toastHideDelay : options.hideDelay) * 1000;
                $mdToast.show(options);
            }

            function modal(type, message, options) {
            	options = options || {};

                return $q(function(resolve,reject) {

	                if(modals) {
	                	return;
	                }

                    modals++;
                    $mdDialog.show(
                        $mdDialog.alert({
                            template: ['<md-dialog md-theme="default" aria-label="Dialog" class="fs-alert-modal fs-alert-{{type}}">',
                            '<md-dialog-content tabIndex="-1">',
                            '	<div class="md-dialog-content">',
                            '		<div layout="row" layout-align="start center" class="heading">',
                            '			<md-icon ng-show="icon">{{icon}}</md-icon>',
                            ' 		  	<h2 class="md-title" flex>{{title}}</h2>',
                            '		</div>',
                            '		<div ng-bind-html="content" class="content"></div>',
                            '	</div>',
                            '</md-dialog-content>',
                            '<md-dialog-actions>',
                            '   <md-button ng-click="ok($event)" class="md-accent">{{okLabel}}</md-button>',
                            '</md-dialog-actions>',
                            '</md-dialog>'
                            ].join(''),
                            clickOutsideToClose: true,
                            preserveScope: true,
                            skipHide: true,
                            controller: ['$scope','$sce',function($scope,$sce) {

                                $scope.content = $sce.trustAsHtml(message);
                                $scope.title = options.title===undefined ? 'Attention' : options.title;
                                $scope.okLabel = options.okLabel===undefined ? 'Ok' : options.okLabel;
                                $scope.type = type;
                                $scope.icon = options.icon;

                                $scope.ok = function() {
                                    $mdDialog.hide();
                                }
                            }]
                          })
                    )
                    .then(function() {
                        modals--;
                        resolve();
                    });
              	});
            }

            /**
             * @ngdoc method
             * @name add
             * @methodOf fs.fsAlert
             * @param {string} type Specifies the type of message (success, error, info, warning)
             * @param {string} msg Alert message
             * @param {object} options Optional options
             * @param {string} [options.clear=true] Clears any previous alerts before displaying the new alert
             * @description Adds an alert message
             */
            function banner(type, msg, options) {

                var options = options || {};
                options.clear = options.clear===undefined ? true : options.clear;

                if(options.clear)
                    clear();

                var body = angular.element(document.querySelector('body'));

                alerts
                .push({
                    type: type,
                    msg: msg,
                    close: clear
                });

                var timeout = _options[type].bannerHideDelay * 1000;
                if(timeout) {
                    $timeout(function() {
                        clear();
                    },timeout);
                }
            }

            function getIconName(type) {
                if(type=='success') {
                   return 'done';
                } else if(type=='error') {
                    return 'report_problem';
                } else if(type=='info') {
                    return 'info';
                } else if(type=='warning') {
                    return 'report_problem';
                }
            }

            function show(type, message, options) {

                var options = angular.merge({}, _options[type] || {},options || {});

                if(options.icon===undefined) {
                	options.icon = getIconName(type);
                }

                if(!message) {
                	message = options.message;
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
             * @methodOf fs.fsAlert
             * @param {string} message Message
             * @description Displays a success alert
             */
            function success(message, options) {
            	options = options || {};
            	options.title = options.title===undefined ? 'Success' : options.title;
                return show('success', message, options);
            }

            /**
             * @ngdoc method
             * @name info
             * @methodOf fs.fsAlert
             * @param {string} message Message
             * @description Displays a info alert
             */
            function info(message, options) {
            	options = options || {};
            	options.title = options.title===undefined ? 'Information' : options.title;
                return show('info', message, options);
            }

            /**
             * @ngdoc method
             * @name warning
             * @methodOf fs.fsAlert
             * @param {string} message Message
             * @description Displays a warning alert
             */
            function warning(message, options) {
            	options = options || {};
            	options.title = options.title===undefined ? 'Warning' : options.title;
                return show('warning', message, options);
            }

            /**
             * @ngdoc method
             * @name error
             * @methodOf fs.fsAlert
             * @param {string} message Message
             * @description Displays a error alert
             */
            function error(message, options) {
            	options = options || {};
            	options.title = options.title===undefined ? 'Attention' : options.title;
                return show('error', message, options);
            }

            /**
             * @ngdoc method
             * @name clear
             * @methodOf fs.fsAlert
             * @param {string} message Message
             * @description Clears any alert messages
             */
            function clear() {
                alerts = [];
                $mdToast.hide();
            }

            function get() {
                return alerts;
            }
        };
    });
})();

