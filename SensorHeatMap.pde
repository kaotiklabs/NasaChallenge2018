
//create a heatmap from a given points and values

ArrayList<Node> nodeArray = new ArrayList<Node>();
PShape bg;
PImage mapImage;
float averageValue;
int minValue = 17;
int maxValue = 26;

void setup(){
  size(800, 600);
  
  bg = loadShape("data/mapa.svg"); 
}


void draw(){  
  
  
  colorMode(RGB, 255, 255, 255);
  background(255);

  shape(bg, 0, 0, width, height);
  
  if(nodeArray.size()>0){
    image(mapImage, 0, 0);
    
    float total=0;
    for(Node n: nodeArray){
     //n.draw();
     text(n.value, n.x, n.y);
     total+=n.value;
    }    
    
    averageValue = total/nodeArray.size();
    text("Average: "+averageValue, 10, 50);

  }
  
  fill(0);
  text(frameRate, 10, 10);  
 
}

void mouseClicked(){
  AddNewNode(); 
  mapImage=makeHeatMap();
}

void AddNewNode(){  
   String name = "Node "+nodeArray.size();
   Node bufNode = new Node(name,mouseX, mouseY, random(17, 26));
   nodeArray.add(bufNode); 
}


//returns the a pimage of screen size
PImage makeHeatMap() {
  colorMode(HSB);
  PImage timg=createImage(width, height, RGB);
  timg.loadPixels();

  loadPixels();
  
  //maxpossible distance between any 2 pixels is the diagonal distance across the screen
  float maxDist = sqrt((width*width)+(height*height));
  float heats[] =new float[pixels.length];
  float x=0.0f;
  float y=0.0f;
  for (int i=0;i<pixels.length;i++) {
    float _hue=getInterpValue(x, y);   
   
    color aColor=color(255-(255*_hue),255,255, 120);
    timg.pixels[i]= aColor;
    x++;
    if (x>=width) {
      x=0; 
      y++;
    }
  }
  timg.updatePixels();
  return timg;
}

//ITERATES THROUGH ALL THE DATA POINTS AND FINDS THE FURTHERS ONE
float getMaxDistanceFromPoint(float x, float y) {
  float maxDistance=0.0f;
  //get disance between this and each pther point
  for (int i=0;i<nodeArray.size();i++) {
    float thisDist=dist(x, y, nodeArray.get(i).x, nodeArray.get(i).y);
    //if this distance is greater than previous distances, this is the new max
    if (thisDist>maxDistance) {
      maxDistance=thisDist;
    }
  }
  return maxDistance;
}

//RETURNS AN ARRAY OF THE DISTANCE BETWEEN THIS PIXEL AND ALL DATA POINTS
float [] getAllDistancesFromPoint(float x, float y) {
  float [] allDistances = new float [nodeArray.size()];
  for (int i=0;i<nodeArray.size();i++) { 
    allDistances[i]= dist(x, y, nodeArray.get(i).x, nodeArray.get(i).y);
  }
  
  return allDistances;
}


//RETURNS THE ACTUAL WEIGHTED VALUE FOR THIS PIXEL
float getInterpValue(float x, float y) {
  float interpValue=0.0f;

  for (int i=0;i<nodeArray.size();i++) {
    float maxDist = getMaxDistanceFromPoint( x, y);
    float [] allDistances = getAllDistancesFromPoint( x, y);
    float thisDistance = dist(x, y, nodeArray.get(i).x, nodeArray.get(i).y);
    
    //map the temp value to a 0.0-1.0 interval
    float relativeValue = map(nodeArray.get(i).value, minValue, maxValue, 0.0, 1.0);
    interpValue += relativeValue*getWeight( maxDist, thisDistance, allDistances );
  }
  return interpValue;
}

//THE WEIGHT IS THE VALUE COEFFICIENT (? RIGHT TERM) BY WHICH WE WILL MULTIPLY EACH VALUE TO GET THE CORRECT WEIGHTING
float getWeight(float maxDistance, float thisDistance, float [] allDistances ) {
  float weight=0.0f;
  float firstTerm = pow(((maxDistance - thisDistance   )/( maxDistance * thisDistance  )), 2);
  float secondTerm=0.0f;
  for (int i=0;i<allDistances.length;i++) {
    secondTerm+=pow(((maxDistance - allDistances[i]   )/( maxDistance * allDistances[i]  )), 2);
  }
  weight = firstTerm/secondTerm;
  return weight;
}