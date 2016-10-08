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
        var vm = this;

        activate();

        ////////////////

        function activate() {
            var triangles = [];
            var points = [];

            
            Data.getData().then(function(result){
                var tr = result.data.triangles;
                var pt = result.data.points;

                var newEl = [];
                var trPosition = 0;
                var uniqPoint = [];

                for(var i=0,length=tr.length;i<length;i++){

                    if (uniqPoint.length<=tr[i]) {
                        newEl.push({
                            x:pt[trPosition],
                            y:pt[trPosition+1],
                            z:pt[trPosition+2],
                            tr: tr[i]
                        });
                        uniqPoint.push({
                            x:pt[trPosition],
                            y:pt[trPosition+1],
                            z:pt[trPosition+2],
                            tr: tr[i]
                        });
                        trPosition+=3;
                    } else {
                        newEl.push(uniqPoint[tr[i]])
                    }

                    if (newEl.length==3) {
                        points.push(newEl);
                        newEl=[];
                    }

                }

                drawCanvas(points);
              
            })
            
         }

         function drawCanvas(points){
             //var canvas = document.getElementById('RealSense').getContext('3d');
            var camera, scene, renderer;
            var geometry, material, mesh;
            init();
            //animate();

            function init() {

                camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 2, 10000);
                camera.position.z = 400;
                camera.lookAt(new THREE.Vector3(0, 0, 0));

                scene = new THREE.Scene();
                var newp = [];
 
                points.forEach(function(item){
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(new THREE.Vector3(item[0].x, item[0].y, item[0].z));
                    geometry.vertices.push(new THREE.Vector3(item[1].x, item[1].y, item[1].z));
                    geometry.vertices.push(new THREE.Vector3(item[2].x, item[2].y, item[2].z));
                    geometry.vertices.push(new THREE.Vector3(item[0].x, item[0].y, item[0].z));
                    var line = new THREE.Line(geometry, material);
                    scene.add(line)
                });
                renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth, window.innerHeight);

                document.body.appendChild(renderer.domElement);
                renderer.render(scene, camera);

                var render = function () {
                    requestAnimationFrame( render );

                    //scene.rotation.x += 0.1;
                    scene.rotation.y += 0.1;

                    renderer.render(scene, camera);
                };
                render();




            }


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
            return $http.get('/src/data.json')
         }
    }
})();

