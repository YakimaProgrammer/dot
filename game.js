// This is where stuff in our game will happen:
var scene = new THREE.Scene();

// This is what sees the stuff:
var aspect_ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
//camera.position.set(window.innerWidth / 2, window.innerHeight / 2,  500);
//camera.position.y = 0;
//camera.position.x = innerWidth;
//scene.add(camera);
camera.position.z = 250;
player.add(camera);

// This will draw what the camera sees onto the screen:

renderer = new THREE.CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.overflow = "hidden"; //I don't love this solution, but I can't get my computer to stop reading the total screen width/height instead of the actual width/height

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
	
	var shape = new THREE.CubeGeometry(settings.TILEWIDTH,settings.TILEWIDTH*map.heightY,settings.TILEWIDTH);
	var cover = new THREE.MeshBasicMaterial({color: colors.BLACK});
	var wall = new THREE.Mesh(shape, cover);
	wall.position.set(-settings.TILEWIDTH*1.5,settings.TILEWIDTH*map.heightY/2-settings.TILEWIDTH,0);
	wall.name = tileStates.WALL;
	currentLevel.gameEntities.push(wall);
	
	shape = new THREE.CubeGeometry(settings.TILEWIDTH,settings.TILEWIDTH*map.heightY,settings.TILEWIDTH);
	cover = new THREE.MeshBasicMaterial({color: colors.BLACK});
	wall = new THREE.Mesh(shape, cover);
	wall.position.set(map.widthX*settings.TILEWIDTH,settings.TILEWIDTH*map.heightY/2-settings.TILEWIDTH,0);
	wall.name = tileStates.WALL;
	currentLevel.gameEntities.push(wall);
	
	shape = new THREE.CubeGeometry(settings.TILEWIDTH*map.widthX + (settings.TILEWIDTH * 2.5),settings.TILEWIDTH,settings.TILEWIDTH);
	cover = new THREE.MeshBasicMaterial({color: colors.BLACK});
	wall = new THREE.Mesh(shape, cover);
	wall.position.set(settings.TILEWIDTH*(map.widthX/2) -settings.TILEWIDTH*0.75,-settings.TILEWIDTH*1.5,0);
	wall.name = tileStates.WALL;
	currentLevel.gameEntities.push(wall);
	
	shape = new THREE.CubeGeometry(settings.TILEWIDTH*map.widthX + (settings.TILEWIDTH * 2.5),settings.TILEWIDTH,settings.TILEWIDTH);
	cover = new THREE.MeshBasicMaterial({color: colors.BLACK});
	wall = new THREE.Mesh(shape, cover);
	wall.position.set(settings.TILEWIDTH*(map.widthX/2) -settings.TILEWIDTH*0.75,settings.TILEWIDTH*map.heightY-settings.TILEWIDTH*0.5,0);
	wall.name = tileStates.WALL;
	currentLevel.gameEntities.push(wall);
	
	
	var [playerX, playerY] = map.tileToCoords(map.playerX, map.playerY);
	player.position.set(playerX,playerY,0);
	
	currentLevel.gameEntities.forEach(entity => scene.add(entity));
	currentLevel.walls = currentLevel.gameEntities.filter(e => e.name == tileStates.WALL);
	
	scene.add(player);
}

buildMap();

function onCollision(gameItem) {
	switch (gameItem.name) {
		case (tileStates.COIN):
			scene.remove(gameItem);
			//increase score
			break;
		case (tileStates.LEVELUP):
			currentLevel.level++;
			scene.children.forEach(child => scene.remove(child));
			buildMap();
			break;
	}
}

//I want to render 60 frames per second (switch to request animation frame)

setInterval(function() {
	//first, where am I at?
	var playerPositionBeforeUpdate = player.position.clone();
	//now, move the player
	movePlayer();
	//next, get all collisions
	currentLevel.collisions = currentLevel.gameEntities.filter(e => squareCollide(e,player));
	currentLevel.collisions.forEach(onCollision);
	//Am I colliding with any walls?
	if (!!currentLevel.collisions.filter(c => c.name == tileStates.WALL).length) {
		//Yes? Move back
		player.position = playerPositionBeforeUpdate;
	}
	renderer.render(scene, camera);
},1000/60);


// Now, show what the camera sees on the screen:
renderer.render(scene, camera);