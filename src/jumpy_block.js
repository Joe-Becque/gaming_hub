var myGamePiece;
var myObstacles = [];
var myScore;
var frameRate = 20; // per second
var obstacleInterval = 150; // frames
var gameGravity = 0.5; // pixels per second per second

var myGameArea = { // define the playing area
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 0.6 * screen.width;
        this.canvas.height = 0.6 * screen.height;
        this.context = this.canvas.getContext("2d");
        // insert the canvas as first thing in the document?
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, frameRate);
    },
    clear : function() { // remove the contents of the game area
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function startGame() {
    var blockDim = myGameArea.canvas.height / 7;
    var blockStartingPos = myGameArea.canvas.width / 5;
     myGamePiece = new block(blockDim, blockDim, "red", blockStartingPos, 0);
     myGamePiece.gravity = 0.05;
     myScore = new scoreboard("30px", "Consolas", "black", 280, 40);
     myGameArea.start();
 }

function doGameOver() {
    clearInterval(myGameArea.interval);
    var jumpInput = document.getElementById('jumpInput');
    jumpInput.parentNode.removeChild(jumpInput);
}

function scoreboard(width, font, color, x, y) {
    this.width = width;
    this.font = font;
    this.x = x;
    this.y = y;

    this.updateScore = function() {
        ctx = myGameArea.context;
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }
}

function obstacle(width, height, colour, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() { //update the player area with the new values
       ctx = myGameArea.context;
       ctx.fillStyle = colour;
       ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function block(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function() { //update the player area with the new values
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.newPos = function() {
        this.y += this.speedY //+ this.gravitySpeed;
        this.speedY += gameGravity;
        this.hitSides();
    }
    this.hitSides = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
           this.y = rockbottom;
           this.speedY = 0;
        }
        else if (this.y < 1){
            this.y = 1
            this.speedY = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
               crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            doGameOver();
            return;
        }
    }
    myGameArea.clear(); // clear the previous frame
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(obstacleInterval)) { // create obstacle
        var screenRHS = myGameArea.canvas.width;
        var screenHeight = myGameArea.canvas.height;
        this.gapMaxSize = 10 * myGamePiece.height;
        this.gapMinSize = 5 * myGamePiece.height;
        gap = Math.floor(Math.random()*(this.gapMaxSize-this.gapMinSize+1)+this.gapMinSize);

        maxHeight = 0.1 * myGameArea.canvas.height;
        minHeight = myGameArea.canvas.height - gap;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

        myObstacles.push(new obstacle(10, height, "blue", screenRHS, 0)); // top of obstacle
        myObstacles.push(new obstacle(10, screenHeight, "blue", screenRHS, height + gap)); //bottom
    }
    for (i = 0; i < myObstacles.length; i += 1) { //move the obstacles
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.updateScore();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function jump() {
    myGamePiece.speedY += -8;
    myGamePiece.newPos();
    myGamePiece.update();
}