
var textEarth, textClouds, textStars;
var dataTextures = [];

var csvFile;
var gui;
var csvWorldAirTempreature;

var radius = 200;
var theta = 0;
var speedFactor = 5;
var zoomZ = 0;

var timer = 0;
var timeStep = 100; //ms x frame
var numFrame = 0;

var eqdata;
var rows = [];
var rx = 0;
var ry = 0;

//var textCanvas;
var myFont;

var Clouds = false;
var Heatmap = true;
var Background = true;
var Markers = false;

var heat; //heatmap

function preload() {

	textEarth = loadImage("assets/earth.jpg");
	textClouds = loadImage("assets/clouds-alpha.png");
	textStars = loadImage("assets/milky.png");
	
	myFont = loadFont('assets/AvenirNextLTPro-Demi.otf');

	csvFile = loadStrings("data/all.csv");

	//csvWorldAirTempreature = loadStrings("data/worldAirTemperature.csv");
	csvWorldAirTempreature = loadStrings("data/airTemperatureMonthly.csv");
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	heat.resize();
  }

  
function setup() {

	createCanvas(windowWidth, windowHeight, WEBGL);
	
	heat = simpleheat('heatcanvas');
	var canvas1 = document.getElementById("heatcanvas");   
	canvas1.style.display="none";
	//heat.radius(10, 80);
	heat.radius(10, 20);
	heat.gradient({0.0: 'pink', 0.2: 'purple', 0.4: 'blue', 0.6: 'green', 0.8: 'yellow', 1: 'red'});

	gui = createGui('NASA Apps Challenge 2018');
	gui.addGlobals('speedFactor', 'Clouds', 'Heatmap', 'Markers', 'Background', 'timeStep');

	timer = millis();

	textFont(myFont);

	var capas = new Capas();
	capas.cargarCapa(1, 'World Air Temperature',csvWorldAirTempreature);
	var capa = capas.getCapa(1);
	var rango = capa.getRango("1990-01-01","2019-01-01");
	dataTextures = GenerateTextureArray(rango);

}

function GenerateTextureArray(fechas)
{
	var textures = [];
	var texture;

	for(var fecha in fechas)
	{
		texture = DateToTexture(fechas[fecha].getDatos());
		textures.push(texture);		
	}

	return textures;
}


function DateToTexture(arrayDatos){

	// reset heatmap data
	heat.clear();

	for (var i = 0; i < arrayDatos.length; i++) { 
		
		var lat = float(arrayDatos[i].latitud);
		var lon = float(arrayDatos[i].longitud);
		var mag = float(arrayDatos[i].valor);

		var textureX = map(lon, -180, 180, 0, 1024, true);
		var textureY = map(lat, -90, 90, 512, 0, true);

		//add points to heatmap
		var scale = map(mag, -50, 50, 0, 1, true);
		heat.add([textureX, textureY, scale]);		
	}

	//update heatmap drawing
	heat.draw();	
	
	//get heatmap canvas image and store it as a texture and return it
	var canvas1 = document.getElementById("heatcanvas");     
	var url = canvas1.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
	var heatImage = loadImage(url);

	return heatImage;
}


function mouseWheel(event) {
	//print(event.delta);
	//move the square according to the vertical scroll amount
	zoomZ += event.delta / 2;
	//uncomment to block page scrolling
	//return false;
}

function draw() {

	if((millis() - timer) > timeStep){
		timer = millis();
		numFrame++;

		if(numFrame >= dataTextures.length){
			numFrame = 0;
		}
	}

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
		ry += (mouseY - pmouseY) / -400;
	}
	let dirX = mouseX - windowWidth / 2;
	let dirY = mouseY - windowHeight / 2;


	//mouse pointer
	//	fill(255);
	// ellipse(mouseX - width/2, mouseY - height/2, 20, 20);

	//  ambientLight(150);
	//  directionalLight(255, 211, 200, 0.25, 0.25, 0);
	//  pointLight(255, 255, 255, mouseX, mouseY, 250);

	push();
	//earth and mouse rotation
	rotateY(rx +theta * 0.01);
	rotateX(ry);

	//earth ellipse
	texture(textEarth);
	sphere(radius, 48, 32);
	
	if(Clouds){
		//clouds ellipse			
		texture(textClouds);
		sphere(radius + 4, 48, 32);	
	}
	

	if(Heatmap){
		//data ellipse
		texture(dataTextures[numFrame]);
		sphere(radius+7);
	}

	if(Background){
		//starfield ellipse
		texture(textStars);	
		sphere(radius*5, 48, 32);
	}

	if(Markers){
		draw3DMarkers();
	}

	pop();

	//earth rotation increment
	theta += speedFactor/100;
	
	//webgl text mode
	fill(255);
   	textSize(36);
   	text(int(frameRate())+" fps", -windowWidth/2.2, 0);
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