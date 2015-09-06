(function() {
  'use strict';

  angular
    .module('formDemo')
    /**
     * @description
     * This service acts like a directory for form instances to be registered with, so that they can be discovered by
     * and accessible to other scopes.
     */
    .service('formDelegateService', formDelegateService);

  /** @ngInject */
  function formDelegateService($q) {
    // Registered form instances
    this._formInstances = [];
    // Lookup requests that are deferred as the form instances being requested at the time were not available.
    this._deferredForms = {};

    this._registerInstance = function(instance) {
      var instances = this._formInstances;
      var deferredForms = this._deferredForms;

      instances.push(instance);

      // Check if there is deferred lookup request that is looking for the form instance being added.
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

    // Look up a form instance from the directory by its name
    this.$getByFormName = function(name) {
      var ret;
      var deferred = $q.defer();

      this._formInstances.forEach(function(instance) {
        if (!name || name === instance.$name) {
          ret = instance;
        }
      });

      // If form with the given name cannot be found at the moment, deferred the request and return a promise for that.
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
