//this file should have no notion of what a Three.js object is, just the constants I use to represent it

//Define a whole bunch of tile states so I don't get confused by magic constants
const tileStates = {
	EMPTY : 0,
	WALL : 1,
	COIN : 2,
	MAGNET : 3,
	HEART : 4,
	LEVELUP : 5,
	PHASER : 6,
	SCRABBLER : 7,
	HUNTER : 8,
	SPEEDBOOST : 9
}

const settings = {
	
	INCREASEBY : 1.3,
	
	MINLEVEL : {
		WALL : 0,
		COIN : 0,
		HEART : 3,
		MAGNET : 4,
		SPEEDBOOST: 4,
		SCRABBLER : 5,
		PHASER : 6,
	},
	
	DENSITY : {
		WALL : 0.05,
		COIN : 0.01,
		HEART : 0.00025,
		SPEEDBOOST : 0.00025,		
		MAGNET : 0.0003,
		SCRABBLER : 0.0002,
		PHASER : 0.0002,
	},
	
    CUBESCALEDOWN : 2,
	TILEWIDTH : 16,
	HUNTERSPEED : 0.75
}

var currentLevel = {
	MAP : null,
	PLAYER : null,
	HUNTER : null,
	level : 0,
	gameEntities : [],
	collisions : [],
	speedMultiplier : 1,
	speedStopTime : 0
}

Object.freeze(tileStates);
Object.freeze(settings);

function twoDarray(x, y, fill) {
	var dx = new Array(x).fill(fill);
	for (var i = 0; i < x; i++) {
		dx[i] = new Array(y).fill(fill);
	}
	return dx;
}

transpose = m => m[0].map((x,i) => m.map(x => x[i])); //transpose an array

var finder = new PF.AStarFinder();

class mapClass {
	constructor() {
		//console.log(innerWidth, document.body.clientWidth, innerHeight);
		this.widthX = Math.floor(innerWidth / settings.TILEWIDTH);
		this.heightY = Math.floor(innerHeight / settings.TILEWIDTH);
		
		this.tiles = twoDarray(this.widthX, this.heightY, tileStates.EMPTY);
		
		this.tiles[0].fill(tileStates.WALL);
		this.tiles[this.tiles.length - 1].fill(tileStates.WALL);
		this.tiles.forEach(function(row){row[0] = tileStates.WALL; row[row.length - 1] = tileStates.WALL});
		
		this.numTiles = this.widthX * this.heightY;
		
		//First, generate all game items
		
		for (var gameItem in settings.DENSITY) {
			if (settings.MINLEVEL[gameItem] <= currentLevel.level) {
				for (var i = 0; i < this.getItemDensity(gameItem); i++) {
					var [x, y] = this.getRandomAvailablePoint();
					this.tiles[x][y] = tileStates[gameItem];
				}
			}
		}
		
		this.asArray = transpose(
			this.tiles.map(function(secondaryArray) {
				return secondaryArray.map(function(item) {
					return item == tileStates.WALL ? 1 : 0;
				});
			})
		); //I need to transpose the array otherwise pathfinding does not work in the right most third of the map (depending on screen resolution);
				
		var playerX, playerY, hunterX, hunterY, levelUpX, levelUpY;
		var stillSpawning = true;
		
		while (stillSpawning) {
			[playerX, playerY] = this.getRandomAvailablePoint();
			[hunterX, hunterY] = this.getRandomAvailablePoint();
			[levelUpX, levelUpY] = this.getRandomAvailablePoint();
			
			//Double check that the player and the hunter are not too close
			if (((playerX - hunterX) ** 2 + (playerY - hunterY) ** 2) < 5) {
				continue; //force next loop now
			}

			if (((playerX - levelUpX) ** 2 + (playerY - levelUpY) ** 2) < 5) {
				continue; //force next loop now
			}
			
			//Now make sure that they can reach each other
			if (!this.getPath(playerX, playerY, hunterX, hunterY).length) {
				continue;
			}
			
			//and that the player can level up
			if (!this.getPath(playerX, playerY, levelUpX, levelUpY).length) {
				continue;
			}
			
			stillSpawning = false; //break out of loop
		}

		this.playerX = playerX;
		this.playerY = playerY;
		this.hunterX = hunterX;
		this.hunterY = hunterY;
		this.levelUpX = levelUpX;
		this.levelUpY = levelUpY;
		
		this.tiles[levelUpX][levelUpY] = tileStates.LEVELUP;
		
		currentLevel.MAP = this;
		
		
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
	
	getPath(x1,y1,x2,y2) {
		return finder.findPath(x1, y1, x2, y2, new PF.Grid(this.asArray));
	}
	
	tileToCoords(x,y) {
		return [
			x * settings.TILEWIDTH - (settings.TILEWIDTH / 2),
			y * settings.TILEWIDTH - (settings.TILEWIDTH / 2)
		]
	}
	
	coordsToTile(x,y) {
		return [
			Math.floor((x + settings.TILEWIDTH) / settings.TILEWIDTH),
			Math.floor((y + settings.TILEWIDTH) / settings.TILEWIDTH)
		]
	}
}