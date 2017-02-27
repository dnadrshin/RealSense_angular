(function() {
'use strict';

    angular
        .module('3d')
        .controller('VisualController', VisualController);

    //VisualController.$inject = ['Data', 'scope'];
    function VisualController(Data, $scope) {
        $scope.Data;
        activate();

        ////////////////

        function activate() {
            Data.getData().then(function(result){
                $scope.Data = result.data;
            });
         }
    }
})();
