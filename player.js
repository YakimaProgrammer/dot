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
/*
function movePlayer() {
  speedIn = movingIn.map((increasing, index) => calculateSpeed(speedIn[index],increasing));
  var collidedWalls = currentLevel.collisions.filter(c => c.name == tileStates.WALL);
  if (!!collidedWalls.length) {
	//first, move back
	player.position.x -= Math.sign(speedIn[3] - speedIn[1]);
    player.position.y -= Math.sign(speedIn[0] - speedIn[2]);

	
	//first, where am I?
	var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
	var [tileX, tileY] = currentLevel.MAP.coordsToTile(collidedWalls[0].position.x,collidedWalls[0].position.y);
	
	//now, nullify my speed in the direction of the wall (Give me a drifting against the face of the wall effect);
	
	if (tileX != playerX) {
		speedIn[3] = 0;
		speedIn[1] = 0;
	} else {
		speedIn[2] = 0;
		speedIn[0] = 0;
	}
	
	
  } else {
	//keep advancing - I'm not hitting any walls
	player.position.x += (speedIn[3] - speedIn[1]) / 5;
    player.position.y += (speedIn[0] - speedIn[2]) / 5;
  } 
}
*/
function movePlayer() {
  speedIn = movingIn.map((increasing, index) => calculateSpeed(speedIn[index],increasing));
  player.position.x += (speedIn[3] - speedIn[1]) / 5;
  player.position.y += (speedIn[0] - speedIn[2]) / 5;
}

function updatePlayer(oldPosition) {
	//Am I colliding with a wall?
	var walls = currentLevel.collisions.filter(c => c.name == tileStates.WALL);
	if (!!walls.length) {
		//Yes? Move back
		player.position = oldPosition;
		
		//detect my relation to the wall in terms of tiles
		var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
		var [tileX, tileY] = currentLevel.MAP.coordsToTile(walls[0].position.x,walls[0].position.y);
		
		//nullify my speed in the direction of the wall (Give me a drifting against the face of the wall effect);
		if (tileX != playerX) {
			speedIn[3] = 0;
			speedIn[1] = 0;
		} else {
			speedIn[2] = 0;
			speedIn[0] = 0;
		}
		
		if (tileX < playerX) {
			player.position.x += 0.5;
		} else if (tileX > playerX) {
			player.position.x -= 0.5;
		} else if (tileY < playerY) {
			player.position.y += 0.5;
		} else if (tileY > playerY) {
			player.position.y -= 0.5;
		}
		
	}
}