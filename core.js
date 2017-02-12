
//variables
	var scene; 
	var camera; 
	var camControls;
	var renderer;
	var geometry;
	var material;
	var plane;
	var planeWidth = 2;
	var planeHeight = 2;
	var planeSubDiv = 100;
	var lastTime = Date.now();
	var currentTime = 0;
	var deltaTime = 0;
	var PI = 3.14159;
	var mouseVec;
	//var projector;
	var raycaster; //?
	var directionalLight;
	var pointLight;
	
	var vertIndex = 0;
	var verts;
	var gui = new dat.GUI();
	var savedInt = 0;
	var GradientGrid;
	
	var LineMat;
	var lineMesh;
	var raycaster;

	var delay = 30;
	var LSys;

	var GlobalHeightMod = 0;
	var GHModInc = 0.0001;

	var SuperLineMesh;
	var redLineMat;
	var redSuperLineMesh;
	var greenLineMat;
	var greenSuperLineMesh;

	//base stuff
	var basicMaterial;

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	camControls = new THREE.OrbitControls(camera);
	camControls.addEventListener( 'change', render);
	
	geometry = new THREE.PlaneGeometry(planeWidth,planeHeight,planeSubDiv,planeSubDiv);  //range is 0 to 10200 or x0-100 y0-100
	geometry.translate(0,0,-0.003)
	material = new THREE.MeshLambertMaterial( { color: 0x002200 } );
	plane = new THREE.Mesh( geometry, material );
	//scene.add( plane );
	
	directionalLight = new THREE.DirectionalLight( 0x555555, 100 );
	directionalLight.position.set( 1, 10,1 );
	directionalLight.rotation.x = 0.8;
	scene.add( directionalLight );
	
	//projector = new THREE.Projector();
	raycaster = new THREE.Raycaster();
	raycaster.linePrecision = 0.001;

	basicMaterial = new THREE.MeshBasicMaterial({ color: 0xff5555	});

	camera.position.z = 2;
	camera.position.y = -1000; //lil hight boost, lil less
	camera.position.x = 0; 
	camera.rotation.x = 0.5;

	document.addEventListener("keydown",onDocumentKeyDown,false);
	//if (mode == 2){	document.addEventListener("mousedown",onDocumentMouseDown,false);}
	window.addEventListener("resize", onWindowResize, false);
	
	
	//Math.seedrandom(0)
	console.log(Math.random());
	
	
	options = {
		randomSeed: 10
	};
	
	gui.add(options, "randomSeed", 0, 30);
	
	//drawLine(1,1,0,0);
	//recursiveLine([0,0], 0, 4);
	

	var vec2 = new THREE.Vector2(1,0);
	//console.log(vec2);
	var vec22 = vec2.rotateAround({x:0, y:0}, Math.PI/2);
	//console.log(vec2);
	//console.log(vec22);


	LineMat = new THREE.LineBasicMaterial( { color: 0x444444 } );
	var emptyGeo = new THREE.BufferGeometry();
	var VertPos = new Float32Array( 10000 * 3);
	emptyGeo.addAttribute( "position" ,  new THREE.BufferAttribute(VertPos, 3) );
	emptyGeo.drawRange.count = 2;
	emptyGeo.computeBoundingSphere();
	SuperLineMesh = new THREE.LineSegments(emptyGeo, LineMat);
	scene.add(SuperLineMesh);
