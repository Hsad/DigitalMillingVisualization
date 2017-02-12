function LSystem(){
	this.stack = [];
	this.cityCenter = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
	this.roadDistance = 0.05;
	this.origin = new RoadNode(0,0);
	this.col = new Collision();
}

LSystem.prototype.Seed = function(){
	var uhh = {
		name: "Forward",
		angleVec: new THREE.Vector2(1,0),
		oldNode: this.origin,
		decay: 90
	};
	this.stack.push(uhh);
	var uh = {
		name: "Forward",
		angleVec: new THREE.Vector2(0,1),
		oldNode: this.origin,
		decay: 70
	};
	//this.stack.push(uh);
	var hh = {
		name: "Forward",
		angleVec: new THREE.Vector2(-1,-1),
		oldNode: this.origin,
		decay: 70
	};
	//this.stack.push(hh);
	var hh = {
		name: "ForwardOnly",
		angleVec: new THREE.Vector2(0.5,0.5),
		oldNode: this.origin,
		decay: 70
	};
	this.stack.push(hh);
	var hhh = {
		name: "ForwardOnly",
		angleVec: new THREE.Vector2(-0.5,0.8),
		oldNode: this.origin,
		decay: 70
	};
	//this.stack.push(hhh);
	var ghh = {
		name: "ForwardOnly",
		angleVec: new THREE.Vector2(0.3,-0.5),
		oldNode: this.origin,
		decay: 70
	};
	//this.stack.push(ghh);
}

LSystem.prototype.Expand = function(steps){
	//if steps is undefined, steps = 1
	steps = steps || 1;
	while (steps > 0){
		//for n steps in a single render call, calculate that many rules
		steps--;
		if (this.stack.length > 0){
			var rule = this.stack.shift();
			this.UseRule(rule);
		}
	}
}

LSystem.prototype.UseRule = function(rule){
	//rule();  //If that is doable that would be swell
	if (rule.name == "Forward"){
		//look at current node, look at someother peice of data, add another segment of road
		this.Forward(rule);
	} else if (rule.name == "ForwardOnly"){
		//look at current node, look at someother peice of data, add another segment of road
		this.ForwardOnly(rule);
	} else if (rule.name == "Concentric"){
		this.Concentric(rule);
	}
}

LSystem.prototype.Concentric = function(rule){
	if (rule.decay <= 0){ //Doesn't seem to mind if rule.decay doesn't exist
		return null;
	} else{
		rule.decay--;
	}
	var oldNodeLoc = rule.oldNode.PosVec;

	//this takes into account the city origin not being (0, 0)
	var centToOldNode = new THREE.Vector2(
			oldNodeLoc.x - this.origin.PosVec.x, 
			oldNodeLoc.y - this.origin.PosVec.y);

	var ab = centToOldNode.lengthSq(); //counts as a*a or b*b
	var c = this.roadDistance;
	var ang = Math.acos((ab + ab - c*c) / (2*ab));


	var perpToOrigin = new THREE.Vector2().copy(centToOldNode);
	perpToOrigin.rotateAround({x:0, y:0}, Math.PI/2);
	var dotResult = rule.angleVec.dot(perpToOrigin);
	

	if (dotResult > 0){
		var newNodeVec = centToOldNode.rotateAround( this.origin.PosVec, ang);
		var newNode = new RoadNode(newNodeVec);
		//check for collison
		var collideReturn = this.funcCheckCollision(rule.oldNode, newNode);
		if (collideReturn == false){
			newNode.GiveParent(rule.oldNode);
			//add road to collison matrix
			this.addRoadToCollision(rule.oldNode, newNode);
			//draw road
			this.drawRoadFromNodes(rule.oldNode, newNode);




			//not needed if angleVec works
			var newAng = Math.atan2(centToOldNode.y - oldNodeLoc.y, centToOldNode.x - oldNodeLoc.x);
			var newAngleVec = new THREE.Vector2().subVectors(newNodeVec, oldNodeLoc);
			var newRule = { name:"Concentric", 
				angleVec:newAngleVec,
				oldNode:newNode, decay:rule.decay	};
			this.stack.push(newRule);	

			if (Math.random() > 0.7){
				var rotDir = Math.PI/2 * randPlusMin();
				var offsetAng = new THREE.Vector2().copy(newAngleVec).rotateAround({x:0, y:0}, rotDir)
					var newRule2 = {name:"Forward", 
						angleVec:offsetAng,
						oldNode:newNode, decay:rule.decay/2};
				this.stack.push(newRule2);	
			}




		}
		else{
			this.reddrawRoadFromNodes(rule.oldNode, newNode);
		}
	}
	else if (dotResult < 0){
		var newNodeVec = centToOldNode.rotateAround( this.origin.PosVec, -ang);
		var newNode = new RoadNode(newNodeVec);
		//check for collison
		var collideReturn = this.funcCheckCollision(rule.oldNode, newNode);
		if (collideReturn == false){
			newNode.GiveParent(rule.oldNode);
			//add road to collison matrix
			this.addRoadToCollision(rule.oldNode, newNode);
			//draw road
			this.drawRoadFromNodes(rule.oldNode, newNode);



			//should probably be consilifated into a function
			//not needed if angleVec works
			var newAng = Math.atan2(centToOldNode.y - oldNodeLoc.y, centToOldNode.x - oldNodeLoc.x);
			var newAngleVec = new THREE.Vector2().subVectors(newNodeVec, oldNodeLoc);
			var newRule = { name:"Concentric", 
				angleVec:newAngleVec,
				oldNode:newNode, decay:rule.decay	};
			this.stack.push(newRule);	

			if (Math.random() > 0.7){
				var rotDir = Math.PI/2 * randPlusMin();
				var offsetAng = new THREE.Vector2().copy(newAngleVec).rotateAround({x:0, y:0}, rotDir)
					var newRule2 = {name:"Forward", 
						angleVec:offsetAng,
						oldNode:newNode, decay:rule.decay/2};
				this.stack.push(newRule2);	
			}



		}
		else{
			this.reddrawRoadFromNodes(rule.oldNode, newNode);
		}
	}
	else{
		console.log("WEIRDLY STRAIGHT LINE AROUND THE CENTER");
		return null;
	}
}

