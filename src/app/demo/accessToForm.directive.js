(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @name accessToForm
     * @restrict A
     *
     * @description
     * This directive defines name of the form instance to be looking for in the FormDelegteService.
     * Once found, make the form instance accessible to the scope associate with the element and expose
     * the promise that will eventually resolve to the form instance.
     *
     * @param {promise} accessToForm The name of the form whose instance is set to make accessible to the scope
     *                               associate with the element.
     *
     * @element ANY
     */
    .directive('accessToForm', accessToForm);

  /** @ngInject */
  function accessToForm($q, formDelegateService) {
    var directive = {
      restrict: 'A',
      controller: ctrlFn,
    };

    return directive;

    /** @ngInject */
    function ctrlFn($scope, $element, $attrs) {
      var formProm = $q.when(formDelegateService.$getByFormName($attrs.accessToForm));

      formProm.then(function(form) {
        $scope.injectedForm = form;
      });

      this.form = formProm;
    }
  }

})();
