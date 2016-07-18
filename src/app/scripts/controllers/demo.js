'use strict';

angular.module('app')
.controller('DemoCtrl', function ($scope, fsAlert, $timeout, fsModal) {

    fsAlert.success("Success message",{ hideDelay: 3000 });

    $timeout(function() {
        fsAlert.error('Error message', { mode: 'toast' });
    },3000);

    $timeout(function() {
        fsAlert.warning("Warning message");
    },6000);

    $timeout(function() {
        fsAlert.info("Info message");
    },9000);

    $timeout(function() {
        fsAlert.error("Error message<br>HTML");
    },12000);

    $scope.modal = function() {

        fsModal.show('ModalCtrl','views/modal.html');
    }

});