//debug lines
	redLineMat = new THREE.LineBasicMaterial( { color: 0xff4444 } );
	emptyGeo = new THREE.BufferGeometry();
	VertPos = new Float32Array( 500000 * 3);
	emptyGeo.addAttribute( "position" ,  new THREE.BufferAttribute(VertPos, 3) );
	emptyGeo.drawRange.count = 2;
	emptyGeo.computeBoundingSphere();
	redSuperLineMesh = new THREE.LineSegments(emptyGeo, redLineMat);
	scene.add(redSuperLineMesh);

	//3D line mesh
	greenLineMat = new THREE.LineBasicMaterial( { color: 0x44ff44 } );
	emptyGeo = new THREE.BufferGeometry();
	VertPos = new Float32Array( 250000 * 3);
	emptyGeo.addAttribute( "position" ,  new THREE.BufferAttribute(VertPos, 3) );
	emptyGeo.drawRange.count = 2;
	emptyGeo.computeBoundingSphere();
	greenSuperLineMesh = new THREE.Line(emptyGeo, greenLineMat);
	scene.add(greenSuperLineMesh);
	//
	//3D line mesh blue version
	blueLineMat = new THREE.LineBasicMaterial( { color: 0x2244ff } );
	emptyGeo = new THREE.BufferGeometry();
	VertPos = new Float32Array( 250000 * 3);
	emptyGeo.addAttribute( "position" ,  new THREE.BufferAttribute(VertPos, 3) );
	emptyGeo.drawRange.count = 2;
	emptyGeo.computeBoundingSphere();
	blueSuperLineMesh = new THREE.Line(emptyGeo, blueLineMat);
	scene.add(blueSuperLineMesh);

	//LSys = new LSystem(); 
	//LSys.Seed();
	//what is this passed?  A city type?  a seed?  Do I create many
	//and those are placed out in the world and eventually connect to each other?
	//Do I need an infulence map?
	//can I create that in code and generate it procedurally?
	//do I even need to worry about that at the moment?
	//is there a good way to get the road system to build visably
	//probably by starting it here and having it update the stack once per update
	
	/*  HARDWICK this section generates demo data that was used to verify the 
	 *  proper functionality of the projection algorithm*/
	//P1 = testData(9,9,9,1,1000,0.1);
	//P2 = testData(9,9,9,20,6000,0.2);
	//readPoints(P1);
	//readPointsBlue(P2);
	//compPoints2(P1,P2);
	
	//Calling line drawer
	//readPoints(pathPoints)
	readPointsBlue(pathPoints2)
	readPoints(pathPoints3)
	compPoints2(pathPoints3, pathPoints2);
	
	
}

function testData(X,Y,Z,Off,count,spread){
	arr = [];
	for (var c = 0; c < count; c++){
		arr.push( { x:Off + X*spread*c, y:Y*spread*c, z:Z*spread*c } );
	}	
	return arr;
}

function compPoints2(input, results){
	console.log(input);
	console.log(results);
	var I = 1;
	var R = 0;
	var i0;
	var i1;
	var r;
	var L;
	var P;
	var PL;
	var graphData = []
	while (true){
		//console.log("loopin");
		i0 = input[I];
		i1 = input[I + 1];
		r = results[R];

		//console.log(i0);
		//console.log(i1);
		//console.log(r);
		L = subVec(i1, i0);
		//console.log(i0);
		//console.log(i1);
		//console.log(r);
		P = subVec(r, i0);
		PL = project(P,L);
		if (isNeg(PL,L)){
			//increment P
			R++;
		} else if (greaterThanVec(PL,L)){
			//incerement L index
			I++
		} else if (lessThanEqualVec(PL,L)){
			//project and draw P onto L
			gapEnd = addVec(PL, i0); //convert aback to world space
			reddrawLine(r.x, r.y, r.z, gapEnd.x, gapEnd.y, gapEnd.z);

			gap = subVec(gapEnd, PL); //convert gap to local space
			graphData.push( Math.sqrt( gap.x*gap.x + gap.y*gap.y + gap.z*gap.z ) );
			
			console.log(I);
			console.log(R);
			if ( R > 2000){
				break;
			}

			//incremernt P
			R++;
			//console.log("drawing");
		} else{
			//val must be 0
			console.log("error");
			//increment P;
			I++;
		}
		if (I+1 >= input.length || R >= results.length){
			break;
		} 
	}
	console.log(I);
	console.log(R);
}


function isNeg(A,B){
	if ( (A.x * B.x) >= 0 && (A.y * B.y) >= 0 && (A.z * B.z) >= 0 ){
		return false;
	}
	return true;
}

function project(linePB,lineAB){
	return multiplyVec( (dotProd(linePB,lineAB) / dotProd(lineAB,lineAB)), lineAB );
}

