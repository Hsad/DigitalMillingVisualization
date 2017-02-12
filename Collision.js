function Collision(){
	//collisionGrid
	//grid size may be obsolte if I am using a hash func
	//var gridSize = 0.1;//new THREE.Vector2();
	//var cellSize = 0.01;//new THREE.Vector2();
	this.gridSize = 0.1;//new THREE.Vector2();
	this.cellSize = 0.1;//new THREE.Vector2();
	this.hashMap = new Object();
	this.hashTable = [];
	
}
//jesus I need to get this to be consistant
//use vector3
//store everything as a list of objects
//each object being 2 vectors
//there is only one gridCell for the moment
//just use the HashTable
//you can make it deeper later

Collision.prototype.addLineToGrid = function(line){
	//line {p1:vec3, p2:vec3}  	//line.p1.x
	//calculate cell intersections
	//hash into those cells
	//add line to those cells, i'm assuming the Line object taken in will work
	
	
	//var gridLoc = this.hashFunction( //conversion bullshit;
	var gridLoc = 0;
	this.addToCell(line, gridLoc);
}

Collision.prototype.addToCell = function(Obj, cell){
	if (this.hashTable[cell] == undefined){
		this.hashTable[cell] = [];
	}
	this.hashTable[cell].push(Obj);
}

Collision.prototype.removeFromCell = function(Obj){
	//don't think I need this at the moment
}

Collision.prototype.getCellCont = function(grid){
	return this.hashTable[grid];
}

Collision.prototype.sphereCol = function(Loc){
	return collisions;
}

Collision.prototype.isLineCol = function(line){
	//needs to factor in multiple cells
	//todo
	var linesInCell = this.getCellCont(0) || [];
	
	//for every line in lines, check if intersecting
	//if any are return true
	var colliding = false;
	for (var a=0; a < linesInCell.length; a++){
		colliding = this.lineIntersect(line.p1.x, line.p1.y, line.p2.x, line.p2.y,
				linesInCell[a].p1.x, linesInCell[a].p1.y, linesInCell[a].p2.x, linesInCell[a].p2.y);
		if (colliding){
			if ( !linesInCell[a].p1.equals(line.p1) && !linesInCell[a].p1.equals(line.p2) 
					&& !linesInCell[a].p2.equals(line.p1) && !linesInCell[a].p2.equals(line.p2)){
				return true;
			}
			//else colliding with parent
		}
	}
	return false;
}

Collision.prototype.hashFunction = function(coordinates){
	//coords should be {x:X, y:Y}
	return ((coordinates.x % gridSize) / cellSize) + 
		(((coordinates.y % gridSize) / cellSize) * (gridSize/cellSize));
	//returns float
}

Collision.prototype.lineIntersect = function(x1,y1,x2,y2, x3,y3,x4,y4) {
    var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
        return false;
    } else {
        if (x1>=x2) {
            if (!(x2<=x&&x<=x1)) {return false;}
        } else {
            if (!(x1<=x&&x<=x2)) {return false;}
        }
        if (y1>=y2) {
            if (!(y2<=y&&y<=y1)) {return false;}
        } else {
            if (!(y1<=y&&y<=y2)) {return false;}
        }
        if (x3>=x4) {
            if (!(x4<=x&&x<=x3)) {return false;}
        } else {
            if (!(x3<=x&&x<=x4)) {return false;}
        }
        if (y3>=y4) {
            if (!(y4<=y&&y<=y3)) {return false;}
        } else {
            if (!(y3<=y&&y<=y4)) {return false;}
        }
    }
    return true;
}
