(function(){
    "use strict";

    angular.module('3d',[])
})();

(function() {
'use strict';

    angular
        .module('3d')
        .controller('VisualController', VisualController);

    //VisualController.$inject = ['Data', 'scope'];
    function VisualController(Data, $scope) {
        $scope.Data;
        var vm = this;

        activate();

        ////////////////

        function activate() {
            
            
            Data.getData().then(function(result){
                $scope.Data = result.data;
            })   
         }
    }
})();

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
            return $http.get('/src/data1.json')
         }
    }
})();