function comparePoints(input, results){
	console.log(input);
	console.log(results);
	//input = ideal
	//results = actual
	var I = 1;
	var R = 15;
	var dist = 0;
	var ip;
	var ic;
	var rp;
	var rc;
	var ipd;
	var ropd;
	var graphData = [];
	while(true){
		ip = input[I-1]; //these are xyz vectors
		ic = input[I];
		//ix = input[I+1]; //i next

		rp = results[R-1];
		rc = results[R];
		//rx = results[R+1]; //i next
		//
		//console.log("Printing fresh variables");
		//console.log(ip);
		//console.log(ic);
		//console.log(rp);
		//console.log(rc);

		ipd =  subVec(ip, ic); //might need to swap to a sub function
		//ind =  subVec(ix, ic);
		//iod =  subVec(rc, ic);
		//iopd = subVec(rp, ic);
		//iond = subVec(rx, ic);
                        
		//rpd =  subVec(rp, rc); //might need to swap to a sub function
		//rnd =  subVec(rx, rc);
		//rod =  subVec(ic, rc);
		ropd = subVec(ip, rc);
		//rond = subVec(ix, rc);
		console.log(I);
		console.log(R);
		
		if (greaterThanVec(ropd, ipd)){
			//project line to ip<->ic from rc, set rc = rn (increment R)
			dist = projectAndDraw( rc, ip, ic);
			R++;
		} else if (greaterThanVec(ipd, ropd)){
			//project line from rp<->rc from ic, ic = ix (inc I)
			dist = projectAndDraw( ic, rp, rc);
			I++;
		}	else{
			//somehow at the same point
			R++;
			I++;
			gap = subVec(ic, rc);
			dist = Math.sqrt( gap.x*gap.x + gap.y*gap.y + gap.z*gap.z );
			if (dist > 0){
				//console.log("Offset error of");
				//console.log(dist);
			}
		}
		graphData.push(dist);
		//increment
		//TODO More finess on which is getting incremented
		if (I >= input.length || R >= results.length){
			break;
		} 
	}
	console.log("done");
	//console.log(graphData);
}

function dotProd(A, B){
	//console.log(A);
	//console.log(B);
	return A.x*B.x + A.y*B.y + A.z*B.z;
}

function projectAndDraw(point, lineA, lineB){
	//calc projection vector
	lineAB = subVec(lineA, lineB); //create local space
	linePB = subVec(point, lineB);
	
	projVec = multiplyVec( (dotProd(linePB,lineAB) / dotProd(lineAB,lineAB)), lineAB );
	//draw line from point to projVec+lineB 
	gapEnd = addVec(projVec, lineB); //convert aback to world space
	reddrawLine(point.x, point.y, point.z, gapEnd.x, gapEnd.y, gapEnd.z);
	//console.log("After print red in project");
	
	gap = subVec(gapEnd, linePB); //convert gap to local space
	return Math.sqrt( gap.x*gap.x + gap.y*gap.y + gap.z*gap.z );
}

function lessThanEqualVec(A, B){
	return (Math.sqrt( A.x*A.x + A.y*A.y + A.z*A.z )) <= (Math.sqrt( B.x*B.x + B.y*B.y + B.z*B.z ));
}

function greaterThanVec(A, B){
	return (Math.sqrt( A.x*A.x + A.y*A.y + A.z*A.z )) > (Math.sqrt( B.x*B.x + B.y*B.y + B.z*B.z ));
}

function multiplyVec(scalar, vec){
	return { x: vec.x*scalar, y: vec.y*scalar, z: vec.z*scalar };
}

function addVec(A, B){
	return { x: (A.x+B.x), y: (A.y+B.y), z: (A.z+B.z) };
}

function subVec(A, B){
	//console.log(A);
	//console.log(B);
	return { x: (A.x-B.x), y: (A.y-B.y), z: (A.z-B.z) };
}

function readPoints(points){ //color could be passed in as well
	// read in the points, place them in order with lines between them all
	//TODO then calculate the speed and animate a ball moving in order between all of them
	for (var n = 0; n < points.length; n++){
		drawContinuedLine(points[n].x, points[n].y, points[n].z);
		//redLineUp(points[n].x, points[n].y, points[n].z);
	}
	//console.log("Hello");
}

