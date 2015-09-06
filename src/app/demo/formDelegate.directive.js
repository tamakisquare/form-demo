(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @name formDelegate
     * @restrict A
     *
     * @description
     * This directive registers the form instance, corresponding to the element, with `formDelegateService`,
     * as to expose the form instance to outside of the current scope.
     *
     * @element FORM
     */
    .directive('formDelegate', formDelegate);

  /** @ngInject */
  function formDelegate(formDelegateService) {
    var directive = {
      restrict: 'A',
      require: 'form',
      link: formDelegateLink,
    };

    return directive;

    /** @ngInject */
    function formDelegateLink(scope, element, attrs, formCtrl) {
      var deregisterInstance = formDelegateService._registerInstance(formCtrl, formCtrl.$name);

      // Make sure to de-register from `formDelegateService` when scope gets destroyed.
      scope.$on('$destroy', function() {
        deregisterInstance();
      });
    }
  }

})();
