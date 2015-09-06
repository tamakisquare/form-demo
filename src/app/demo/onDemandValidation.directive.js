(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @name onDemandValidation
     * @restrict A
     *
     * @description
     * This directive enhances form controller to make it compatible with Funsha's way of handling
     * frontend validation errors, which is showing validation errors only upon user's attempt to
     * proceed to the next and forward action button is disabled when there's at least one missing required value
     * or at least one visible error.
     *
     * Note: This directive requires the `validateOnlyCorrection` directive being applied on contained inputs of
     * the form.
     *
     * @element FORM
     */
    .directive('onDemandValidation', onDemandValidation);

  /** @ngInject */
  function onDemandValidation() {
    var directive = {
      restrict: 'A',
      require: 'form',
      link: linkFn,
    };

    return directive;

    /** @ngInject */
    function linkFn(scope, element, attrs, formCtrl) {
      var errorObj = formCtrl.$error;

      // The form has at least one missing required value
      formCtrl.missingRequiredValue = function() {
        return errorObj.hasOwnProperty('required');
      };

      // The form has at least one visible error
      formCtrl.hasVisibleError = function() {
        var ret = false;

        Object.keys(errorObj).forEach(function(valToken) {
          errorObj[valToken].forEach(function(modelCtrl) {
            if (!modelCtrl.$validatable) {
              ret = true;
            }
          });
        });

        return ret;
      };

      // Mark validation errors visible.
      // Return true if the form is error-free and return false otherwise.
      formCtrl.readyForSubmission = function() {
        Object.keys(errorObj).forEach(function(valToken) {
          errorObj[valToken].forEach(function(modelCtrl) {
            modelCtrl.unsetValidatable();
          });
        });

        return Object.keys(errorObj).length === 0;
      };
    }
  }

})();
