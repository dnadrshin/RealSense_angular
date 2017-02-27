(function() {
'use strict';

    angular
        .module('3d')
        .factory('Data', Service);

    //Service.$inject = ['http'];
    function Service($http) {
        var elements = [];

        var service = {
            getData:getData,
            elements:elements
        };

        return service;

        ////////////////
        function getData() {
            return $http.get('data1.json');
         }
    }
})();