LSystem.prototype.Forward = function(rule){
	if (rule.decay <= 0){ //Doesn't seem to mind if rule.decay doesn't exist
		return null;
	} else{
		rule.decay--;
	}
	var vec = new THREE.Vector2().copy(rule.angleVec);
	vec.normalize();
	vec.multiplyScalar(this.roadDistance);
	vec.add(rule.oldNode.PosVec);
	var newNode = new RoadNode(vec); 
	//need to connect nodes
	//test node for intersection
	//might even want to hand off to another level of abstraction
	//would I want it to return here or go off elsewhere and finish?
	var collideReturn = this.funcCheckCollision(rule.oldNode, newNode);
	if (collideReturn == false){
		newNode.GiveParent(rule.oldNode);
		//add road to collison matrix
		this.addRoadToCollision(rule.oldNode, newNode);
		//draw road
		this.drawRoadFromNodes(rule.oldNode, newNode);
		//add another rule to the stack for more road
		//
		//
		var newRule = {name:"Forward", 
			angleVec:rule.angleVec, oldNode:newNode, decay:rule.decay};
		this.stack.push(newRule);	
		if (Math.random() > 0.7){
			var rotDir = Math.PI/2 * randPlusMin();
			var offsetAng = new THREE.Vector2().copy(rule.angleVec).rotateAround({x:0, y:0}, rotDir);
			var newRule2 = {name:"Concentric", 
				angleVec:offsetAng,
				oldNode:newNode, decay:rule.decay/2};
			this.stack.push(newRule2);	
		}


	}
	else{
		this.reddrawRoadFromNodes(rule.oldNode, newNode);
	}
}

LSystem.prototype.ForwardOnly = function(rule){
	if (rule.decay <= 0){ //Doesn't seem to mind if rule.decay doesn't exist
		return null;
	} else{
		rule.decay--;
	}
	var vec = new THREE.Vector2().copy(rule.angleVec);
	vec.normalize();
	vec.multiplyScalar(this.roadDistance);
	vec.add(rule.oldNode.PosVec);
	var newNode = new RoadNode(vec);
	//need to connect nodes
	//test node for intersection
	//might even want to hand off to another level of abstraction
	//would I want it to return here or go off elsewhere and finish?
	var collideReturn = this.funcCheckCollision(rule.oldNode, newNode);
	if (collideReturn == false){
		newNode.GiveParent(rule.oldNode);
		//add road to collison matrix
		this.addRoadToCollision(rule.oldNode, newNode);
		//draw road
		this.drawRoadFromNodes(rule.oldNode, newNode);
		//add another rule to the stack for more road
		//
		//
		//
		//
		//
		//
		var newRule = {name:"ForwardOnly",
			angleVec:rule.angleVec, oldNode:newNode, decay:rule.decay};
		this.stack.push(newRule);
		if (Math.random() > 0.7){
			var angularOffset = Math.PI/2 * randPlusMin();
			var newAngleVec = new THREE.Vector2().copy(rule.angleVec);
			//rotate around the origin with the angular offset
			newAngleVec.rotateAround({x:0,y:0}, angularOffset);
			//var tempVec = ;
			var newRule2 = {name:"ForwardOnly",
				angleVec:newAngleVec,
				oldNode:newNode, decay:rule.decay/2};
			this.stack.push(newRule2);
		}






	}
	else{
		this.reddrawRoadFromNodes(rule.oldNode, newNode);
	}
}

LSystem.prototype.drawRoadFromNodes = function(node1, node2){
	drawLine(node1.PosVec.x, node1.PosVec.y, node2.PosVec.x, node2.PosVec.y);
}

LSystem.prototype.reddrawRoadFromNodes = function(node1, node2){
	reddrawLine(node1.PosVec.x, node1.PosVec.y, node2.PosVec.x, node2.PosVec.y);
}

LSystem.prototype.funcCheckCollision = function(node1, node2){
	var p1 = node1.PosVec.clone();
	var p2 = node2.PosVec.clone();
	var packedLine = {p1, p2};
	var col = this.col.isLineCol(packedLine);
	return col;
}

LSystem.prototype.addRoadToCollision = function(node1, node2){
	//var x1 = node1.PosVec.x;
	//var y1 = node1.PosVec.y;
	//var x2 = node2.PosVec.x;
	//var y2 = node2.PosVec.y;
	//var packedLine = {p1: {x:x1 ,y:y1}, p2: {x:x2 ,y:y2}};

	var p1 = node1.PosVec.clone();
	var p2 = node2.PosVec.clone();
	var packedLine = {p1, p2};
	this.col.addLineToGrid(packedLine);	
}


function randPlusMin(){
	if (Math.random() > 0.5){
		return 1;
	}
	else{
		return -1;
	}
}

