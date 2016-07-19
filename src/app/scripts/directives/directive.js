(function () {
    'use strict';

    angular.module('fs-angular-alert', [])
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
