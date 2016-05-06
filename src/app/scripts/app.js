'use strict';

angular
.module('app', [
    'config',
    'ngRoute',
    'ngMaterial',
    'ngAnimate',
    'ngStorage',
    'fs-angular-alert',
    'fs-angular-modal'
])
.config(function ($routeProvider, $mdThemingProvider, fsAlertProvider) {

    fsAlertProvider.options({ warning: { mode: 'banner' }});

    $routeProvider
    .when('/demo', {
        templateUrl: 'views/demo.html',
        controller: 'DemoCtrl',       
    })

    .when('/404', {
        templateUrl: 'views/404.html'
    })
    .otherwise({
        redirectTo: '/demo'
    });

})
.run(function () {


});
