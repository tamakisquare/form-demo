(function() {
  'use strict';

  angular
    .module('formDemo')
    .controller('DemoController', DemoController);

  /** @ngInject */
  function DemoController($q, $timeout) {
    var vm = this;

    vm.submit = function(dataObj, formCtrl) {
      if (formCtrl.readyForSubmission()) {
        var deferred = $q.defer();

        console.log("Submitting");

        vm.submitProm = deferred.promise;

        $timeout(mockResponseWithValidationError, 1000);
      }

      function mockResponseWithValidationError() {
        var mockResponse = {
          status: 400,
          data: {
            email: ['The email address is already taken.']
          }
        };

        deferred.reject(mockResponse);
      }
    };
  }
})();
