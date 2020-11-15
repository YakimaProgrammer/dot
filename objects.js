/*
grid = new PF.Grid(3,3, [
    [0,0,0],
    [0,1,0],
    [1,0,0]
    ]);

var finder = new PF.AStarFinder();
var path = finder.findPath(0, 0, 2, 2, grid);
*/


//Define a whole bunch of tile states so I don't get confused by magic constants
const tileStates = {
	EMPTY : 0,
	WALL : 1,
	COIN : 2,
	MAGNET : 3,
	HEART : 4,
	LEVELUP : 5,
	PHAZER : 6,
	SCRABBLER : 7
}

const settings = {
	
	INCREASEBY : 1.3,
	
	MINLEVEL : {
		[tileStates.WALL] : 0,
		[tileStates.COIN] : 0,
		[tileStates.HEART] : 3,
		[tileStates.MAGNET] : 5,
		[tileStates.SCRABBLER] : 7,
		[tileStates.PHAZER] : 9,
	},
	
	DENSITY : {
		[tileStates.WALL] : 0.15,
		[tileStates.COIN] : 0.1,
		[tileStates.HEART] : 0.1, 
	},
	
    CUBESCALEDOWN : 2,
}

var currentLevel = {
	MAP : null,
	PLAYER : null,
	HUNTER : null,
	level : 0
}

Object.freeze(tileStates);
Object.freeze(settings);

function twoDarray(x, y, fill) {
	var dx = new Array(x).fill(fill);
	for (var i = 0; i < y; i++) {
		dx[i] = new Array(y).fill(fill);
	}
	return dx;
}

class tileObject {
	constructor(type, posX, posY) {
		this.type = type;
		this.posX = posX;
		this.posY = posY;
	}
	
	toWallState() {
		return this.type == tileStates.WALL ? 1 : 0;
	}
}

class map {
	constructor(widthX, heightY) {
		currentLevel.MAP = this;
		
		this.widthX = widthX;
		this.heightY = heightY;
		
		this.tiles = twoDarray(widthX, heightY, tileStates.EMPTY);
		
		this.numTiles = widthX * heightY;
		
		//First, generate all game items
		
		for (var gameItem in settings.DENSITY) {
			if (settings.MINLEVEL[gameItem] >= currentLevel.level) {
				for (var i = 0; i++; i < this.getItemDensity(gameItem)) {
					var x, y = this.getRandomAvailablePoint();
					this.tiles[x][y] = gameItem;
				}
			}
		}
		
		var playerX, playerY, hunterX, hunterY;
		var stillSpawning = true;
		
		while (stillSpawning) {
			playerX, playerY = this.getRandomAvailablePoint();
			hunterX, hunterY = this.getRandomAvailablePoint();
			
			if (((playerX - hunterX) ** 2 + (playerY - hunterY) ** 2) < 5) {
				continue; //force next loop now
			} else {
				break;
			}
			
			
			
		}
		
		//Now, check that I can access the level up, and that the HUNTER can access me
		
		
	}
	
	getItemDensity(key) {
		return Math.floor((settings.DENSITY[key] * (settings.INCREASEBY ** currentLevel.level)) * this.numTiles)
	}
	
	getRandomAvailablePoint() {
		while (true) {
			var x = Math.floor(this.widthX * Math.random());
			var y = Math.floor(this.heightY * Math.random());
			
			if (this.tiles[x][y] == tileStates.EMPTY) {
				return [x,y]
			}
		}
	}
}

currentLevel.MAP = new map(50,60)