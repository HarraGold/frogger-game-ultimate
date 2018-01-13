
//Utility properties for rendering management
var RenderingUtility = {
bgPatch : 'images/bg-patch.PNG',
isPatchActive:true,
isGreenGemActive:false,
isBlueGemActive:false,
isCollisionOopsActive:false,
isCollisionOmgActive:false,
omgPositionX: 430,
oopsPositionX: 10,
omgAndOopsPositionY: 10,
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x =0;
    this.y =0;
    this.name='bug';
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //resets enemy position
    if(this.x > 505){
        this.x = 0;
    }

    //enemy1
    if(this.name==='bug1'){
        this.x +=120 * dt;
    }
    //enemy2
    else if(this.name==='bug2'){
        this.x +=200 * dt;
    }
    //enemy3
    else if(this.name==='bug3'){
        this.x +=180 * dt;
    }

    this.checkCollision();
};

Enemy.prototype.checkCollision = function (){
    var collisionX = Math.abs(this.x - player.x);
    var collisionY = Math.abs(this.y - player.y);

    if(collisionX < 65 && collisionY < 70){
       player.previousPoints = player.pts;
       if(player.pts < 10){
            player.pts = 0;
       }
       else{
            player.pts = player.pts - 10;
            RenderingUtility.isCollisionOopsActive = true;
            RenderingUtility.isBadSpeechActive = true;
       }
       displayPlayerPoints();
       player.resetPlayer();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-horn-girl.png';
    this.x =200;
    this.y =400;
    this.pts = 0;
    this.previousPoints = 0;
    this.ptsBubblePositive = 'images/speech-bubble-good.gif';
    this.ptsBubbleNegative = 'images/speech-bubble-negative.gif';
    this.collisionOmg = "images/collision-omg.PNG";
    this.collisionOops = "images/collision-oops.PNG";
};

Player.prototype.update = function(){
//recenter player if player is past x-axis or bottom of y-axis
if( this.x < 0 || this.x >= 500){
    this.resetPlayer();
}
//display points if player reaches water zone or top of canvas
else if(hasReachedWaterZone()){
    this.previousPoints = this.pts;
    this.pts+=10;
    displayPlayerPoints();
    this.resetPlayer();
    RenderingUtility.isCollisionOmgActive = true;
    }
}

var hasReachedWaterZone = function() {
    if(player.y<40)
        return true;
    else
        return false;
}

var displayPlayerPoints = function(){
//removes placeholder point of 0 on index.html, and adds updated point
	var pointHeader = document.getElementById("points");

    var ptsPlaceHolder = document.createElement("P");
    var pts = document.createTextNode("Points:"+player.pts+"");
    ptsPlaceHolder.appendChild(pts);

    $("#dummy-pts").remove();
    while (pointHeader.firstChild) {
        pointHeader.removeChild(pointHeader.firstChild);
    }
        pointHeader.appendChild(ptsPlaceHolder);
}

var initCoverCollisionEffects = function (){
    if(RenderingUtility.isPatchActive){
        ctx.drawImage(Resources.get(RenderingUtility.bgPatch), RenderingUtility.omgPositionX, RenderingUtility.omgAndOopsPositionY);
        ctx.drawImage(Resources.get(RenderingUtility.bgPatch), RenderingUtility.oopsPositionX, RenderingUtility.omgAndOopsPositionY);
        RenderingUtility.isPatchActive=false;
        }
    }

    Player.prototype.displayCollisionEffect = function(){
    if(!RenderingUtility.isCollisionOopsActive && RenderingUtility.isCollisionOmgActive){
        ctx.drawImage(Resources.get(this.collisionOmg), RenderingUtility.omgPositionX, RenderingUtility.omgAndOopsPositionY);
        ctx.drawImage(Resources.get(RenderingUtility.bgPatch), RenderingUtility.oopsPositionX, RenderingUtility.omgAndOopsPositionY);
        RenderingUtility.isCollisionOmgActive = false;
    }
    else if(!RenderingUtility.isCollisionOmgActive && RenderingUtility.isCollisionOopsActive ){
        ctx.drawImage(Resources.get(this.collisionOops), RenderingUtility.oopsPositionX, RenderingUtility.omgAndOopsPositionY);
        ctx.drawImage(Resources.get(RenderingUtility.bgPatch), RenderingUtility.omgPositionX, RenderingUtility.omgAndOopsPositionY);
        RenderingUtility.isCollisionOopsActive = false;
        }
}

Player.prototype.resetPlayer = function(){
    this.x = 200;
    this.y = 400;
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//todo: For future versions: can use a flag to limit overprocessing bubbles, or ngHide/Show
Player.prototype.renderSpeechBubble = function(points) {
    if(this.previousPoints < points){
        ctx.drawImage(Resources.get(this.ptsBubblePositive), this.x+55, this.y+30);
    }
    else if(this.previousPoints > points){
        ctx.drawImage(Resources.get(this.ptsBubbleNegative), this.x+55, this.y+30);
    }
};

var renderGemReward = function() {
    var posX =240;
    var posY =10;
    if(player.pts >= 100 && player.pts < 250 && !RenderingUtility.isGreenGemActive)
        ctx.drawImage(Resources.get('images/Gem Greene-sm-tp.PNG'), posX , posY);
    else if(player.pts >=250 && player.pts < 500 && !RenderingUtility.isBlueGemActive)
        ctx.drawImage(Resources.get('images/Gem Blue-sm-tp.PNG'), posX, posY);
    else if(player.pts >= 500)
        ctx.drawImage(Resources.get('images/Gem Gold-sm-tp.PNG'), posX, posY);
};

Player.prototype.handleInput = function(movePlayer){
    if(movePlayer === 'left'){
        this.x += -100;
    }
    else if(movePlayer === 'up'){
        this.y += -90;
    }
    else if(movePlayer === 'right'){
        this.x += +100;
    }
    else if(movePlayer === 'down'){
        this.y += +90;
    }

    /**Code below allows the player to be rendered via keys as the player
    //has not reached the water zone. It also fixes the player smear
    //when player is moved at boundary of canvas on the y-axis.
    //player update() function above resolves rendering if the player has reached the water zone.
    //The smear effect of player at the boundary of the y-axis influenced this coding
    note: code below can be refactored/consolidated w/ update function above
    **/
    if(!hasReachedWaterZone()){
    //recenter if players is bottom-boundary of canvas
        if (this.y > 400){
            this.resetPlayer();
            this.render();
        }
        //otherwise render player
        else
        {
            this.render();
        }
    }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//todo: can  somehow refactor these objects into a one global init function, maybe with IIFE
//var initEnemyAndPlayer{....}
var enemy1 = new Enemy();
enemy1.x = 50;
enemy1.y = 55;
enemy1.name = 'bug1';

var enemy2 = new Enemy();
enemy2.y = 145;
enemy2.name = 'bug2';
var enemy3 = new Enemy();
enemy3.x= 320;
enemy3.y= 225;
enemy3.name = 'bug3';

var allEnemies = [enemy1,enemy2,enemy3];

var player = new Player();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});