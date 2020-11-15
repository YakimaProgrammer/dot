// This is where stuff in our game will happen:
var scene = new THREE.Scene();

// This is what sees the stuff:
var aspect_ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
camera.position.z = 500;
scene.add(camera);

// This will draw what the camera sees onto the screen:

renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.overflow = "hidden"; //I don't love this solution, but I can't get my computer to stop reading the total screen width/height instead of the actual width/height

// ******** START CODING ON THE NEXT LINE ********
//this is just me flexing
var shapes = [newCoin(), newCoinMagnet(),newSpeedBoost(),newLevelUp(),newPhase(),newScrabbler(),newHeart()];
shapes.forEach(function(item,index) {
  scene.add(item);
  item.position.set((index-3) * 150,0,0)
});

var clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  var t = clock.getElapsedTime();
  shapes.forEach(shape => shape.rotation.set(t,t*2,0));
  renderer.render(scene, camera);
}

animate();

// Now, show what the camera sees on the screen:
renderer.render(scene, camera);