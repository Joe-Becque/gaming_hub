var myGamePiece;
var myScore;
var myObstacles       = [];
var width             = 600;
var height            = 500;
var frameInterval     = 20;    //millis between each frame
var jumpSpeedIncrease = 7;     //pixels per frame
var gameGravity       = 0.5;   //pixels per frame per frame
var obstacleWidth     = 20;    //pixels
var startingObstacleInterval = 150 //frames between new obstacles

var myGameArea = {
    //define the playing area
    canvas : document.createElement("canvas"),
    start : function() {
        myObstacles = []
        this.canvas.width = width;
        this.canvas.height = height;
        this.blockDim = 30  ;
        this.gapMaxSize = 6 * this.blockDim;
        this.gapMinSize = 4.2 * this.blockDim;
        this.frameNo = 0;
        this.obstacleInterval = startingObstacleInterval;
        this.nextObstacle = 1;   //frame number of next obstacle to be created
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear : function() {
        //clear the contents of the game area
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function getReady() {
    myGameArea.start();
    var ctx = myGameArea.context

    //start button
    var buttonW = 200;
    var buttonH = 100;
    var buttonX = (0.5 * myGameArea.canvas.width) - (0.5 * buttonW);
    var buttonY = (0.5 * myGameArea.canvas.height) - (0.5 * buttonH);
    ctx.fillStyle = 'red';
    ctx.fillRect(buttonX, buttonY, buttonW, buttonH);
    //start text
    var textStartX = 0.5 * myGameArea.canvas.width;
    var textStartY = (0.5 * myGameArea.canvas.height) - 22;
    ctx.font = 'bolder 20px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Any key to',  textStartX, textStartY);
    ctx.fillText('start', textStartX, textStartY + 25);
    ctx.fillText('[SPACE to jump]', textStartX, textStartY + 55);

    document.addEventListener('keydown', startEvent);
}

function startEvent(event) {
        document.removeEventListener('keydown', startEvent);
        startGame();
}

function startGame() {
    myGameArea.start();
    myGameArea.interval = setInterval(updateGameArea, frameInterval); //update the game area every frameInterval
    var blockStartingPos = myGameArea.canvas.width / 10;
    myGamePiece = new block(myGameArea.blockDim, myGameArea.blockDim, blockStartingPos, 0);
    document.addEventListener('keydown', jump);
    myScore = new scoreboard();
 }

 function jump(event) {
     if (event.key == ' ' || event.key == 'Spacebar') {
         myGamePiece.speedY  = -jumpSpeedIncrease;
         myGamePiece.newPos();
         myGamePiece.update();
     }
 }

function gameOver() {
    clearInterval(myGameArea.interval);
    document.removeEventListener('keydown', jump);

    //game over box
    var boxWidth = 0.6 * myGameArea.canvas.width;
    var boxHeight = 0.6 * myGameArea.canvas.height;
    var boxX = (0.5 * myGameArea.canvas.width) - (0.5 * boxWidth);
    var boxY = (0.5 * myGameArea.canvas.height) - (0.5 * boxHeight);
    ctx.fillStyle = 'black';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    //game over text
    var textGOX = 0.5 * myGameArea.canvas.width;
    var textGOY = 0.4 * myGameArea.canvas.height;
    ctx.font = 'bolder 30px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', textGOX, textGOY);
    //retry text
    var textRetryX = 0.5 * myGameArea.canvas.width;
    var textRetryY = 0.6 * myGameArea.canvas.height;
    ctx.font = 'bold 20px Courier New';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('click to retry', textRetryX, textRetryY);

    document.addEventListener('click', retry);
}

function retry(event) {
    document.removeEventListener('click', retry);
    getReady();
}

function scoreboard() {
    var posX = (myGameArea.canvas.width / 2);
    var posY = 25;

    this.updateScore = function() {
        ctx = myGameArea.context;
        ctx.font = "30px Consolas";
        ctx.textAlign = 'center';
        ctx.fillStyle = 'black';
        ctx.lineWidth = 3
        ctx.strokeStyle = "gray";
        ctx.strokeText(this.text, posX, posY);
        ctx.fillText(this.text, posX, posY);
    }
}

function obstacle(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.image = new Image();
    this.image.src = "../images/lava.jpg";

    //update the player area with the new position
    this.update = function() {
      //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      myGameArea.context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
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

        //make the gap size in pixels
        gap = Math.random()*(myGameArea.gapMaxSize-myGameArea.gapMinSize+1)+myGameArea.gapMinSize;

        //set the position of the gap (position where the top obstacle will stop)
        maxHeight = 1;
        minHeight = (screenHeight - gap) - 1;
        var topObstacleHeight = Math.random()*(maxHeight-minHeight+1)+minHeight;
        var topObstacleTop = 0;
        var bottomObstacleHeight = screenHeight - topObstacleHeight - gap;
        var bottomObstacleTop = screenHeight - bottomObstacleHeight;

        myObstacles.push(new obstacle(obstacleWidth, topObstacleHeight, screenRHS, topObstacleTop));       // top section of obstacle
        myObstacles.push(new obstacle(obstacleWidth, bottomObstacleHeight, screenRHS, bottomObstacleTop)); // bottom section of obstacle
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
    if (1.5 * myGamePiece.width < Math.floor(0.95 * myGameArea.obstacleInterval)) {
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