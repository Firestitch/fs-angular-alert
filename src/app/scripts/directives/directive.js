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
    .directive('fsAlert', function ($compile) {
        return {
            template: '<div layout="row" layout-align="start center" type="{{type}}" class="fs-alert-banner fs-alert-{{type}}"><div><md-icon ng-show="icon">{{icon}}</md-icon></div><div ng-if="!message" ng-transclude></div><div ng-if="message">{{message}}</div>',
            restrict: 'E',
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

	                var icons = { success: 'done', error: 'report_problem', info: 'info', warning: 'report_problem' };
	                $scope.icon = icons[$scope.type];
	            }
	        }
        };
    });
})();