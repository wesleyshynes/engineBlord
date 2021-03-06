var bView = document.getElementById("bView");
var drw = bView.getContext("2d");

var player1 = "none";
var currentLevel;
var gameOn = false;

// fps sutff
var frameCount = 0;
var fpsResults = document.getElementById('fpsResults');
var timeResults = document.getElementById('timeResults');
var fps, fpsInterval, startTime, now, then, elapsed;

fps = 60;
var keysResults = document.getElementById('keysPressed');

//key press stuff
var ne = {};

var level1 = [
	new levelPiece("wall1", 100,200,200,10,"#ce192b"),
	new levelPiece("wall1", 200,200,10,300,"#ce192b"),
	new levelPiece("wall1", 400,300,200,10,"#ce192b")
];

var level2 = [
	new levelPiece("wall1", 100,200,200,10,"#21282f"),
	new levelPiece("wall1", 300,200,10,300,"#21282f"),
	new levelPiece("wall1", 400,300,200,10,"#21282f")
];

level1.nextLevel = level2;

var level3 = [
	new levelPiece("wall1", 100,200,200,10,"#FFD700"),
	new levelPiece("wall1", 300,200,10,300,"#FFD700"),
	new levelPiece("wall1", 400,200,200,10,"#FFD700")
];

level2.nextLevel = level3;

function getInput(thing){
	theInput = document.getElementById(thing).value;
	return theInput;
}

function player(name, xPos, yPos, width, height, color){
	this.name = name;
	this.x = xPos;
	this.y = yPos;
	this.width = width;
	this.height = height;
	this.color = color;
	this.speedX = 3;
	this.speedY = 3;
	this.face="=)";
}

function levelPiece(name, xPos, yPos, width, height, color){
	this.name = name;
	this.x = xPos;
	this.y = yPos;
	this.width = width;
	this.height = height;
	this.color = color;
}

function drawBox (xPos, yPos, width, height, color) {
	drw.fillStyle = color;
	drw.fillRect(xPos, yPos, width, height);
}

function clearMap(){
	drawBox(0,0,600,400,"#eeeeee");
}

function drawBlock(block){
	drw.fillStyle = block.color;
	drw.fillRect(block.x, block.y, block.width, block.height);
}

function drawBlockGroup(blockgroup){
	for (block = 0; block < blockgroup.length; block++) {
		drawBlock(blockgroup[block]);	
	}
}

function drawMap (player, map, baddies){
	clearMap();
	drawBlock(player);	
	
	drawRotatedText(player.face, (player.x+player.width/2), (player.y+15), 90, ((drw.measureText(player.face).width)/2)-2, -11, 15, "#ce192b");
	
	drawText(player.name, ((player.x+player.width/2)- (drw.measureText(player.name).width)/2), (player.y+40), 12, "#ce192b");
	drawBlockGroup(map);	
}

function startGame(){
	
	if (player1 == "none") {
		//fps stuff
		fpsInterval = 1000 / fps;
		then = Date.now();
		startTime = then;
		player1 = new player(getInput("pName"),150,40,25,25,getInput("pColor"));
	}
	
	if (gameOn != true) {
	gameOn = true;
	currentLevel = level1;
	gameLoop();
	}
}

function pauseGame() {
	gameOn = false;
}

function resumeGame() {
	gameOn = true;
	gameLoop();
}

function nextLevel() {	
	if (currentLevel.nextLevel != null) {
		currentLevel = currentLevel.nextLevel;
	} else {
		currentLevel = level1;
	};	
}

function updateFrame(){

	//horizontalLoop(player1, 100, 500);
	//verticalLoop(player1, 30, 100);
	if (ne!= {}) {
		player1.face = "=)";
		keysResults.innerHTML = JSON.stringify(ne);
		checkKeys();
	}
	
	drawMap(player1, currentLevel);
}

function gameLoop() {	

	if (gameOn == false) {
		return
	};
	
	requestAnimationFrame(gameLoop);
	
	now = Date.now();
    elapsed = now - then;
		
	if (elapsed > fpsInterval) {
		
        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);

        // draw stuff here
		updateFrame();

        // TESTING...Report #seconds since start and achieved fps.
        var sinceStart = now - startTime;
        var currentFps = Math.round(1000 / (sinceStart / ++frameCount) * 100) / 100;
        timeResults.innerHTML = ("Elapsed time= " + Math.round(sinceStart / 1000 * 100) / 100);
        fpsResults.innerHTML = (currentFps + " fps.");
    }	
}

function drawText(text, x, y, size, color){
	purse = size + "px Arial";
	drw.font = purse;
	drw.fillStyle = color;
	drw.fillText(text, x, y);
}



function drawRotatedText(text, x, y, angle, offsetX, offsetY, fontSize, color){
	drw.save();		
	drw.translate(x, y);
	drw.rotate(angle*Math.PI/180);	

	drawText(text, offsetY, offsetX, fontSize, color)
	
	drw.restore();	
}




function horizontalLoop(target, start, stop){
	if (target.x <= start || target.x >= stop ) {
		target.speedX = -target.speedX;	
	};
	target.x+=target.speedX;
}

function verticalLoop(target, start, stop){
	if (target.y <= start || target.y >= stop ) {
		target.speedY = -target.speedY;	
	};
	target.y+=target.speedY;
}



// Button Pressed Function
function downSki(e) {
	if (typeof event === "undefined") {
		keyP = e.which;
		} else {
		keyP = event.keyCode; }
		ne[keyP] = true;
	//console.log(ne);
}
document.onkeydown = downSki;

function upSki(e) {
	if (typeof event === "undefined") {
		keyP = e.which;
		} else {
		keyP = event.keyCode; }
		delete ne[keyP];
}
document.onkeyup = upSki;

function checkKeys() {

	
	if (ne[68]== true) {
		// left
		player1.x+=player1.speedX;
		player1.face = "=O";
	}
	
	if (ne[65]== true) {
		// right
		player1.x+=-player1.speedX;	
		player1.face = "=o";
	}
	
	if (ne[87]== true) {
		// up
		player1.y+=-player1.speedY;	
		player1.face = "=D";
	}
	
	if (ne[83]== true) {
		// down
		player1.y+=player1.speedY;	
		player1.face = "=]";
	}


}


