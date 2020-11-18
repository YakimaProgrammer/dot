function squareCollide(shapeA, shapeB) {
	computeBoundingBox(shapeA);
	computeBoundingBox(shapeB);
  
	var boxA = {min : shapeA.localToWorld(shapeA.geometry.boundingBox.min), max : shapeA.localToWorld(shapeA.geometry.boundingBox.max)}
	var boxB = {min : shapeB.localToWorld(shapeB.geometry.boundingBox.min), max : shapeB.localToWorld(shapeB.geometry.boundingBox.max)}
		
	return boxA.max.x < boxB.min.x || boxA.min.x > boxB.max.x ||
		boxA.max.y < boxB.min.y || boxA.min.y > boxB.max.y ||
		boxA.max.z < boxB.min.z || boxA.min.z > boxB.max.z ? false : true;
}

THREE.Object3D.prototype.geometry = {
	boundingBox : null
}

function computeBoundingBox(shape) {
	shape.updateMatrixWorld();
	try {
		shape.geometry.computeBoundingBox();
	} catch {
		shape.children[0].geometry.computeBoundingBox();
		var overallBox = shape.children[0].geometry.boundingBox;
		
		for (child of shape.children.slice(1)) {
			child.geometry.computeBoundingBox();
			var currentBox = child.geometry.boundingBox;
			
			for (f of [Math.min, Math.max]) {
				for (d in ['x','y','z']) {
					overallBox[f.name][d] = f(overallBox[f.name][d],currentBox[f.name][d]);
				}
			}
		}
		
		shape.geometry.boundingBox = overallBox;
	}
}