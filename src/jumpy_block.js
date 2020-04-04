var myGamePiece;
var myObstacles = [];
var myScore;
var frameRate = 20;
var obstacleInterval = 150;

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myScore = new scoreboard("30px", "Consolas", "black", 280, 40);
    myGameArea.start();
}

var myGameArea = { // define the playing area
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
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

function scoreboard(width, font, color, x, y) {
    this.score = 0;
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

function component(width, height, color, x, y) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() { //update the player area with the new values
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity; /// gravity is a speed not an acceleration!
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
           this.y = rockbottom;
           this.gravitySpeed = 0;
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
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            // Game over
            return;
        }
    }
    myGameArea.clear(); // clear the previous frame
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(obstacleInterval)) { // create obstacle
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "blue", x, 0)); // top of obstacle
        myObstacles.push(new component(10, x - height - gap, "blue", x, height + gap)); //bottom
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
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function jump() {
    // increase upward velocity
    myGamePiece.gravity = -0.002;
}