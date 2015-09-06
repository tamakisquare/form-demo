(function() {
  'use strict';

  angular
    .module('formDemo')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/main',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('demo', {
        url: '/',
        templateUrl: 'app/demo/demo.html',
        controller: 'DemoController',
        controllerAs: 'demoVm'
      });


    $urlRouterProvider.otherwise('/');
  }

})();
