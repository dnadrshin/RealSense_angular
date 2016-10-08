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
                //temp object for faces
                var faceTemp=[];
                var pointTemp=[];


                for(var i=0,length=tr.length;i<length;i++){

                    //make faces
                    faceTemp.push(tr[i]);
                    if(!((i+1)%3)){
                        faces.push(faceTemp);
                        faceTemp = [];
                    }
                }

                for(var i=0,length=pt.length;i<length;i++){
                    //make faces
                    pointTemp.push(pt[i])
                    if(!((i+1)%3)){
                        points.push(pointTemp);
                        pointTemp =[];
                    }

 
                    //make points


                    // if (uniqPoint.length<=tr[i]) {
                    //     newEl.push({
                    //         x:pt[trPosition],
                    //         y:pt[trPosition+1],
                    //         z:pt[trPosition+2],
                    //         tr: tr[i]
                    //     });
                    //     uniqPoint.push({
                    //         x:pt[trPosition],
                    //         y:pt[trPosition+1],
                    //         z:pt[trPosition+2],
                    //         tr: tr[i]
                    //     });
                    //     trPosition+=3;
                    // } else {
                    //     newEl.push(uniqPoint[tr[i]])
                    // }

                    // if (newEl.length==3) {
                    //     points.push(newEl);
                    //     newEl=[];
                    // }
                }

                return {points:points, faces:faces};
            }


            function drawCanvas(points, faces){
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
                            var geometry = new THREE.Geometry();
                            points.forEach(function(item){
                                geometry.vertices.push(new THREE.Vector3(item[0], item[1], item[2]));
                            });
                            faces.forEach(function(item){
                                geometry.faces.push(new THREE.Face3(item[0], item[1], item[2]));
                            });


                            //var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide, fillStyle: '#000000'});

                            var materials = [
                                new THREE.MeshLambertMaterial( { opacity:0.6, color: 0x44ff44, transparent:true } ),
                                new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )
                            ];

                            var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry,materials);
                            scene.add(mesh);

                            //var line = new THREE.Line(geometry, materials);
                            //scene.add(line)
                            renderer = new THREE.WebGLRenderer({ alpha: true });
                            renderer.setSize(directiveWidth, directiveHeight);

                            element[0].appendChild(renderer.domElement);
                            renderer.render(scene, camera);


                            //rotation cicle block
                            var render = function () {
                                requestAnimationFrame( render );

                                //scene.rotation.x += 0.1;
                                scene.rotation.y += 0.01;

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