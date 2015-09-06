(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @name disabledByForm
     * @restrict A
     *
     * @description
     * This directive sets the `disabled` attribute on the element if either one of the `missingRequiredValue` and
     * `hasVisibleError` functions of the accessible form, determined by the `accessToForm` directive, returns `true`.
     *
     * Note: This directive requires the `onDemandValidation` directive being applied on the corresponding form.
     *
     * @element ANY that supports the `disabled` attribute
     */
    .directive('disabledByForm', disabledByForm);

  /** @ngInject */
  function disabledByForm() {
    var directive = {
      restrict: 'A',
      require: 'accessToForm',
      link: linkFn,
    };

    return directive;

    /** @ngInject */
    function linkFn(scope, element, attrs, accessToFormCtrl) {
      accessToFormCtrl.form.then(function(form) {
        // As soon as the form promise is resolved, set up the watch on the two boolean functions of the accessible form.
        var deregisterWatch = scope.$watch(
          function() {
            return form.missingRequiredValue() || form.hasVisibleError();
          },
          function ngBooleanAttrWatchAction(value) {
            attrs.$set('disabled', !!value);
          });

        scope.$on('$destroy', function() {
          deregisterWatch();
        });
      });
    }
  }

})();
