(function() {
  'use strict';

  angular
    .module('formDemo')
    .controller('EmailFormController', EmailFormController);

  /** @ngInject */
  function EmailFormController(formDelegateService) {
    var vm = this;

    vm.name = 'colin';
    vm.email = 'invalid email';
  }
})();
