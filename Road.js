/*
function Class(){
	this.variable;
}

Class.prototype.method = function(){
	this.variable;
	this.otherMethod();
}*/
function Road(inputA, inputB){
	this.endAVec = inputA; //vec2
	this.endBVec = inputB; //vec2
	this.neighA = []; //list of roads
	this.neighB = []; //list of roads
	this.vector = new THREE.Vector2(endBVec.x, endBVec.y);
	//world angle from north (I hope)
	this.angle = this.getOwnAngle(); //-PI to PI
}

Road.prototype.addRoadToA = function(newRoad){ //probably called by parent as it gets a road added to it
	//need to calculate the angle of the new road in comparitson to the others and add it to the list
	//will need to use splice(index = ??, NumToDelete = 0, Item = Road)
	/*  //Need to change this math so it works from A, rather than B like I coded it
	if(this.neighA.length() == 0){
		this.neighA.push(newRoad);
		return 0;
	} else{
		for (var x = 0; x < neighA.length(); x++){
			if (newRoad.angle - this.angle > neighA[x].angle - this.angle){//compare angle of new to current
				this.neighA.splice(x,0,newRoad);
				return x;
			}
		}
		//Furthest rightmost road, adding to the back of the list
		this.neighA.push(newRoad);
		return this.neighA.length() - 1; //returning index becasue why not
	}*/
}

Road.prototype.addRoadToB = function(newRoad){ //called when extending road
	if(this.neighB.length() == 0){
		this.neighB.push(newRoad);
		return 0;
	} else{
		for (var x = 0; x < neighB.length(); x++){
			if (newRoad.angle - this.angle > neighB[x].angle - this.angle){//compare angle of new to current
				this.neighB.splice(x,0,newRoad);
				return x;
			}
		}
		//Furthest rightmost road, adding to the back of the list
		this.neighB.push(newRoad);
		return this.neighB.length() - 1; //returning index becasue why not
	}
}

Road.prototype.getOwnAngle = function(){
	var tempVec = new THREE.Vector2(0,0);
	tempVec.add(this.vector);
	tempVec.normalize();
	this.angle = Math.atan2(tempVec.y, tempVec.x);
	return this.angle;
}

Road.prototype.angleBetween = function(otherAngle){
	//need someway to detect the differnce in angle between curent and other road
	//detect which side is connecting to the road B-A  or B-B or A-B or A-A
}

Road.prototype.moveRoad = function(){ //more of a stretch goal to move road based off of a parameter
	//update wnd vectors and vector
}
