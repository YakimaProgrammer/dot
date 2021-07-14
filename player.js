var movingIn = [false,false,false,false];
var speedIn = [0,0,0,0];

//If someone starts playing with the keyboard, disable tilt controls
var anyKeyPressed = false;

function playerInitiatedPause() {
    gamePausedOverlay.style.display = "block";
    gamePaused = !gamePaused;
	camera.position.z = cameraZ;
}

document.addEventListener("keydown", function(event) {
    anyKeyPressed = true;
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
	  
	  case 'Escape':
		playerInitiatedPause()
	}
});

document.addEventListener("keyup", function(event) {
    anyKeyPressed = true;
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

document.addEventListener("click", function() {
    playerInitiatedPause();
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

//Allow tilting the device to control the player

function accelerometer(e) {
    if (!anyKeyPressed) {
        //x,y,z from the accelerometer's reference point, not mine
        var y = e.beta || e.y || e.acceleration.y;
        var z = e.gamma || e.z || e.acceleration.z;
        
        if (y < -25) {
            y = -25;
        }
        
        if (y > 25) {
            y = 25;
        }
        
        if (z < -25) {
            z = -25;
        }
        
        if (z > 25) {
            z = 25;
        }
        
        z /= 25;
        y /= 25;
        
        if (z < 0) {
            movingIn[3] = 0;
            movingIn[1] = Math.abs(z);
        } else {
            movingIn[1] = 0;
            movingIn[3] = Math.abs(z);
        }
        
        if (y < 0) {
            movingIn[2] = 0;
            movingIn[0] = Math.abs(y);
        } else {
            movingIn[0] = 0;
            movingIn[2] = Math.abs(y);
        }
    }
}

function getAccel(){
    DeviceMotionEvent.requestPermission().then(response => {
        if (response == 'granted') {
            window.addEventListener("deviceorientation", accelerometer);
            window.addEventListener("MozOrientation", accelerometer);
            window.addEventListener("devicemotion", accelerometer);
        }
        tiltExplination.style.display = "none";
    });
}
try {
    getAccel();
} catch {
    //Should might work for Android devices
    if (!!window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", accelerometer);
    }
}