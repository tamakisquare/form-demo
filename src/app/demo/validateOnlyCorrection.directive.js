(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @name validateOnlyCorrection
     * @restrict A
     *
     * @description
     * This directive defines a flag `$validatable` on model controller. It can be unset by other directives
     * via exposed API. Once unset (ie. set to false), it will only be set to true when there's a change to
     * the model's view value. The views/templates are designed to use this `$validatable` flag to control
     * the visibility of frontend/backend validation errors. The `onDemandValidation` and `serverValidation`
     * directives are dependents of this directive.
     *
     * @element INPUT
     */
    .directive('validateOnlyCorrection', validateOnlyCorrection);

  /** @ngInject */
  function validateOnlyCorrection() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: linkFn,
    };

    return directive;

    /** @ngInject */
    function linkFn(scope, element, attrs, modelCtrl) {
      // Model always start with being validatable.
      modelCtrl.$validatable = true;

      modelCtrl.unsetValidatable = function() {
        modelCtrl.$validatable = false;

        // Unbind after the first change to current input value
        element.one('input', setValidatable);
      };

      scope.$on('$destroy', function() {
        // Unbind the event in case the event has nevered happened during lifetime of the scope.
        element.off('input', setValidatable);
      });

      function setValidatable() {
        scope.$apply(function() {
          modelCtrl.$validatable = true;
        });
      }
    }
  }

})();