function readPointsBlue(points){ //color could be passed in as well
	// read in the points, place them in order with lines between them all
	//TODO then calculate the speed and animate a ball moving in order between all of them
	for (var n = 0; n < points.length; n++){
		drawContinuedLineBlue(points[n].x, points[n].y, points[n].z);
		//redLineUp(points[n].x, points[n].y, points[n].z);
	}
	//console.log("Hello");
}

function c(pri){
	console.log(pri);
}

function drawContinuedLine(x,y,z){
	var pos = greenSuperLineMesh.geometry.getAttribute('position');
	var drawRangeNum = greenSuperLineMesh.geometry.drawRange.count;

	pos.setXYZ(drawRangeNum, x, y, z);

	pos.needsUpdate = true;
	greenSuperLineMesh.geometry.drawRange.count += 1;
	//console.log("drawing");
}

function drawContinuedLineBlue(x,y,z){
	var pos = blueSuperLineMesh.geometry.getAttribute('position');
	var drawRangeNum = blueSuperLineMesh.geometry.drawRange.count;

	pos.setXYZ(drawRangeNum, x, y, z);

	pos.needsUpdate = true;
	blueSuperLineMesh.geometry.drawRange.count += 1;
	//console.log("drawing");
}

function drawLine(point1x, point1y, point2x, point2y){
	var pos = SuperLineMesh.geometry.getAttribute('position');
	var drawRangeNum = SuperLineMesh.geometry.drawRange.count;

	pos.setXYZ(drawRangeNum, point1x, point1y, 0);
	pos.setXYZ(drawRangeNum + 1, point2x, point2y, 0);
	//pos.setXYZ(drawRangeNum, point1x, point1y, GlobalHeightMod);
	//pos.setXYZ(drawRangeNum + 1, point2x, point2y, GlobalHeightMod);
	pos.needsUpdate = true;

	//GlobalHeightMod += GHModInc;

	SuperLineMesh.geometry.drawRange.count += 2;

}

function redLineUp(x,y,z){
	reddrawLine(x,y,z,x,y,z+5);
}

//redDebug
function reddrawLine(point1x, point1y, point1z, point2x, point2y, point2z){
	//if (Math.random() < 0.99){
	//	return;
	//}
	var pos = redSuperLineMesh.geometry.getAttribute('position');
	var drawRangeNum = redSuperLineMesh.geometry.drawRange.count;

	pos.setXYZ(drawRangeNum, point1x, point1y, point1z);
	pos.setXYZ(drawRangeNum + 1, point2x, point2y, point2z);
	//pos.setXYZ(drawRangeNum, point1x, point1y, GlobalHeightMod);
	//pos.setXYZ(drawRangeNum + 1, point2x, point2y, GlobalHeightMod);
	pos.needsUpdate = true;

	//GlobalHeightMod += GHModInc;

	redSuperLineMesh.geometry.drawRange.count += 2;
	console.log("Drawing red");

}

function drawLineAngle(point1x, point1y, angle){
	var point2x = Math.cos(angle)*0.01 + point1x;
	var point2y = Math.sin(angle)*0.01 + point1y;
	if (checkOverlap([point1x, point1y,0], [point2x, point2y, 0]) == false){
		drawLine(point1x, point1y, point2x, point2y);
		return [point2x, point2y];
	} else {
		return false;
	}
}

function recursiveLine(last, angle, step){
	console.log(step);
	if (step == 0){	return 0;}	
	else{step = step - 1;}
	angle += (Math.random() - 0.5);
	//would change angle or branch here
	last = drawLineAngle(last[0], last[1], angle);
	if (last != false){	//check to see if the road section did not overlap
		recursiveLine(last, angle, step); 
		if (Math.random() > 0.9){
			//angle = angle+PI/2;
			recursiveLine(last, angle+PI/2, step);
		}
	return 0;
	}
}

