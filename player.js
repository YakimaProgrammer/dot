var movingIn = [false,false,false,false];
var speedIn = [0,0,0,0];

document.addEventListener("keydown", function(event) {
switch (event.key) {
  case 'w':
  case 'ArrowUp':
	movingIn[0] = true;
	break;
	
  case 'a':
  case 'ArrowLeft':
	movingIn[1] = true;
	break;
	
  case 's':
  case 'ArrowDown':
	movingIn[2] = true;
	break;
	
  case 'd':
  case 'ArrowRight':
	movingIn[3] = true;
	break;
	
  case 'c':
    cameraposition = (cameraposition + 1) % 2;
	if (!cameraposition) {camera.setpositiontwo()}
	else {camera.setpositionone()}
	break;
}
});

document.addEventListener("keyup", function(event) {
switch (event.key) {
  case 'w':
  case 'ArrowUp':
	movingIn[0] = false;
	break;
	
  case 'a':
  case 'ArrowLeft':
	movingIn[1] = false;
	break;
	
  case 's':
  case 'ArrowDown':
	movingIn[2] = false;
	break;
	
  case 'd':
  case 'ArrowRight':
	movingIn[3] = false;
	break;
}
});

var player = new THREE.Mesh(new THREE.CubeGeometry(SIZE*2,SIZE*2,SIZE*2), new THREE.MeshNormalMaterial());

function calculateSpeed(currentSpeed, increasing) {
  currentSpeed = currentSpeed || 0.5;
  newSpeed = Math.min(increasing ? currentSpeed * 1.2 : currentSpeed / 1.03, 5);
  return Math.max(newSpeed,0.5);
}

function movePlayer() {
  speedIn = movingIn.map((increasing, index) => calculateSpeed(speedIn[index],increasing));
  player.position.x += currentLevel.speedMultiplier * (speedIn[3] - speedIn[1]) / 5;
  player.position.y += currentLevel.speedMultiplier * (speedIn[0] - speedIn[2]) / 5;
}