var hunter = new THREE.Mesh(new THREE.CubeGeometry(SIZE*2,SIZE*2,SIZE*2), new THREE.MeshNormalMaterial({color : colors.RED}));
var hunterSpeedIn = [0,0];

setInterval(function() {
	console.log(hunter.position);
	
	var [hunterX, hunterY] = currentLevel.MAP.coordsToTile(hunter.position.x,hunter.position.y);
	var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
	
	currentLevel.PATH = currentLevel.MAP.getPath(hunterX,hunterY,playerX,playerY);
},1000/2); //Refresh pathfinding every 1/2 second

function updateHunter() {
	var [hunterX, hunterY] = currentLevel.MAP.coordsToTile(hunter.position.x,hunter.position.y);
	var [playerX, playerY] = currentLevel.MAP.coordsToTile(player.position.x,player.position.y);
		
	hunterSpeedIn = [
		playerX < hunterX ? -settings.HUNTERSPEED : settings.HUNTERSPEED,
		playerY < hunterY ? -settings.HUNTERSPEED : settings.HUNTERSPEED
	];
	
	if (playerX == hunterX) hunterSpeedIn[0] = 0;
	if (playerY == hunterY) hunterSpeedIn[1] = 0;
	
	hunter.position.x += hunterSpeedIn[0];
	hunter.position.y += hunterSpeedIn[1];
	
}