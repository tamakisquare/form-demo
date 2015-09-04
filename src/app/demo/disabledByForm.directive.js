(function() {
  'use strict';

  angular
    .module('formDemo')
    .directive('disabledByForm', disabledByForm);

  /** @ngInject */
  function disabledByForm(formDelegateService, $q) {
    var directive = {
      restrict: 'A',
      link: disabledByFormLink,
    };

    return directive;

    /** @ngInject */
    function disabledByFormLink(scope, element, attrs) {
      var formProm = $q.when(formDelegateService.$getByFormName(attrs.disabledByForm));

      formProm.then(function(form) {
        var deregisterWatch = scope.$watch(function() {return form.$invalid;}, function ngBooleanAttrWatchAction(value) {
          attrs.$set('disabled', !!value);
        });

        scope.$on('$destroy', function() {
          deregisterWatch();
        });
      });
    }
  }

})();
