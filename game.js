// This is where stuff in our game will happen:
var scene = new THREE.Scene();

// This is what sees the stuff:
var aspect_ratio = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 10000);
camera.position.set(window.innerWidth / 2, window.innerHeight / 2,  500);
scene.add(camera);

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
	
	currentLevel.gameEntities.forEach(entity => scene.add(entity));
}

buildMap();

// Now, show what the camera sees on the screen:
renderer.render(scene, camera);