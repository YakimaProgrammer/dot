// This is where stuff in our game will happen:
var scene = new THREE.Scene();

// This is what sees the stuff:
var aspect_ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);

camera.setpositionone = function() {
	camera.position.z = 250;
	player.add(camera);
}

camera.setpositiontwo = function() {
	camera.position.set(window.innerWidth / 2,window.innerHeight / 2,500);
	scene.add(camera);
}

camera.setpositionone();

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
	
	//Now create the bounding box
	
	//x
	var wall;
	for (var i = 0; i < map.tiles[0].length; i++) {
		wall = newWall();
		var [x, y] = map.tileToCoords(0,i);
		wall.position.set(x,y,0);
		wall.name = tileStates.WALL;
		currentLevel.gameEntities.push(wall);
		
		wall = newWall();
		var [x, y] = map.tileToCoords(map.tiles.length,i);
		wall.position.set(x,y,0);
		wall.name = tileStates.WALL;
		currentLevel.gameEntities.push(wall);
	}
	
	//y
	for (var i = 0; i < map.tiles.length+1; i++) {
		wall = newWall();
		var [x, y] = map.tileToCoords(i,0);
		wall.position.set(x,y,0);
		wall.name = tileStates.WALL;
		currentLevel.gameEntities.push(wall);
		
		wall = newWall();
		var [x, y] = map.tileToCoords(i,map.tiles[0].length);
		wall.position.set(x,y,0);
		wall.name = tileStates.WALL;
		currentLevel.gameEntities.push(wall);
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

function resetWorld() {
	/* currentLevel.gameEntities.forEach(function(e) {
		if (!!e.geometry) {
			e.material.dispose();
			e.geometry.dispose();
		} else {
			e.children.forEach(function(c) {
				c.material.dispose();
				c.geometry.dispose();
			});
		}
		scene.remove(e)
	}); */
	currentLevel.gameEntities.forEach(e => scene.remove(e));
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
	switch (gameItem.name) {
		case (tileStates.COIN):
			score += 1;
			scoreholder.innerText = score; 
			break;
		
		case (tileStates.HEART):
			lives += 1;
			livesholder.innerText = lives; 
			break;
			
		case (tileStates.LEVELUP):
			currentLevel.level++;
			levelsholder.innerText = currentLevel.level + 1;
			resetWorld();
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
	}
	
	if (gameItem.name != tileStates.WALL) {
		scene.remove(gameItem); //hide the item
		gameItem.position.set(-50,-50,0); //move the item outside of the map so I don't keep hitting it
	}
}

//I want to render 60 frames per second (switch to request animation frame)

var clock = new THREE.Clock();
var playerPositionBeforeUpdate;
var gameOver = false;


setInterval(function() {
	//short circuit check: is the game over?
	if (gameOver) {
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
					setTimeout(function() {
						resetWorld();
						immune = false;
					},1000);
				} else {
					ghostifyEntitiy(hunter);
					ghostifyEntitiy(deathAura);
					scene.background = new THREE.Color(colors.REDGAMEOVER);
					gameOver = true;
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
	}
	renderer.render(scene, camera);
},1000/60);


// Now, show what the camera sees on the screen:
renderer.render(scene, camera);