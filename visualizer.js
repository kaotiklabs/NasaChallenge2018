var theta = 0;

var textEarth, textClouds, textStars;
var dataTexture;
var csvFile;

var radius = 350;
var zoomZ = 0;
var maxZoomZ = 300;
var minZoomZ = -100;

var eqdata;
var rows = [];
var rx = 0;
var ry = 0;

function preload() {

	textEarth = loadImage("resources/earth.jpg");
	textClouds = loadImage("resources/clouds-alpha.png");
	textStars = loadImage("resources/milky.png");

	csvFile = loadStrings("resources/all.csv");
	
	dataTexture = createGraphics(2048, 1024);
	dataTexture.background(100, 200, 220, 30);

	var loader = new LoaderCSV("resources/worldAirTemperature.csv");
	loader.openFile();
	console.log("caca2");

}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);

	//enable wegl alpha??
	//gl = this._renderer.GL;
	//gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	

	parseCSVData();
}

function parseCSVData() {

	//Make a P5 table to store data
	eqdata = new p5.Table();
	eqdata.addColumn('cX'); //0
	eqdata.addColumn('cY'); //1
	eqdata.addColumn('cZ'); //2
	eqdata.addColumn('mag'); //3
	eqdata.addColumn('raxis'); //4
	eqdata.addColumn('xaxis'); //5
	eqdata.addColumn('angleb'); //6

	//Extract data from CSV, calculate and store in the table
	//for (var i = 0; i < csvFile.length; i++) { 
	for (var i = 0; i < 500; i++) {
		var data = csvFile[i].split(/,/);
		//console.log(data);
		var lat = data[1];
		var lon = data[2];
		var mag = data[4];
		
		let thetha = PI / 2 + radians(lat);
		let phi = PI / 2 - radians(lon);
		let cX = -(radius * sin(thetha) * cos(phi));
		let cZ = -(radius * sin(phi) * sin(thetha));
		let cY = (radius * cos(thetha));
		let posvector = createVector(cX, cY, cZ);
		let xaxis = createVector(1, 0, 0);
		let raxis = xaxis.cross(posvector);
		let angleb = xaxis.angleBetween(posvector);
		mag = pow(10, mag);
		mag = sqrt(mag);
		var magmax = sqrt(pow(10, 10));
		var d = map(mag, 0, magmax, 0, 180);
		rows[i] = eqdata.addRow();
		rows[i].set('cX', cX);
		rows[i].set('cY', cY);
		rows[i].set('cZ', cZ);
		rows[i].set('mag', d);
		rows[i].set('raxis', raxis);
		rows[i].set('xaxis', xaxis);
		rows[i].set('angleb', angleb);
		//print("load line: "+i);
		
		//paint data texture
		dataTexture.noStroke();
		dataTexture.fill(200, 0, 0);
		
		var textureX = map(lon, -180, 180, 0, 2048, true);
		var textureY = map(lat, -90, 90, 1024, 0, true);
		dataTexture.ellipse(textureX, textureY, 20);
		
	}
}

function mouseWheel(event) {
	//print(event.delta);
	//move the square according to the vertical scroll amount
	zoomZ -= event.delta / 2;
	//uncomment to block page scrolling
	//return false;
}

function draw() {

	background(10);
	
	///fps counter
	/*
	fill(255);
	text("HHHHHHHH", -100, -100);
	text("HHHHHHHH", 100, 0);
*/

	//limitador de zoom
	if(zoomZ<minZoomZ)
	{
		zoomZ = minZoomZ;
	}

	if(zoomZ>maxZoomZ)
	{
		zoomZ = maxZoomZ;
	}

	//atmosphere
	fill(150, 150, 250, 250);
	ellipse(0, 0, radius * 2 + 60, radius * 2 + 60, 48);
	fill(50, 50, 200, 100);
	ellipse(0, 0, radius * 2 + 80, radius * 2 + 80, 48);
	fill(25, 25, 200, 25);
	ellipse(0, 0, radius * 2 + 100, radius * 2 + 100, 48);


	translate(0, 0, zoomZ);

	//Apply mouse drag rotations
	rotateY(rx);
	rotateX(ry);

	//Rotate the globe if the mouse is pressed
	if (mouseIsPressed) {
		rx += (mouseX - pmouseX) / 100;
		//ry += (mouseY - pmouseY) / -100;
	}
	let dirX = mouseX - width / 2;
	let dirY = mouseY - height / 2;


	//mouse pointer
	//	fill(255);
	// ellipse(mouseX - width/2, mouseY - height/2, 20, 20);

	//ambientLight(150);
	//directionalLight(255, 211, 200, 0.25, 0.25, 0);
	//pointLight(255, 255, 255, mouseX, mouseY, 250);




	push();
	//earth rotation
	rotateY(theta * 0.01);

	//!no se si fa algo?
	//ambientMaterial(250);

	//earth ellipse
	texture(textEarth);
	sphere(radius, 48, 32);
		
	//clouds ellipse
	texture(textClouds);
	sphere(radius + 10, 48, 32);
	
	//data ellipse
	texture(dataTexture);
	sphere(radius + 11, 48, 32);

	//data ellipse
	texture(textStars);
	sphere(radius*5, 48, 32);
	
	draw3DMarkers();


	pop();

	//earth rotation increment
	theta += 0.05;

}


function draw3DMarkers() {
	
	//Get table data and draw a box for each earthequake entry
	let r_axis;
	let d_mag;
	let angle_b;
	let x;
	let y;
	let z;
	let boxheight;

	//for (let i = 1; i< csvFile.length; i++){
	for (let i = 1; i < 500; i++) {
		x = eqdata.get(i, 0);
		y = eqdata.get(i, 1);
		z = eqdata.get(i, 2);
		d_mag = eqdata.get(i, 3);
		r_axis = eqdata.get(i, 4);
		angle_b = eqdata.get(i, 6);
		boxheight = d_mag - radius / 2;

		push();
		translate(x, y, z);
		rotate(angle_b, [r_axis.x, r_axis.y, r_axis.z]);

		//Not sure why it doesn't work if you apply rotations seperately like below
		//    rotateZ(angle_b, abs(r_axis.z));
		//   rotateY(angle_b, abs(r_axis.y));
		//   rotateX(angle_b, abs(r_axis.x));

		//fill(200,0,255);
		normalMaterial();

		box(boxheight, 1, 1);
		//box(10, width/2, 10);
		pop();
	}	
	
}