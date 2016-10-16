(function() {
    'use strict';

    angular
        .module('3d')
        .directive('realSenseModelViewer', realSenseModelViewer);

    //realSenseModelViewer.$inject = ['scope'];
    function realSenseModelViewer() {
        // Usage:
        //  attrs:
        //  grid = show   - show grid
        //  viewsource = array    - show views for each array
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
            //attrs.source - var with data for visualization
            var viewSource;
            if(typeof attrs.viewsource != "undefined"){
                viewSource = attrs.viewsource;
            } else {
                viewSource = 'Data';
            };

            element[0].style.left = 0;
            element[0].style.position = 'absolute';

            scope.$parent.$watch(viewSource, function() {
            var viewData;
                if(typeof attrs.viewsource != "undefined"){
                    viewData = scope.$parent[attrs.viewsource];
                } else {
                    viewData = scope.$parent.Data;
                }

                if (typeof viewData != "undefined") {
                    if (typeof viewData.points != "undefined") {
                        if (viewData.points.length > 0) {
                            var result = viewData;
                            var convert = convertJSON(result);
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


                            var materials;

                            //
                            if(attrs.grid==="show"){
                                materials = [
                                    new THREE.MeshLambertMaterial({ opacity: 1, color: 0xe2e2e2, transparent: true }),
                                    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
                                ];
                            } else {
                                materials = [
                                    new THREE.MeshLambertMaterial({ opacity: 1, color: 0xe2e2e2, transparent: true }),
                                    //new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true })
                                ];
                            }

                            function lightScene(){
                                var ambientLight = new THREE.AmbientLight(0x383838);
                                scene.add(ambientLight);
                                var spotLight = new THREE.SpotLight( 0xffffff, 2, 600, 0.45 );
                                spotLight.position.set( 0, 250, 270 );
                                spotLight.castShadow = true;
                                scene.add( spotLight );                        
                            }
                            lightScene();

                            geometry.computeVertexNormals();
                            geometry.mergeVertices();


                            var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry,materials);
                            scene.add(mesh);

                            renderer = new THREE.WebGLRenderer({ alpha: true });
                            renderer.setSize(directiveWidth, directiveHeight);

                            element[0].appendChild(renderer.domElement);

                            

                            function moveFace(){
                                var coord;
                                var mousedown = false;



                                renderer.domElement.onmousemove = function(e){
                                    if (coord&&mousedown) {
                                        scene.rotation.y = scene.rotation.y + (coord.screenX-e.screenX)/100;
                                        scene.rotation.x = scene.rotation.x + (coord.screenY-e.screenY)/100;
                                        renderer.render(scene, camera);
                                    }
                                    coord=e;
                                }
                                
                                renderer.domElement.addEventListener('mousedown', function(){
                                    mousedown = true;
                                })
                                renderer.domElement.addEventListener('mouseup', function(){
                                    mousedown = false;
                                })
                                //requestAnimationFrame( render );

                            }


                           

                            

                            renderer.render(scene, camera);
                            moveFace();
                            var rightDirection = true;
                            //rotation cicle block
                            var render = function () {
                                requestAnimationFrame( render );


                                if(rightDirection){
                                    scene.rotation.y += 0.01;
                                    if(scene.rotation.y>=1.2){
                                       rightDirection = false; 
                                    }
                                } else {
                                    scene.rotation.y -= 0.01;
                                    if(scene.rotation.y<=-1.2){
                                       rightDirection = true; 
                                    }
                                }

                                renderer.render(scene, camera);
                            };
                            //render();
                        }
                    }
        }
    }
    /* @ngInject */
    function ControllerController () {
     
    }
})();