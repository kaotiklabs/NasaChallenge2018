
var textEarth, textClouds, textStars;
var dataTextures = [];
var csvFile;
var gui;
var csvWorldAirTempreature;

var radius = 200;
var theta = 0;
var zoomZ = 0;

var eqdata;
var rows = [];
var rx = 0;
var ry = 0;

var textCanvas;
var myFont;

var Clouds = false;
var Heatmap = true;
var Background = true;
var Markers = false;

var vid;

function preload() {

	textEarth = loadImage("assets/earth.jpg");
	textClouds = loadImage("assets/clouds-alpha.png");
	textStars = loadImage("assets/milky.png");
	
	myFont = loadFont('assets/AvenirNextLTPro-Demi.otf');

	csvFile = loadStrings("data/all.csv");

	csvWorldAirTempreature = loadStrings("data/worldAirTemperature.csv");
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);

	gui = createGui('NASA Apps Challenge 2018');
	gui.addGlobals('Clouds', 'Heatmap', 'Markers', 'Background');

	vid = createVideo(["assets/street.avi"]);
	vid.elt.muted = true;
	vid.loop();
	//vid.hide();

	//enable wegl alpha??
	// gl = this._renderer.GL;
	// gl.enable(gl.BLEND);
	// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	

	//textCanvas = createGraphics(windowWidth,windowHeight);	
	textFont(myFont);

	var capas = new Capas();
	capas.cargarCapa(1, 'World Air Temperature',csvWorldAirTempreature);
	var capa = capas.getCapa(1);
	var fecha = capa.getFecha(null);
	var datos = fecha.getDatos();
	console.log(datos[0]);
	console.log(datos[1]);
	console.log(datos[2]);
	console.log(datos[3]);
	console.log(datos[4]);
	var rango = capa.getRango("1995-01-01","1997-01-01");
	parseCSVData();

	//dataTexture.fill(0, 0, 0, 0);
	//dataTexture.background(0, 220, 0, 0);

	//parseCSVData();

	parseDataTexture(0);
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
	for (var i = 0; i < csvFile.length; i++) { 
		var data = [i].split(/,/);
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
		
	}
}

function parseDatesTextures(fechas)
{
	var textures = [];
	var texture;

	for(var fecha in fechas)
	{
		texture = parseDataTexture(fecha.getDatos());
		textures.push(texture);
	}

	return textures;
}


function parseDataTexture(textureId){

	dataTextures.push(createGraphics(1536, 768));

	for (var i = 0; i < csvFile.length; i++) { 

		var data = [i].split(/,/);
		//console.log(data);
		var lat = data[1];
		var lon = data[2];
		var mag = data[4];
		
		var textureX = map(lon, -180, 180, 0, dataTextures[textureId].width, true);
		var textureY = map(lat, -90, 90, dataTextures[textureId].height, 0, true);
		var magnitude = map(mag, 0, 7, 0, 255, true);

		//paint data texture		
		dataTextures[textureId].colorMode(HSB, 255, 100, 100, 255);

		dataTextures[textureId].noStroke();
		dataTextures[textureId].fill(magnitude, 70, 70, magnitude/1.3);
		dataTextures[textureId].ellipse(textureX, textureY, int(mag*2));

		//colorMode(RGB);  
	}

}


function mouseWheel(event) {
	//print(event.delta);
	//move the square according to the vertical scroll amount
	zoomZ += event.delta / 2;
	//uncomment to block page scrolling
	//return false;
}

function draw() {

	background(10);

	//atmosphere
	// fill(50, 50, 200, 100);
	// ellipse(0, 0, radius * 2 + 70, radius * 2 + 70, 48);
	// fill(25, 25, 200, 25);
	// ellipse(0, 0, radius * 2 + 110, radius * 2 + 110, 48);


	translate(0, 0, zoomZ);

	//Rotate the globe if the mouse is pressed
	if (mouseIsPressed) {
		rx += (mouseX - pmouseX) / 100;
		//ry += (mouseY - pmouseY) / -400;
	}
	let dirX = mouseX - windowWidth / 2;
	let dirY = mouseY - windowHeight / 2;


	//mouse pointer
	//	fill(255);
	// ellipse(mouseX - width/2, mouseY - height/2, 20, 20);

	// ambientLight(150);
	// directionalLight(255, 211, 200, 0.25, 0.25, 0);
	// pointLight(255, 255, 255, mouseX, mouseY, 250);




	push();
	//earth and mouse rotation
	rotateY(rx +theta * 0.01);
	rotateX(ry);

	//!no se si fa algo?
	//ambientMaterial(250);

	//earth ellipse
	texture(textEarth);
	sphere(radius, 48, 32);
	
	if(Clouds){
		//clouds ellipse			
		texture(textClouds);
		sphere(radius + 5, 48, 32);	
	}
	

	if(Heatmap){
		//data ellipse
		//dataTexture.fill(0,0,0,0);
		texture(dataTextures[0]);
		sphere(radius + 10);
	}

	if(Background){
		//starfield ellipse
		//textStars.fill(0, 0, 0, 0);
		texture(textStars);	
		sphere(radius*5, 48, 32);
	}

	if(Markers){
		draw3DMarkers();
	}

	pop();

	//earth rotation increment
	theta += 0.05;

	
	//var gl = document.getElementById('defaultCanvas0').getContext('webgl');
	//gl.disable(gl.DEPTH_TEST);
	
	///fps counter

	//offscreen canvas mode
	// textCanvas.fill(255);
	// textCanvas.textAlign(CENTER);
	// textCanvas.textSize(50);
	// textCanvas.text(int(frameRate())+" fps", 100, 100);	
  	// texture(textCanvas);
  	// plane(width, height);

	
	//webgl text mode
	fill(255);
   	textSize(36);
   	text(int(frameRate())+" fps", -windowWidth/2.5, 0);
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

	for (let i = 1; i< csvFile.length; i++){	
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

		fill(200,0,255);
		//normalMaterial();
		box(boxheight, 1, 1);

		pop();
	}	
	
}