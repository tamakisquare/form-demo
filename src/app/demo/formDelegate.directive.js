(function() {
  'use strict';

  angular
    .module('formDemo')
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

      scope.$on('$destroy', function() {
        deregisterInstance();
      });
    }
  }

})();
