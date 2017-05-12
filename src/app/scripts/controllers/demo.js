'use strict';

angular.module('app')
.controller('DemoCtrl', function ($scope, fsAlert, $timeout, fsModal) {

    $scope.modal = function() {
        fsModal.show('ModalCtrl','views/modal.html');
    }

    $scope.error = function() {
       fsAlert.error('Error message',{ mode: 'toast' });
    }

    $scope.warning = function() {
       fsAlert.warning('Warning message');
    }

    $scope.info = function() {
       fsAlert.info('Info message');
    }

    $scope.success = function() {
       fsAlert.success('Success message');
    }

    $scope.banner = function(type) {
       fsAlert.show(type, 'Banner message',{ mode: 'banner' });
    }

    $scope.successBlank = function() {
       fsAlert.success();
    }

	$scope.warningModal = function(type) {
       fsAlert.warning('Message...',{ mode: 'modal' });
    }

    $scope.successModal = function(type) {
       fsAlert.success('Message...',{ mode: 'modal' });
    }

	$scope.errorModal = function(type) {
       fsAlert.error('Message...',{ mode: 'modal' });
    }

    $scope.infoModal = function(type) {
       fsAlert.info('Message...',{ mode: 'modal' });
    }
});
