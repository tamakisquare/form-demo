(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @name serverValidation
     * @restrict A
     *
     * @description
     * This directive enhances form controller to make backend validation errors behave the same as how frontend
     * validation errors behave and being handled, from user's perspective. Keep in mind that this directive
     * deals only with validation errors that are field-specific. Non-field validation errors from the backend are
     * possible and they should be handled separately and manually.
     *
     * Note: This directive requires the `validateOnlyCorrection` directive being applied on contained inputs of
     * the form.
     *
     * @param {promise} serverValidation Promise object from the $http call used to submit the request.
     *
     * @element FORM
     */
    .directive('serverValidation', serverValidation);

  /** @ngInject */
  function serverValidation($log, $q) {
    var directive = {
      restrict: 'A',
      require: 'form',
      link: linkFn,
    };

    return directive;

    /** @ngInject */
    function linkFn(scope, element, attrs, formCtrl) {
      scope.$watchCollection(attrs.serverValidation, function(httpPromise) {
        if (angular.isUndefined(httpPromise)) {return;}

        if (!httpPromise.then || typeof httpPromise.then !== 'function') {
          $log.error('`httpPromise` is not a Promise object');
          return;
        }

        httpPromise.catch(function(resp) {
          // Names of the controls whose values failed server validation
          var namesWithServerError = [];

          // Object whose keys denote form control names and values are the corresponding error messages resulting from server validation.
          scope.serverErrors = {};

          // If it's validation type of errors then process them
          if ((resp.status === 400)) {
            // handles only field errors
            angular.forEach(resp.data, function(errs, fieldName) {
              // nonFieldError is not handled; it should be handled manually.
              if (fieldName === 'nonFieldErrors') { return; }

              namesWithServerError.push(fieldName);
              formCtrl[fieldName].$setValidity('server', false);
              formCtrl[fieldName].unsetValidatable();

              // It's rare for a field to have more than one validation error, so I am making
              // an assumption here.
              // Assumption: Every field, at most, has one server validation error.
              scope.serverErrors[fieldName] = errs[0];
            });

            element.on('input', errorFieldValueChanged);

            scope.$on('$destroy', function() {
              element.off('input', errorFieldValueChanged);
            });
          }

          return $q.reject(resp);

          function errorFieldValueChanged(event) {
            var inputName = event.srcElement.name;
            var targetIndex = namesWithServerError.indexOf(inputName);

            if (targetIndex === -1) { return; }

            scope.$apply(function() {
              formCtrl[inputName].$setValidity('server', true);
              scope.serverErrors[inputName] = '';

              namesWithServerError.splice(targetIndex, 1);

              if (namesWithServerError.length === 0) {
                element.off('input', errorFieldValueChanged);
              }
            });
          }
        });
      });
    }
  }
})();
