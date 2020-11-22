const SIZE = 4;

const colors = {
  RED : 0xe60b0b,
  GRAY : 0x695c5c,
  ORANGE : 0xf08e0e,
  YELLOW : 0xffff21,
  GREEN : 0x30c702,
  BLUE : 0x0335ff,
  BLACK : 0x000000,
  REDGAMEOVER : 0xff4747
};

function newMagnet() {
  var shape, cover, origin, sidePillar, sign;
  var size = SIZE / 1.25;
  origin = new THREE.Object3D();
  //origin.position.set(0,-size*2,0);

  shape = new THREE.CubeGeometry(size*2,size,size);
  cover = new THREE.MeshBasicMaterial({color: colors.RED});
  sidePillar = new THREE.Mesh(shape, cover);
  sidePillar.position.set(0,-size*2,0);
  origin.add(sidePillar);
  
  for (sign of [-1, 1]) {
    shape = new THREE.CubeGeometry(size,size*2,size);
    cover = new THREE.MeshBasicMaterial({color: colors.RED});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*1.5*sign,-size*0.5,0);
    origin.add(sidePillar);
    
    shape = new THREE.CubeGeometry(size,size,size);
    cover = new THREE.MeshBasicMaterial({color: colors.GRAY});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*1.5*sign,size,0);
    origin.add(sidePillar);
  }
  
  return origin;
}

function newCoin(size = SIZE/2) {
  var shape, cover, origin, sidePillar, sign;
  
  origin = new THREE.Object3D();
  
  shape = new THREE.CubeGeometry(size,size*3,size);
  cover = new THREE.MeshBasicMaterial({color: colors.ORANGE});
  sidePillar = new THREE.Mesh(shape, cover);
  origin.add(sidePillar);
  
  for (sign of [-1,1]) {
    shape = new THREE.CubeGeometry(size*2,size*3,size);
    cover = new THREE.MeshBasicMaterial({color: colors.YELLOW});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*1.5*sign,0,0);
    origin.add(sidePillar);
    
    shape = new THREE.CubeGeometry(size*3,size,size);
    cover = new THREE.MeshBasicMaterial({color: colors.YELLOW});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(0,size*2*sign,0);
    origin.add(sidePillar);
  }
  origin.name = tileStates.COIN;
  return origin;
}

function newCoinMagnet() {
  var origin = newMagnet();
  origin.add(newCoin(SIZE/3));
  origin.name = tileStates.MAGNET;
  return origin;
}

function newSpeedBoost() {
  var shape, cover, origin, sidePillar, leadingCube, trailingCube, i, x;
  var currentColor = [colors.RED,colors.YELLOW,colors.GREEN];
  var size = SIZE / 3.5; //this thing is HUGE! Let's scale it down a bit!
  origin = new THREE.Object3D();
  
  for (i = 0; i < 6; i++) {
    shape = new THREE.CubeGeometry(size,size,size);
    cover = new THREE.MeshBasicMaterial({color: currentColor[Math.abs(i % 3)]});
    leadingCube = new THREE.Mesh(shape, cover);
    leadingCube.position.set(size*i,0,0);
    
    for (x = 0; x < 6; x++) {
      shape = new THREE.CubeGeometry(size,size,size);
      cover = new THREE.MeshBasicMaterial({color: currentColor[Math.abs(i % 3)]});
      trailingCube = new THREE.Mesh(shape, cover);
      trailingCube.position.set(-size*x,size*x,0);
      leadingCube.add(trailingCube);
      
      shape = new THREE.CubeGeometry(size,size,size);
      cover = new THREE.MeshBasicMaterial({color: currentColor[Math.abs(i % 3)]});
      trailingCube = new THREE.Mesh(shape, cover);
      trailingCube.position.set(-size*x,-size*x,0);
      leadingCube.add(trailingCube);
    }
    
    origin.add(leadingCube);
  }    
  origin.name = tileStates.SPEEDBOOST;
  return origin;
}

function newLevelUp() {
  var shape, cover, origin, sidePillar, i, plus, sign;
  var size = SIZE / 3;
  origin = new THREE.Object3D();
  
  shape = new THREE.CubeGeometry(size,size*10,size);
  cover = new THREE.MeshBasicMaterial({color: colors.GREEN});
  sidePillar = new THREE.Mesh(shape, cover);
  origin.add(sidePillar);
  
  for (i = 0; i < 5; i++) {
    shape = new THREE.CubeGeometry(size*(9-2*i),size,size);
    cover = new THREE.MeshBasicMaterial({color: colors.GREEN});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(0,size*i,0);
    origin.add(sidePillar);
  }
  
  for (sign of [-1,1]) {
    shape = new THREE.CubeGeometry(size,size*3,size);
    cover = new THREE.MeshBasicMaterial({color: colors.YELLOW});
    plus = new THREE.Mesh(shape, cover);
    
    shape = new THREE.CubeGeometry(size*3,size,size);
    cover = new THREE.MeshBasicMaterial({color: colors.YELLOW});
    plus.add(new THREE.Mesh(shape, cover));
  
    plus.position.set(size*3*sign,size*-3,0);
    origin.add(plus);
  }    
  
  origin.name = tileStates.LEVELUP;
  return origin;
}

