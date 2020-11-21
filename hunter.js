var hunter = new THREE.Mesh(new THREE.CubeGeometry(SIZE*2,SIZE*2,SIZE*2), new THREE.MeshBasicMaterial({color : colors.RED}));
var hunterSpeedIn = [0,0];

setInterval(function() {
	var [hunterX, hunterY] = currentLevel.MAP.coordsToTile(hunter.position.x,hunter.position.y);
	var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
	
	currentLevel.PATH = currentLevel.MAP.getPath(hunterX,hunterY,playerX,playerY);
},1000/2); //Refresh pathfinding every 1/2 second

function updateHunter() {
	var [hunterX, hunterY] = currentLevel.MAP.coordsToTile(hunter.position.x,hunter.position.y);
	//var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
	try {
		var [destX, destY] = currentLevel.PATH[0];
	} catch (error) {
		return; //don't move, currentLevel.PATH will be initiated in a couple of milliseconds 
	}
	if (destX == hunterX && destY == hunterY) {
		//first, re-center me in the tile
		var [x,y] = currentLevel.MAP.tileToCoords(destX,destY);
		//hunter.position.set(x,y,0);
		
		//now, get the next destination tile
		currentLevel.PATH.shift();
		var [destX, destY] = currentLevel.PATH[0];
		
	}
	
	hunterSpeedIn = [
		destX < hunterX ? -settings.HUNTERSPEED : settings.HUNTERSPEED,
		destY < hunterY ? -settings.HUNTERSPEED : settings.HUNTERSPEED
	];
	
	if (destX == hunterX) hunterSpeedIn[0] = 0;
	if (destY == hunterY) hunterSpeedIn[1] = 0;
	
	hunter.position.x += hunterSpeedIn[0];
	hunter.position.y += hunterSpeedIn[1];
	
}