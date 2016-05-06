(function () {

    'use strict';
    angular.module('app')
    .controller('ModalCtrl', function ($scope, fsAlert) {
     	
     	setTimeout(function() { fsAlert.error('ERROR ERROR ERROR!!!'); }, 1000);
    });
})();