function newCube() {
  var shape, cover, origin, sidePillar, signX, signY, signZ;
  var size = SIZE / settings.CUBESCALEDOWN;
  origin = new THREE.Object3D();
  
  for (signZ of [-1, 1]) {
    for (signY of [-1,1]) {
      shape = new THREE.CubeGeometry(size*3,size,size);
      cover = new THREE.MeshBasicMaterial({color: colors.BLUE});
      sidePillar = new THREE.Mesh(shape, cover);
      sidePillar.position.set(0,size*2*signY,size*2*signZ);
      origin.add(sidePillar);
    }
    
    for (signX of [-1,1]) {
      shape = new THREE.CubeGeometry(size,size*3,size);
      cover = new THREE.MeshBasicMaterial({color: colors.BLUE});
      sidePillar = new THREE.Mesh(shape, cover);
      sidePillar.position.set(size*2*signX,0,size*2*signZ);
      origin.add(sidePillar);
    }
  }
  
  for (signX of [-1,1]) {
    for (signY of [-1,1]) {
      shape = new THREE.CubeGeometry(size,size,size*3);
      cover = new THREE.MeshBasicMaterial({color: colors.BLUE});
      sidePillar = new THREE.Mesh(shape, cover);
      sidePillar.position.set(size*2*signY,size*2*signX,0);
      origin.add(sidePillar);
    }
  }
  
  return origin;
}


function newPhase() {
  var origin, shape, cover, cube, signZ;
  var size = SIZE / settings.CUBESCALEDOWN;
  origin = newCube();
  shape = new THREE.CubeGeometry(size*3-1,size*3-1,size);
  cover = new THREE.MeshBasicMaterial({color: colors.BLACK});
  origin.add(new THREE.Mesh(shape, cover));
  
  for (signZ of [-1,1]) {
    shape = new THREE.CubeGeometry(size/2,size/2,size/2);
    cover = new THREE.MeshBasicMaterial({color: colors.GREEN});
    cube = new THREE.Mesh(shape, cover);
    cube.position.set(0,0,size*signZ);
    origin.add(cube);
  } 
  origin.name = tileStates.PHASE;
  return origin;
}

function randomPositiveOrNegative() {
  return Math.random() * (!!Math.round(Math.random()) ? 1 : -1);
}

function newScrabbler() {
  var origin, shape, cover, cube, i;
  var size = SIZE / settings.CUBESCALEDOWN;
  origin = newCube();
  
  for (i = 0; i < 10; i++) {
    shape = new THREE.CubeGeometry(size/2,size/2,size/2);
    cover = new THREE.MeshBasicMaterial({color: colors.RED});
    cube = new THREE.Mesh(shape, cover);
    cube.position.set(
      size * 1.25 * randomPositiveOrNegative(),
      size * 1.25 * randomPositiveOrNegative(),
      size * 1.25 * randomPositiveOrNegative()
    );
    
    cube.rotation.set(
      Math.PI * randomPositiveOrNegative() * 2,
      Math.PI * randomPositiveOrNegative() * 2,
      Math.PI * randomPositiveOrNegative() * 2
    );
    origin.add(cube);
  } 
  origin.name = tileStates.SCRABBLER;
  return origin;
}

function newHeart() {
  var origin, shape, cover, sidePillar, signX;
  var size = SIZE / 3.25;
  origin = new THREE.Object3D();
  
  shape = new THREE.CubeGeometry(size,size*7,size);
  cover = new THREE.MeshBasicMaterial({color: colors.RED});
  sidePillar = new THREE.Mesh(shape, cover);
  sidePillar.position.set(0,-size*1.5,0);
  origin.add(sidePillar);
  
  for (signX of [-1,1]) {
    shape = new THREE.CubeGeometry(size,size*8,size);
    cover = new THREE.MeshBasicMaterial({color: colors.RED});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*signX,0,0);
    origin.add(sidePillar);
    
    shape = new THREE.CubeGeometry(size,size*7,size);
    cover = new THREE.MeshBasicMaterial({color: colors.RED});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*2*signX,size*.5,0);
    origin.add(sidePillar);
    
    shape = new THREE.CubeGeometry(size,size*6,size);
    cover = new THREE.MeshBasicMaterial({color: colors.RED});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*3*signX,size,0);
    origin.add(sidePillar);
    
    shape = new THREE.CubeGeometry(size,size*4,size);
    cover = new THREE.MeshBasicMaterial({color: colors.RED});
    sidePillar = new THREE.Mesh(shape, cover);
    sidePillar.position.set(size*4*signX,size,0);
    origin.add(sidePillar);
  }    
  
  origin.name = tileStates.HEART;
  return origin;
}

function newWall() {
	var shape = new THREE.CubeGeometry(settings.TILEWIDTH,settings.TILEWIDTH,settings.TILEWIDTH);
    var cover = new THREE.MeshBasicMaterial({color: colors.BLACK});
    var cube = new THREE.Mesh(shape, cover);
	cube.name = tileStates.WALL;
	return cube;
}

const tileStateToGameItem = {
	[tileStates.EMPTY] : function(){},
	[tileStates.WALL] : newWall,
	[tileStates.COIN] : newCoin,
	[tileStates.MAGNET] : newCoinMagnet,
	[tileStates.HEART] : newHeart,
	[tileStates.LEVELUP] : newLevelUp,
	[tileStates.PHASER] : newPhase,
	[tileStates.SCRABBLER] : newScrabbler
}