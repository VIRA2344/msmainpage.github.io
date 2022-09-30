import * as THREE from "./three.module.js";
import {OrbitControls} from "./OrbitControls.js";
var renderer,
  scene,
  camera,
  galaxy,
  strokes,
  dots,
  dotStrokes,
  dotsMaterial,
  strokesMaterial;

var ww = window.innerWidth,
  wh = window.innerHeight;

var positions = [];
for (var x = 0; x <1000; x++) {
  var pos = {
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
    lat: 2 * Math.PI * Math.random(),
    long: Math.acos(2 * Math.random() - 1),
  };
  pos.u = Math.cos(pos.long);
  pos.sqrt = Math.sqrt(1 - pos.u * pos.u);
  positions.push(pos);
}

function init() {
  //   var download = document.createElement("a");
  //   download.setAttribute("id", "downloadButton");
  //   download.addEventListener("click", downloadImage);
  //   document.querySelector(".cr.function").appendChild(download);

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("canvas"),
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  renderer.setSize(ww, wh);
  renderer.setClearColor(0x000000);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 800, 2500);

  camera = new THREE.PerspectiveCamera(50, ww / wh, 0.1, 10000);

  camera.position.set(0, 100, 600);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  galaxy = new THREE.Object3D();
  scene.add(galaxy)

  var loader = new THREE.TextureLoader();
  loader.crossOrigin = "";
  var loader2 = new THREE.TextureLoader();
  loader2.crossOrigin = "";
  var dotTexture = loader2.load(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/127738/dotTexture.png"
  );

  dotsMaterial = new THREE.PointsMaterial({
    size: 6,
    map: dotTexture,
    transparent: true,
    opacity: 0.3,
    alphaTest: 0.1,
  });

  strokesMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
  });
  strokes = new THREE.LineSegments(new THREE.Geometry(), strokesMaterial);
  galaxy.add(strokes);
  dotStrokes = new THREE.Points(new THREE.Geometry(), dotsMaterial);
  galaxy.add(dotStrokes);

  requestAnimationFrame(render);
}

var particlesRandom = [];

function createStrokes(radius) {
  var dots = new THREE.Geometry();
  // Create vertices
  for (var i = 0; i < 1000; i++) {
    var pos = {
      x:
        (positions[i].x * 20 + radius) *
        positions[i].sqrt *
        Math.cos(positions[i].lat),
      y:
        (positions[i].y * 20 + radius) *
        positions[i].sqrt *
        Math.sin(positions[i].lat),
      z: (positions[i].z * 20 + radius) * positions[i].u,
    };
    var vector = new THREE.Vector3(pos.x, pos.y, pos.z);
    vector.amount = 0;
    dots.vertices.push(vector);
  }

  // Create segments
  var segments = new THREE.Geometry();
  for (var i = dots.vertices.length - 1; i >= 0; i--) {
    var vector = dots.vertices[i];
    for (var j = dots.vertices.length - 1; j >= 0; j--) {
      if (
        vector.amount < 3 &&
        i !== j &&
        vector.distanceTo(dots.vertices[j]) < 55
      ) {
        segments.vertices.push(vector);
        segments.vertices.push(dots.vertices[j]);
        vector.amount++;
        dots.vertices[j].amount++;
      }
    }
  }

  strokesMaterial.opacity = 0.5;
  strokesMaterial.color = new THREE.Color("#00ffff");
  strokes.geometry = segments;
  dotsMaterial.size = 5;
  dotsMaterial.opacity = 0.6;
  dotsMaterial.color = new THREE.Color("#000fff");
  dotStrokes.geometry = dots;
  dotStrokes.geometry.verticesNeedUpdate = true;

  //   if(true){

  //   } else {
  //     dotsMaterial.opacity = 0;
  //   }

  renderer.setClearColor(new THREE.Color("#000000"));
}

window.addEventListener("resize", onResize);

function onResize() {
  ww = window.innerWidth;
  wh = window.innerHeight;
  camera.aspect = ww / wh;
  camera.updateProjectionMatrix();
  renderer.setSize(ww, wh);
}


var radius = 20;
var i = 0;
var j = 0;
var isTextVisible = false;
var render = function (a) {
  requestAnimationFrame(render);
    expandSphere()
  renderer.render(scene, camera);
};


const myTimeout = setTimeout(()=>{
  init();
  document.querySelector(".nav1").style.display = 'block';
  document.querySelector(".nav2").style.display = 'block';
  document.querySelector(".nav3").style.display = 'block';
  document.querySelector(".nav4").style.display = 'block';
  document.querySelector(".title-img").style.display = 'block';
  document.querySelector(".loading-screen").style.display = 'none';
  var controls = new OrbitControls(camera, renderer.domElement)
    document.body.addEventListener( 'mousemove', ( e )=>{
        controls.handleMouseMoveRotate( e ) 
    });
}, 1000);



// var orbit;
// document.addEventListener('mousemove', function(e){
//     let scale = -0.001;
//     orbit.rotateY( e.movementX * scale );
//     orbit.rotateX( e.movementY * scale ); 
//     orbit.rotation.z = 0; //this is important to keep the camera level..
// })

// //the camera rotation pivot
// orbit = new THREE.Object3D();
// orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
// orbit.position.copy(new THREE.Vector3(0, 0, 600));
// scene.add(orbit );

// let cameraDistance = 1;
// camera.position.z = cameraDistance;
// orbit.add( camera );
function expandSphere(){
    
    if(radius<400){
        radius+= 10
        createStrokes(radius)
    }
}



// setTimeout(() => {
//   document.getElementById('container').innerHTML += `<div class="title">
//   <img src="./img/MS-22 Logo-01.png" alt="">
 
// </div>`
// isTextVisible = true;
// }, 600);


