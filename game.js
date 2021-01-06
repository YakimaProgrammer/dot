// This is where stuff in our game will happen:
var scene = new THREE.Scene();

// This is what sees the stuff:
var aspect_ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);

var cameraZ;

camera.setpositionone = function() {
	cameraZ = 250;
	camera.position.set(0,0,cameraZ);
	player.add(camera);
}

camera.setpositiontwo = function() {
	cameraZ = 500;
	camera.position.set(window.innerWidth / 2,window.innerHeight / 2,cameraZ);
	scene.add(camera);
}

camera.setpositionone();
var cameraposition = 1;

// This will draw what the camera sees onto the screen:

renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ******** START CODING ON THE NEXT LINE ********
function buildMap() {
	var map = new mapClass(); //this also registers itself to currentLevel
	for (var x = 0; x < map.tiles.length; x++) {
		for (var y = 0; y < map.tiles[0].length; y++) {
			var gameItem = tileStateToGameItem[map.tiles[x][y]]();
			if (!!gameItem) {
				var [posx, posy] = map.tileToCoords(x,y);
				gameItem.position.set(posx, posy, 0);
				currentLevel.gameEntities.push(gameItem);
			}
		}
	}
		
	//add the player
	var [playerX, playerY] = map.tileToCoords(map.playerX, map.playerY);
	player.position.set(playerX,playerY,0);
	
	//add the hunter
	var [hunterX,hunterY] = map.tileToCoords(map.hunterX,map.hunterY);
	hunter.position.set(hunterX,hunterY,0);
	
	currentLevel.gameEntities.forEach(entity => scene.add(entity));
}

buildMap();

function dispose(e) {
	if (!!e.geometry) {
		e.material.dispose();
		e.geometry.dispose();
	} else {
		e.children.forEach(c => dispose(c));
	}
	
	scene.remove(e)
}

function resetWorld() {
	currentLevel.gameEntities.forEach(e => dispose(e));
	currentLevel.gameEntities.length = 0;
	
	buildMap();
}

scene.add(hunter);
scene.add(player);

function squareCollide(shapeA, shapeB) {
	var boxA = new THREE.Box3().setFromObject(shapeA);
	var boxB = new THREE.Box3().setFromObject(shapeB);
	return boxA.intersectsBox(boxB);
}

var score = 0 
var lives = 1;
var immune = false;
var scoreholder = document.getElementById("scoreholder");
var livesholder = document.getElementById("livesholder");
var levelsholder = document.getElementById("levelholder");

function onCollision(gameItem) {
	var remove = true;
	switch (gameItem.name) {
		case (tileStates.COIN):
			score += 1;
			scoreholder.innerText = score; 
			break;
		
		case (tileStates.HEART):
			if (lives > 2) {
				remove = false;
				if (!gameItem.KILLED) {
					gameItem.KILLED = true;
					ghostifyEntitiy(gameItem);
					setTimeout(function() {
						scene.remove(gameItem);
						gameItem.position.set(-50,-50,0);
					},500);
				}
			} else {
				lives += 1;
				livesholder.innerText = lives;
			}
			break;
			
		case (tileStates.LEVELUP):
			rebuildWorldAnimation(colors.GREEN,function() {
				currentLevel.level++;
				levelsholder.innerText = currentLevel.level + 1;
			},1000);
			break;
			
		case (tileStates.WALL):
			player.position.copy(playerPositionBeforeUpdate);
			
			var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
			var [tileX, tileY] = currentLevel.MAP.coordsToTile(gameItem.position.x,gameItem.position.y);
		
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
			break;
		
		case (tileStates.MAGNET):
			var [targetX, targetY] = currentLevel.MAP.coordsToTile(gameItem.position.x,gameItem.position.y);
			currentLevel.gameEntities.forEach(function(e) {
				if (e.name == tileStates.COIN) {
					var [startX, startY] = currentLevel.MAP.coordsToTile(e.position.x,e.position.y);
					if (Math.abs(startX) == startX) { //don't try to pathfind already claimed coins
						e.PATH = currentLevel.MAP.getPath(startX,startY,targetX,targetY);
					}
				}
			});
			break;
		
		case (tileStates.SCRABBLER): //I specifically do not check if the destination location can reach the player because there should be a chance that striking one of these powerups will lock the hunter far away, then it becomes a challenge not to collect a SCRABBLER
			var [x,y] = currentLevel.MAP.getRandomAvailablePoint();
			var [destX, destY] = currentLevel.MAP.tileToCoords(x,y);
			hunter.position.set(destX,destY,0);
			break;
			
		case (tileStates.PHASER): //I do check whether the end position is valid, otherwise the player can not play the game.
			var levelup = currentLevel.gameEntities.filter(e => e.name == tileStates.LEVELUP)[0];
			var [destX,destY] = currentLevel.MAP.coordsToTile(levelup.position.x,levelup.position.y);
			do {
				var [x,y] = currentLevel.MAP.getRandomAvailablePoint();
				var [playerX, playerY] = currentLevel.MAP.tileToCoords(x,y);
				player.position.set(playerX,playerY,0);
			} while (!currentLevel.MAP.getPath(x,y,destX,destY).length);
			break;
		
		case (tileStates.SPEEDBOOST):
			var t = clock.getElapsedTime();
			currentLevel.speedStopTime = t + 5;
			break;
	}
	if ((gameItem.name != tileStates.WALL) && remove) {
		scene.remove(gameItem); //hide the item
		gameItem.position.set(-50,-50,0); //move the item outside of the map so I don't keep hitting it
	}
}

