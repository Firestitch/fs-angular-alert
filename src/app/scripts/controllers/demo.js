'use strict';

angular.module('app')
.controller('DemoCtrl', function ($scope, fsAlert, $timeout, fsModal) {

    fsAlert.success("Success message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.info("Info message",{ timeout: 0, clear: false });
    fsAlert.warning("Warning message",{ timeout: 0, clear: false });



    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });
    fsAlert.error("Error message",{ timeout: 0, clear: false });

    $scope.modal = function() {

        fsModal.show('ModalCtrl','views/modal.html');
    }

});
