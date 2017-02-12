function RoadNode(VecOrX, Y){
	this.PosVec = new THREE.Vector2();
	if (typeof VecOrX == 'number'){
		this.PosVec.set(VecOrX, Y);
	}
	else if(typeof VecOrX == 'object'){
		this.PosVec.copy(VecOrX);
	}
	this.AdjNodes = [];
	this.NodeVisited = []; //mostly for Drawing the road
}

RoadNode.prototype.AddAdjNode = function(Node){
	this.AdjNodes.push(Node);
	this.NodeVisited.push(false);
}

RoadNode.prototype.GiveParent = function(parentNode){
	this.AddAdjNode(parentNode);
	parentNode.AddAdjNode(this);
}

//RoadNode.prototype.removeNode = 
