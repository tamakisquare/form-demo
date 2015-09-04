(function() {
  'use strict';

  angular
    .module('formDemo')
    .service('formDelegateService', formDelegateService);

  /** @ngInject */
  function formDelegateService($q) {
    this._formInstances = [];
    this._deferredForms = {};

    this._registerInstance = function(instance) {
      var instances = this._formInstances;
      var deferredForms = this._deferredForms;

      instances.push(instance);

      // Check if there is deferred that is looking for the form instance being added.
      if (deferredForms.hasOwnProperty(instance.$name)) {
        deferredForms[instance.$name].forEach(function(deferred) {
          deferred.resolve(instance);
        });
      }

      return function deregister() {
        var index = instances.indexOf(instance);
        if (index !== -1) {
          instances.splice(index, 1);
        }

        delete deferredForms[instance.$name];
      };
    };

    this.$getByFormName = function(name) {
      var ret;
      var deferred = $q.defer();

      this._formInstances.forEach(function(instance) {
        if (!name || name == instance.$name) {
          ret = instance;
        }
      });

      // If form with the name cannot be found at the moment, return promise.
      if (angular.isUndefined(ret)) {
        var deferredForms = this._deferredForms;

        if (!deferredForms.hasOwnProperty(name)) {
          deferredForms[name] = [];
        }

        deferredForms[name].push(deferred);
        return deferred.promise;
      }

      return ret;
    };
  }
})();
