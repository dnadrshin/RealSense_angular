(function() {
    'use strict';

    angular
        .module('3d')
        .directive('realSenseModelViewer', realSenseModelViewer);

    //realSenseModelViewer.$inject = ['scope'];
    function realSenseModelViewer() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: ControllerController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
            }
        };
        return directive;
        
        function link(scope, element, attrs) {

            element[0].style.left = 0;
            element[0].style.position = 'absolute';

            scope.$parent.$watch('Data', function(){
                if(typeof scope.$parent.Data!="undefined"){
                    if(typeof scope.$parent.Data.points!="undefined"){
                        if(scope.$parent.Data.points.length>0){
                            var result = scope.$parent.Data;
                            var convert = convertJSON(result);
                            console.log(convert);
                            drawCanvas(convert.points, convert.faces);
                        }
                    }
                }
            })

            function convertJSON(result){
                var triangles = [];
                var points = [];
                var tr = result.triangles;
                var pt = result.points;

                /**
                 * @desc new element(triangle) witch will collect points every iteration
                 * @property {x} name position
                 * @property {y} name position
                 * @property {z} name position
                 * @property {tr} number of point
                 */
                var newEl = [];
                
                var trPosition = 0;
                /**
                 * @desc array of uniq points
                 */
                var uniqPoint = [];
                /**
                 * @description array of faces [{pointNumber1, pointNumber2, pointNumber3},{pointNumber4, pointNumber5, pointNumber6}]
                 */
                var faces = [];
                //for iteration from 0 to 3
                var facesNumber = 0;
                //temp object for faces
                var faceTemp=[];


                for(var i=0,length=tr.length;i<length;i++){


                    //make faces
                    faceTemp.push(tr[i]);
                    facesNumber++;
                    if(facesNumber>=3){
                        faces.push(faceTemp);
                        facesNumber = 0;
                        faceTemp = []
                    }
 
                    //make points
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

                return {points:points, faces:faces};
            }


            function drawCanvas(points, faces){
                console.log(faces);
                        var camera, scene, renderer;
                        var geometry, material, mesh;
                        init();

                        function init() {
                            var directiveWidth = element[0].parentNode.offsetWidth;
                            var directiveHeight = element[0].parentNode.offsetHeight;
                            camera = new THREE.PerspectiveCamera(50, directiveWidth / directiveHeight, 2, 10000);
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
                                var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, fillStyle: '#000000'});
                                var line = new THREE.Line(geometry, material);
                                scene.add(line)
                            });
                            renderer = new THREE.WebGLRenderer({ alpha: true });
                            renderer.setSize(directiveWidth, directiveHeight);

                            element[0].appendChild(renderer.domElement);
                            renderer.render(scene, camera);


                            //rotation cicle block
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
    }
    /* @ngInject */
    function ControllerController () {
     
    }
})();