//I want to render 60 frames per second (switch to request animation frame)

var clock = new THREE.Clock();
var playerPositionBeforeUpdate;
var gamePaused = false;

function rebuildWorldAnimation(color,callback,time=2500) {
	gamePaused = true;
	currentLevel.gameEntities.forEach(e => ghostifyEntitiy(e));
	if (color) scene.background = new THREE.Color(color);
	setTimeout(function() {
		if (callback) callback();
		resetWorld();
		scene.background = null;
		gamePaused = false;
		immune = false;
		camera.position.z = cameraZ;
		speedIn = [0,0,0,0]; //Stop all of my motion
	},time);
}

function hideOutOfViewObjects() {
	var frustum = new THREE.Frustum();
	var cameraViewProjectionMatrix = new THREE.Matrix4();

	camera.updateMatrixWorld();
	cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
	frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
	debugger;
	currentLevel.gameEntities.forEach(function(e) {
		e.visible = frustum.intersectsBox(new THREE.Box3().setFromObject(e)) //my visibility is determined by whether or not you can see me!
	});
}

setInterval(function() {
	if (gamePaused) {
		camera.position.z -= camera.position.z / 2500; 
	} else {
		//first, where am I at?
		playerPositionBeforeUpdate = player.position.clone(); 
		//now, move the player
		movePlayer();
		//next, get all collisions
		currentLevel.collisions = currentLevel.gameEntities.filter(e => squareCollide(e,player));
		currentLevel.collisions.forEach(onCollision); //Unmoves player if necessary
		
		//Move the hunter
		updateHunter(); //Pathfinding is updated in another loop

		//Now, check if I am colliding with the DEATHAURA
		if (squareCollide(deathAura,player)) {
			if (!immune) {
				lives -= 1;
				livesholder.innerText = lives; 
				immune = true;
				currentLevel.gameEntities.forEach(e => ghostifyEntitiy(e));
				if (lives > 0) {
					rebuildWorldAnimation();
				} else {
					rebuildWorldAnimation(colors.REDGAMEOVER, function() {
						lives = 1;
						score = 0;
						currentLevel.level = 0;
						
						levelsholder.innerText = 1;
						livesholder.innerText = 1;
						scoreholder.innerText = 0;
					});
					
				}
			}
		}
		
		//Now, rotate all coins, power ups
		var t = clock.getElapsedTime();
		currentLevel.gameEntities.forEach(function(e) {
			if (!(e.name == tileStates.WALL || e.name == tileStates.HUNTER)) {
				e.rotation.set(t,t*2,0);
			}
		});
		
		//If any coins need to be moved, move them
		currentLevel.gameEntities.forEach(function(e) {
			if (!!e.PATH && !!e.PATH.length) {
				var [oldX,oldY] = e.PATH.shift();
				var [newX,newY] = currentLevel.MAP.tileToCoords(oldX,oldY);
				e.position.set(newX,newY,0);
				
			}
		});
		
		//Check if the player still has a speed boost effect
		if (currentLevel.speedStopTime < t) {
			currentLevel.speedMultiplier = 1;
		} else {
			currentLevel.speedMultiplier = 2;
		}
		
		//Hide non-visible objects
		//hideOutOfViewObjects();
	}
	renderer.render(scene, camera);
},1000/60);


// Now, show what the camera sees on the screen:
renderer.render(scene, camera);