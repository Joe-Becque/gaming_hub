var myGamePiece;
var myObstacles = [];
var myScore;
var frameRate = 20;    //frames per second
var gameGravity = 0.5; //pixels per second per second

var myGameArea = {
    //define the playing area
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 0.4 * screen.width;
        this.canvas.height = 0.6 * screen.height;
        this.blockDim = this.canvas.height / 15;
        this.gapMaxSize = 8 * this.blockDim;
        this.gapMinSize = 4 * this.blockDim;
        this.frameNo = 0;
        this.obstacleInterval = 150; //number of frames between new obstacles
        this.nextObstacle = 1;       //frame number of next obstacle to be created
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, frameRate); //update the game area frameRate times per second
    },
    clear : function() {
        //clear the contents of the game area
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function startGame() {
    myGameArea.start();
    var blockStartingPos = myGameArea.canvas.width / 10;
    myGamePiece = new block(myGameArea.blockDim, myGameArea.blockDim, blockStartingPos, 0);
    myScore = new scoreboard(30, "Consolas", "black", 280, 25);
 }

function gameOver() {
    clearInterval(myGameArea.interval);
    var jumpInput = document.getElementById('jumpInput');
    jumpInput.parentNode.removeChild(jumpInput);
}

function scoreboard(fontSize, font, color, x, y) {
    this.fontSize = fontSize;
    this.font = font;
    this.x = (myGameArea.canvas.width / 2) - 60;
    this.y = y;

    this.updateScore = function() {
        ctx = myGameArea.context;
        ctx.font = this.fontSize + "px " + this.font;
        ctx.fillStyle = color;
        ctx.lineWidth = 3
        ctx.strokeStyle = "gray";
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
    }
}

function obstacle(width, height, colour, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = "../images/lava.jpg";

    this.imageBorder = new Image();
    this.imageBorder.colour = 'black';


    //update the player area with the new position
    this.update = function() {
       var ctx = myGameArea.context;
      //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}

function block(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = '../images/ice.jpg';

    //update the player area with the new position
    this.update = function() {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    //calculate the position and speed for the new frame
    this.newPos = function() {
        this.y += this.speedY
        this.speedY += gameGravity;
        this.hitSides();
    }

    //block can't move passed the edge of the game area
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

    //detect collision with obstacles
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
    //check if the player has crashed
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            gameOver();
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;

    //level up
    if ((myGameArea.frameNo / 500) % 1 == 0) {
        levelUp();
    }

    //create obstacle
    if (myGameArea.frameNo == myGameArea.nextObstacle) {
        var height, gap, minHeight, maxHeight;
        var screenRHS = myGameArea.canvas.width;
        var screenHeight = myGameArea.canvas.height;

        //set when the next obstacle is
        myGameArea.nextObstacle = myGameArea.frameNo + myGameArea.obstacleInterval;

        //make the gap
        gap = Math.floor(Math.random()*(myGameArea.gapMaxSize-myGameArea.gapMinSize+1)+myGameArea.gapMinSize);

        //set the height of the gap
        maxHeight = 0.1 * screenHeight;
        minHeight = screenHeight - gap;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

        myObstacles.push(new obstacle(20, height, "blue", screenRHS, 0)); // top of obstacle
        myObstacles.push(new obstacle(20, screenHeight, "blue", screenRHS, height + gap)); //bottom
    }

    //move the obstacles
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    //update the scores
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.updateScore();

    //update the block's position
    myGamePiece.newPos();
    myGamePiece.update();
}

function levelUp() {
    // increase the obstacle frequency
    if (myGamePiece.width < Math.floor(0.95 * myGameArea.obstacleInterval)) {
        myGameArea.obstacleInterval = Math.floor(0.95 * myGameArea.obstacleInterval);
    }

    // make the gaps smaller
    if (0.9 * myGameArea.maxGap > myGameArea.minGap) {
        myGameArea.maxGap = 0.9 * myGameArea.maxGap;
    }
    else {
        myGameArea.maxGap = myGameArea.minGap;
    }
}

function jump() {
    myGamePiece.speedY += -8;
    myGamePiece.newPos();
    myGamePiece.update();
}