function render() {
	//if (delay >= 30){
	//	delay = 0;
	//	LSys.Expand();
	//}
	//delay++;
	//console.log(delay);
	//cycleVerts();
	currentTime = Date.now();
	deltaTime = (currentTime - lastTime) / 1000;
	lastTime = currentTime;
	//console.log(deltaTime);
	setTimeout( function() {
		requestAnimationFrame(render);	
	}, 1000 / 30);
	renderer.render(scene, camera);
}

function onDocumentMouseDown(event){
	event.preventDefault();
	/* //the good one
	mouseVec = new THREE.Vector3(
			2* (event.clientX / window.innerWidth) - 1,
			1 - 2*(event.clientY / window.innerHeight),
			0 );
	*/
	mouseVec = new THREE.Vector3(
			2* (event.clientX / window.innerWidth) - 1,
			1 - 2*(event.clientY / window.innerHeight),
			0 );
/*
	raycaster = projector.pickingRay( mouseVec.clone(), camera);
	var intersects = raycaster.intersectObjects(arrayOfOnePlane);
	if (intersects.length > 0){
		//uhhhhhh
	}
	*/

	
}

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentKeyDown(event){
	//console.log("\n\n\nKEYY\n\n\n");
	var keyCode = event.which;
	//console.log(keyCode);
	var w=87;
	var s=83;
	var a=65;
	var d=68;
	var space=32;
	var q=81;
	var e=69;
	var z=90;
	var x=88;
	var c=67;
	var v=86;
	var f=70;
	var g=71;
	var comma=188;
	var period=190;
	/*
	if (cursorLead != undefined){
		if (keyCode == d){ 
			cursorLead.xLoc += 0.01;
		}
		else if (keyCode == a){
			cursorLead.xLoc -= 0.01;
		}
		else if (keyCode == w){
			cursorLead.yLoc += 0.01;
		}
		else if (keyCode == s){
			cursorLead.yLoc -= 0.01;
		}
		else if (keyCode == space){
			cubeAcc -= 0.5;
		}
		cursorLead.update();
	}
	else if(mode == 2 && (obstacles.length != 0 || keyCode == space)){
	//else if(obstacles.length != 0 || keyCode == space){
		if (keyCode == d){
			obstacles[obsIndex].move(0.01,0);
		}
		else if (keyCode == a){
			obstacles[obsIndex].move(-0.01,0);
		}
		else if (keyCode == w){
			obstacles[obsIndex].move(0,0.01);
		}
		else if (keyCode == s){
			obstacles[obsIndex].move(0,-0.01);
		}
		else if(keyCode == z){
			obstacles[obsIndex].expand(0.01,0);
		}
		else if(keyCode == x){
			obstacles[obsIndex].expand(-0.01,0);
		}
		else if(keyCode == c){
			obstacles[obsIndex].expand(0,0.01);
		}
		else if(keyCode == v){
			obstacles[obsIndex].expand(0,-0.01);
		}
		else if(keyCode == q){
			obstacles[obsIndex].rotate(0.01);
		}
		else if(keyCode == e){
			obstacles[obsIndex].rotate(-0.01);
		}
		else if(keyCode == f){ //<<<
			if (obsIndex == 0){	obsIndex = obstacles.length - 1;	}
			else{	obsIndex -= 1; }
		}
		else if(keyCode == g){ //>>>
			if (obsIndex == obstacles.length - 1){ obsIndex = 0; }
			else{	obsIndex += 1; }
		}
		else if (keyCode == space){
			obstacles[obstacles.length] = new Obstacle();
			obsIndex = obstacles.length - 1;
		}
	}
	if ( formation != 0 ){
		if (keyCode == comma){
			for (i=0; i<followers.length; i++){
				if (followers[i].inFormation == true){
					followers[i].leaveFormation();
					break;
				}
			}
		}
		else if (keyCode == period){
			formation.addSlot();
		}
	}
	*/
}

//this is an experiement
THREE.Vector2.prototype.rotateAround = function ( center, angle ) {

		var c = Math.cos( angle ), s = Math.sin( angle );

		var x = this.x - center.x;
		var y = this.y - center.y;

		this.x = x * c - y * s + center.x;
		this.y = x * s + y * c + center.y;

		return this;

}  




